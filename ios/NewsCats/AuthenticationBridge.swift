import React
import UIKit

/**
 * Allows access to our AuthenticationManager and manages notifying the RN environment when auth changes
 * have occurred.
 */
class AuthenticationBridge : RCTEventEmitter, AuthenticationListener {
    let identifier: String
    private let presenter: UIViewController
    
    init(_ presenter: UIViewController) {
        self.identifier = String(Int(arc4random()))
        self.presenter = presenter
    }
    
    /**
     * Returns the name that the module is exposed under in RN.
     */
    public override static func moduleName() -> String! {
        return "auth"
    }
    
    /**
     * Returns a list of methods to expose to RN.
     */
    override func methodsToExport() -> [RCTBridgeMethod]! {
        return [
            BridgeMethodWrapper(name: "isConfigured", .promise(isConfigured)),
            BridgeMethodWrapper(name: "configure", .promise(configure)),
            BridgeMethodWrapper(name: "isAuthorized", .promise(isAuthorized)),
            BridgeMethodWrapper(name: "deauthorize", .promise(deauthorize)),
            BridgeMethodWrapper(name: "authorize", .promise(authorize)),
            BridgeMethodWrapper(name: "getAccessToken", .promise(getAccessToken)),
            BridgeMethodWrapper(name: "reset", .promise(reset)),
        ]
    }
    
    /**
     * Returns a list of events that this bridge will emit.
     */
    override func supportedEvents() -> [String]! {
        return [
            "onAuthorizationProviderStateChanged"
        ]
    }
    
    /**
     * Returns a promise that resolves to the given provider's configured status in the AuthenticationManager.
     */
    func isConfigured(_ bridge: RCTBridge, _ arguments: [Any], _ resolve: RCTPromiseResolveBlock,
                      _ reject: RCTPromiseRejectBlock) throws {
        
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        let provider = arguments[0] as! String
        resolve(appDelegate.authenticationManager!.isConfigured(provider))
    }
    
    /**
     * Returns a promise that resolves when configuring the requested provider via AuthenticationManager
     * completes.
     */
    func configure(_ bridge: RCTBridge, _ arguments: [Any], _ resolve: RCTPromiseResolveBlock,
                   _ reject: RCTPromiseRejectBlock) throws {
        
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        
        let provider = arguments[0] as! String
        let authorizationUrl = arguments[1] as! String
        let tokenUrl = arguments[2] as! String
        let customUserAgentString = arguments[3] as! String
        
        appDelegate.authenticationManager!.configure(
            provider: provider,
            authorizationUrl: authorizationUrl,
            tokenUrl: tokenUrl,
            customUserAgentString: customUserAgentString
        )
        
        resolve(nil)
    }
    
    /**
     * Returns a promise that resolves to the given provider's authorized status in the AuthenticationManager.
     */
    func isAuthorized(_ bridge: RCTBridge, _ arguments: [Any], _ resolve: RCTPromiseResolveBlock,
                      _ reject: RCTPromiseRejectBlock) throws {
        
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        let provider = arguments[0] as! String
        resolve(appDelegate.authenticationManager!.isAuthorized(provider))
    }
    
    /**
     * Returns a promise that resolves when the given provider has been de-authorized via AuthenticationManager.
     */
    func deauthorize(_ bridge: RCTBridge, _ arguments: [Any], _ resolve: RCTPromiseResolveBlock,
                     _ reject: RCTPromiseRejectBlock) throws {
        
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        let provider = arguments[0] as! String
        resolve(appDelegate.authenticationManager!.deauthorize(provider))
    }
    
    /**
     * Starts the authorization flow for the given provider and specific authorization parameters.
     * Returns a promise that resolves once authorization has started via AuthenticationManager.
     */
    func authorize(_ bridge: RCTBridge, _ arguments: [Any], _ resolve: RCTPromiseResolveBlock,
                   _ reject: RCTPromiseRejectBlock) throws {
        
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        
        let provider = arguments[0] as! String
        let clientId = arguments[1] as! String
        let scopes = arguments[2] as! [String]
        let additionalParameters = arguments[3] as! [String: String]
        
        appDelegate.authenticationManager!.authorize(
            presenter: presenter,
            provider: provider,
            clientId: clientId,
            scopes: scopes,
            additionalParameters: additionalParameters
        )
        
        resolve(nil)
    }
    
    /**
     * Returns a promise that resolves to a provider's current (or fresh) access token and other parameters
     * via AuthenticationManager.
     *
     * Current resolved object includes:
     *   - accessToken
     *   - customUserAgentString
     */
    func getAccessToken(_ bridge: RCTBridge, _ arguments: [Any],
                        _ resolve: @escaping RCTPromiseResolveBlock,
                        _ reject: RCTPromiseRejectBlock) throws {
        
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        let provider = arguments[0] as! String
        
        appDelegate.authenticationManager!.withAccessToken(provider: provider) { accessToken, configuration in
            
            resolve([
                "accessToken": accessToken,
                "customUserAgentString": configuration.customUserAgentString,
            ])
        }
    }
    
    /**
     * Resets the entire OAuth2 authentication system via AuthenticationManager, returning a promise
     * that resolves once the reset is complete.
     */
    func reset(_ bridge: RCTBridge, _ arguments: [Any], _ resolve: RCTPromiseResolveBlock,
                 _ reject: RCTPromiseRejectBlock) throws {
        
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        appDelegate.authenticationManager!.reset()
        resolve(nil)
    }
    
    /**
     * Called from AuthenticationManager every time a provider's configuration/authorization state changes.
     * We emit the native event to JS via the DeviceEventEmitter.
     */
    public func onProviderStateChanged() {
        sendEvent(withName: "onAuthorizationProviderStateChanged", body: nil)
    }
}
