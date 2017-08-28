import React
import UIKit

/**
 * Allows access to our Environment definition as a serialized JSON value.
 */
class EnvironmentBridge : NSObject, RCTBridgeModule {
    /**
     * Returns the name that the module is exposed under in RN.
     */
    public static func moduleName() -> String! {
        return "env"
    }
    
    /**
     * Returns a list of methods to expose to RN.
     */
    func methodsToExport() -> [RCTBridgeMethod]! {
        return [
            BridgeMethodWrapper(name: "current", .callback(currentEnvironment)),
            BridgeMethodWrapper(name: "localBundleInDebug", .oneWay(localBundleInDebug)),
        ]
    }
    
    /**
     * Returns the current environment of the app as a serialized JSON string.
     */
    func currentEnvironment(_ bridge: RCTBridge, _ arguments: [Any],
                            _ callback: @escaping (Any?, Any?) -> Void) throws -> Void {
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        let environment = appDelegate.environment!
        let jsonContent = try! environment.toJSON().serialize()
        let json = String(data: jsonContent, encoding: String.Encoding.utf8)!
        
        callback(nil, json)
    }
    
    /**
     * Used to set the 'localBundleInDebug' flag in UserDefaults, which controls where
     * the react native JS bundle is loaded from when in debug mode.
     */
    func localBundleInDebug(_ bridge: RCTBridge, _ arguments: [Any]) throws -> Void {
        guard arguments.count == 1, let localBundleInDebug = arguments[0] as? Bool else {
            throw InvalidBridgeArgumentError(
                message: "localBundleInDebug requires one (boolean) parameter",
                arguments: arguments
            )
        }
        
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        let environment = appDelegate.environment!
        
        guard environment.allowDebugActions else {
            throw InvalidBridgeArgumentError(
                message: "localBundleInDebug cannot be used when not in debug actions mode",
                arguments: arguments
            )
        }
        
        UserDefaults.standard.set(localBundleInDebug, forKey: "localBundleInDebug")
    }
}
