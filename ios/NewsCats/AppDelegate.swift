import Crashlytics
import Fabric
import Foundation
import UIKit

/**
 * Entry point into the native iOS app.
 */
@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    var globalConfig: GlobalConfigManager.GlobalConfig?
    var environment: EnvironmentManager.Environment?
    var authenticationManager: AuthenticationManager?
    
    var latestKnownLaunchOptions: [UIApplicationLaunchOptionsKey: Any]?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        
        // Initialize global config.
        globalConfig = GlobalConfigManager.create()
        
        // Initialize fabric.
        initializeFabric()
        
        // Reset our environment so that it is available to the RN view controller.
        reset()
        
        // Save last launch options for the RN view controller to use later.
        self.latestKnownLaunchOptions = launchOptions
        
        // Initialize the authentication manager.
        authenticationManager = AuthenticationManager(environment!)

        return true
    }
    
    func application(_ app: UIApplication,
                     open url: URL,
                     options: [UIApplicationOpenURLOptionsKey : Any]) -> Bool {
        guard let manager = authenticationManager, manager.hasOngoingSession() else {
            return false
        }
        
        manager.resumeOngoingSession(with: url)
        return true
    }
    
    /**
     * Utility to reload the environment. Useful if any flags are changed.
     */
    func reset() {
        let environmentName = Bundle.main.infoDictionary!["ENVIRONMENT_NAME"]
        environment = EnvironmentManager.initWithName(name: environmentName as! String)
    }
    
    /**
     * Initializes Fabric/Crashlytics if an API key is supplied via our environment.
     */
    func initializeFabric() {
        guard let fabricApiKey = globalConfig?.fabricApiKey, !fabricApiKey.isEmpty else {
            print ("WARNIGN: Fabric API key is blank or missing, skipping fabric initialization")
            return
        }
        
        Crashlytics.start(withAPIKey: fabricApiKey)
    }
}
