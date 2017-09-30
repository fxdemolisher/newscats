import AppAuth
import Foundation
import Freddy
import SwiftKeychainWrapper
import os

// Logger for this module
let LOG = OSLog(subsystem: Bundle.main.bundleIdentifier!, category: "auth")

/**
 * Defines the configuration and current authorized state for a provider.
 * Instances of this class are persisted to the keychain.
 */
class ProviderConfiguration : NSObject, NSSecureCoding {
    let serviceConfiguration: OIDServiceConfiguration
    let authState: OIDAuthState?
    let customUserAgentString: String?
    
    public static var supportsSecureCoding: Bool { return true }
    
    init(serviceConfiguration: OIDServiceConfiguration, authState: OIDAuthState?,
         customUserAgentString: String?) {
        self.serviceConfiguration = serviceConfiguration
        self.authState = authState
        self.customUserAgentString = customUserAgentString
        
        super.init()
    }
    
    public required convenience init?(coder aDecoder: NSCoder) {
        guard let serviceConfiguration = aDecoder.decodeObject(of: OIDServiceConfiguration.self,
                                                               forKey: "serviceConfiguration") else {
            return nil
        }
        
        let authState = aDecoder.decodeObject(of: OIDAuthState.self, forKey: "authState")
        let customUserAgentString = aDecoder.decodeObject(of: NSString.self,
                                                          forKey: "customUserAgentString")
        
        self.init(
            serviceConfiguration: serviceConfiguration,
            authState: authState,
            customUserAgentString: customUserAgentString as String?
        )
    }
    
    public func encode(with aCoder: NSCoder) {
        aCoder.encode(serviceConfiguration, forKey: "serviceConfiguration")
        aCoder.encode(authState, forKey: "authState")
        aCoder.encode(customUserAgentString, forKey: "customUserAgentString")
    }
}

/**
 * Wrapper around a map of provider->ProviderConfiguration that use used for coded peristance.
 */
class PersistentStorage : NSObject, NSSecureCoding {
    let storage: [String: ProviderConfiguration]
    
    public static var supportsSecureCoding: Bool { return true }
    
    init(_ storage: [String: ProviderConfiguration]) {
        self.storage = storage
        
        super.init()
    }
    
    public required convenience init?(coder aDecoder: NSCoder) {
        guard let storageCandidate = aDecoder.decodeObject(forKey: "storage") as? [String: ProviderConfiguration] else {
            return nil
        }
        
        self.init(storageCandidate)
    }
    
    public func encode(with aCoder: NSCoder) {
        aCoder.encode(storage, forKey: "storage")
    }
}

/**
 * Defines a protocol for components that wish to be notified when provider state has changed.
 * For now this is done across all providers in one shot instead of specifying which provider has changed.
 * It is up to the implementor to query the manager for more information.
 */
protocol AuthenticationListener {
    var identifier: String { get }
    
    /**
     * Called when a provider's configuration or authorization state has changed.
     */
    func onProviderStateChanged()
}

/**
 * Utility that acts as an OAuth2 client for generic OAuth2 providers, with persistent storage and handling
 * of returned results. Heavily leans on the https://github.com/openid/AppAuth-iOS library for OAuth2 functionality.
 */
class AuthenticationManager {
    let redirectURL: URL
    var listeners: [AuthenticationListener]
    var storage: [String: ProviderConfiguration]
    var ongoingSession: OIDAuthorizationFlowSession?
    
    /**
     * Constructs a new authentication manager.
     */
    init(_ envrionment: EnvironmentManager.Environment) {
        self.redirectURL = URL(string: envrionment.bundleId + "://auth")!
        self.listeners = []
        
        let storedStorage = KeychainWrapper.standard.object(forKey: "auth",
                                                            withAccessibility: .afterFirstUnlock)
        if let storageCandidate = storedStorage as? PersistentStorage {
            self.storage = storageCandidate.storage
        } else {
            self.storage = [:]
        }
        
        self.ongoingSession = nil
    }
    
    /**
     * Fully resets the manager and its storage.
     * It is highly recommended that the app is restarted after this step.
     */
    func reset() {
        listeners.removeAll()
        storage = [:]
        updatePersistentStorage()
    }
    
    /**
     * Attaches a listener to the manager.
     */
    func addListener(_ listener: AuthenticationListener) {
        listeners.append(listener)
    }
    
    /**
     * Removes a listener from this manager.
     */
    func removeListener(_ listener: AuthenticationListener) {
        listeners = listeners.filter { $0.identifier != listener.identifier }
    }
    
    /**
     * Returns true if the given provider has been configured, false otherwise.
     */
    func isConfigured(_ provider: String) -> Bool {
        return storage[provider] != nil
    }
    
