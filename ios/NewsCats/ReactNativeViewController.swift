import Foundation
import React
import UIKit

/**
 * A view controller that hosts our entire react native app.
 */
class ReactNativeViewController : UIViewController, RCTBridgeDelegate {
    // Hide the phone's status bar.
    override var prefersStatusBarHidden : Bool {
        return true
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Grab the last known launch options from the app delegate.
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        let launchOptions = appDelegate.latestKnownLaunchOptions
        
        // Create the RN bridge, listing ourselves as the delegate, which allows us to configure the bridge.
        let bridge = RCTBridge(delegate: self, launchOptions: launchOptions)
        
        // Create the root view to render our RN app.
        let reactNativeView = RCTRootView(
            bridge: bridge,
            moduleName: "NewsCats",
            initialProperties: [:]
        )!
        
        // Make sure it is on black background in case we have some transparent portions.
        reactNativeView.backgroundColor = .black
        
        self.view = reactNativeView
    }
    
    /**
     * Called by the RN bridge to figure out where to load the app bundle from.
     */
    func sourceURL(for bridge: RCTBridge!) -> URL! {
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        let globalConfig = appDelegate.globalConfig!
        let environment = appDelegate.environment!
        
        var buildMachineIp = environment.buildMachineIp
        if let override = globalConfig.buildMachineIpOverride, !override.isEmpty {
            buildMachineIp = override
        }
        
        var bundleUrl = Bundle.main.url(forResource: "main", withExtension: "jsbundle")!
        if (environment.name == "debug" && !environment.localBundleInDebug) {
            bundleUrl = URL(string: "http://\(buildMachineIp):8081/js/index.ios.bundle")!
        }
        
        return bundleUrl
    }
    
    /**
     * Called by the RN bridge for a list of bridge modules to expose to the RN code.
     * We use this hook instead of objc macros since the syntax is a bit cleaner in swift.
     */
    func extraModules(for bridge: RCTBridge!) -> [RCTBridgeModule]! {
        return [
            // NOTE: Add bridge modules here. Remember, modules need to expose at least one value (constant) 
            //       or method, or they will not be visible in RN.
            EnvironmentBridge(),
            NavigationBridge(),
        ]
    }
}
