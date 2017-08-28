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
}