    /**
     * Configures a new provider. It is recommended that isConfigured is called first.
     */
    func configure(provider: String, authorizationUrl: String, tokenUrl: String,
                   customUserAgentString: String) {
        guard !isConfigured(provider) else {
            os_log("Provider %@ is already configured", log: LOG, type: .info, provider)
            return
        }
        
        let serviceConfiguration = OIDServiceConfiguration(
            authorizationEndpoint: URL(string: authorizationUrl)!,
            tokenEndpoint: URL(string: tokenUrl)!
        )
        
        let configuration = ProviderConfiguration(
            serviceConfiguration: serviceConfiguration,
            authState: nil,
            customUserAgentString: customUserAgentString
        )
        
        storage[provider] = configuration
        updatePersistentStorage()
    }
    
    /**
     * Return true if the given provider is configured and currently authorized (can perform actions).
     */
    func isAuthorized(_ provider: String) -> Bool {
        guard isConfigured(provider) else {
            return false
        }
        
        let configuration = storage[provider]!
        return configuration.authState != nil && (configuration.authState?.isAuthorized ?? false)
    }
    
    /**
     * Clears the authorization for the given provider without clearing its configuration. Basically a log out.
     */
    func deauthorize(_ provider: String) {
        guard isConfigured(provider) else {
            return
        }
        
        let configuration = storage[provider]!
        let newConfiguration = cloneConfiguration(configuration: configuration, authState: nil)
        
        storage[provider] = newConfiguration
        updatePersistentStorage()
    }
    
    /**
     * Helper for making copies of a config with a new auth state value.
     */
    private func cloneConfiguration(configuration: ProviderConfiguration,
                                    authState: OIDAuthState?) -> ProviderConfiguration {
        return ProviderConfiguration(
            serviceConfiguration: configuration.serviceConfiguration,
            authState: authState,
            customUserAgentString: configuration.customUserAgentString
        )
    }
    
    /**
     * Starts the authorization flow for the given provider and parameters.
     */
    func authorize(presenter: UIViewController, provider: String, clientId: String, scopes: [String],
                   additionalParameters: [String: String]) {
        guard let configuration = storage[provider] else {
            os_log("Provider %@ is not configured", log: LOG, type: .info, provider)
            return
        }
        
        let request = OIDAuthorizationRequest(
            configuration: configuration.serviceConfiguration,
            clientId: clientId,
            clientSecret: "",
            scopes: scopes,
            redirectURL: redirectURL,
            responseType: OIDResponseTypeCode,
            additionalParameters: additionalParameters
        )
        
        ongoingSession = OIDAuthState.authState(byPresenting: request,
                                                presenting: presenter) { authState, error in
            guard error == nil, let authStateActual = authState else {
                os_log("Error occured while authorizing: %@", log: LOG, type: .error,
                       String(reflecting: error))
                return
            }
            
            self.onAuthStateReceived(provider: provider, authState: authStateActual)
        }
    }
    
    /**
     * Returns true if there is an ongoing authorization session.
     */
    func hasOngoingSession() -> Bool {
        return ongoingSession != nil
    }
    
    /**
     * Called to continue an ongoing authorization session with the given redirect URL.
     */
    func resumeOngoingSession(with url: URL) {
        guard let session = ongoingSession else {
            return
        }
        
        session.resumeAuthorizationFlow(with: url)
        ongoingSession = nil
    }
    
    /**
     * Called when the final auth state (authorization + token) has been established.
     * Updates storage and persists it to the keychain.
     */
    private func onAuthStateReceived(provider: String, authState: OIDAuthState) {
        guard let configuration = storage[provider] else {
            os_log("Got auth state for an unconfigured provider: %@", log: LOG, type: .info, provider)
            return
        }
        
        let newConfiguration = cloneConfiguration(configuration: configuration, authState: authState)
        storage[provider] = newConfiguration
        updatePersistentStorage()
    }
    
    /**
     * Called to perform actions with a fresh access token for a provider. isAuthorized should be
     * called prior to calling this method. The provided action will be called once the token is
     * available.
     */
    func withAccessToken(provider: String, action: @escaping ((String, ProviderConfiguration) -> Void)) {
        guard isAuthorized(provider) else {
            os_log("Cannot perform action with an unauthorized provider: %@", log: LOG, type: .error, provider)
            return
        }
        
        let configuration = storage[provider]!
        configuration.authState!.performAction { accessTokenCandidate, _, error in
            guard error == nil, let accessToken = accessTokenCandidate else {
                os_log("Error retrieving token for : %@", log: LOG, type: .error, provider)
                return
            }
            
            action(accessToken, configuration)
        }
    }
    
    /**
     * Persists the current value of our storage to the keychain.
     */
    func updatePersistentStorage() {
        let persistentStorage = PersistentStorage(storage)
        KeychainWrapper.standard.set(persistentStorage,
                                     forKey: "auth",
                                     withAccessibility: .afterFirstUnlock)
        
        for listener in listeners {
            listener.onProviderStateChanged()
        }
    }
}

