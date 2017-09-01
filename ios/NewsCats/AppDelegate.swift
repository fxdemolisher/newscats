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
    var environment: EnvironmentManager.Environment?
    var latestKnownLaunchOptions: [UIApplicationLaunchOptionsKey: Any]?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        
        // Initialize fabric.
        initializeFabric()
        
        // Reset our environment so that it is available to the RN view controller.
        reset()
        
        // Save last launch options for the RN view controller to use later.
        self.latestKnownLaunchOptions = launchOptions

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
        guard let path = Bundle.main.path(forResource: "GlobalConfig-Info", ofType: "plist") else {
            print ("WARNING: No global config found, skipping fabric initialization")
            return
        }
        
        let infoDict = NSDictionary(contentsOfFile: path) as! [String : Any]
        let apiKey = infoDict["FABRIC_API_KEY"] as! String
        guard !apiKey.isEmpty else {
            print ("WARNIGN: global config found, but API key is blank, skipping fabric initialization")
            return
        }
        
        Crashlytics.start(withAPIKey: apiKey)
    }
}
