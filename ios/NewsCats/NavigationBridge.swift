import React
import UIKit

/**
 * A RN->Native bridge supporting various navigation features that cannot be done in RN.
 */
class NavigationBridge : NSObject, RCTBridgeModule {
    /**
     * Returns the name that the module is exposed under in RN.
     */
    static func moduleName() -> String! {
        return "nav"
    }
    
    /**
     * Returns a list of methods to expose to RN.
     */
    func methodsToExport() -> [RCTBridgeMethod]! {
        return [
            BridgeMethodWrapper(name: "restart", .oneWay(restart)),
        ]
    }
    
    /**
     * Restarts the RN bridge, effectively restarting the UI portion of the app.
     */
    func restart(_ bridge: RCTBridge, _ arguments: [Any]) throws -> Void {
        let currentDispatchQueueLabel = String(validatingUTF8: __dispatch_queue_get_label(nil))!
        let isOnMainDispatchQueue = currentDispatchQueueLabel == DispatchQueue.main.label
        
        let restartOperation = {
            let appDelegate = UIApplication.shared.delegate as! AppDelegate
            appDelegate.reset()
            bridge.reload()
        }
        
        guard !isOnMainDispatchQueue else {
            restartOperation()
            return
        }
        
        return DispatchQueue.main.sync(execute: restartOperation)
    }
}
