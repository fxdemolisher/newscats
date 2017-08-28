import Freddy
import UIKit

/**
 * Utility for initializing the application's environment.
 */
struct EnvironmentManager {
    /**
     * Describes the application's environment.
     */
    struct Environment {
        // Generic flags.
        let name: String
        let installationId: String
        
        // RN specific flags.
        let localBundleInDebug: Bool
        let allowDebugActions: Bool
        
        // Application information.
        let bundleId: String
        let version: String
        let build: String
        let buildMachineIp: String
    }
    
    /**
     * Returns an instance of Environment for the current build config.
     */
    static func initWithName(name: String) -> Environment {
        // Basic info.
        let mainBundle = Bundle.main
        let version = mainBundle.infoDictionary?["CFBundleShortVersionString"] as! String
        let build = mainBundle.infoDictionary?[kCFBundleVersionKey as String] as! String
        
        // Installation id.
        var installationId = UserDefaults.standard.string(forKey: "installationId")
        if (installationId == nil) {
            installationId = UUID.init().uuidString
            UserDefaults.standard.set(installationId, forKey: "installationId")
        }
        
        // Local bundle or dev server (if in dev mode).
        var localBundleInDebug = false
        if let candidate = UserDefaults.standard.bool(forKey: "localBundleInDebug") as Bool? {
            localBundleInDebug = candidate
        }
        
        // Build machine IP retrieval.
        let path = Bundle.main.path(forResource: "BuildEnvironment-Info", ofType: "plist")!
        let infoDict = NSDictionary(contentsOfFile: path) as! [String : Any]
        let buildMachineIp = infoDict["BUILD_MACHINE_IP"] as! String
        
        return Environment(
            name: name,
            installationId: installationId!,
            localBundleInDebug: localBundleInDebug,
            allowDebugActions: ("debug" == name),
            bundleId: mainBundle.bundleIdentifier!,
            version: version,
            build: build,
            buildMachineIp: buildMachineIp
        )
    }
}

/**
 * JSON serialization support for environment instances.
 */
extension EnvironmentManager.Environment : JSONEncodable {
    func toJSON() -> JSON {
        return .dictionary([
            "name": .string(name),
            "installationId": .string(installationId),
            "localBundleInDebug": .bool(localBundleInDebug),
            "allowDebugActions": .bool(allowDebugActions),
            "bundleId": .string(bundleId),
            "version": .string(version),
            "build": .string(build),
            "buildMachineIp": .string(buildMachineIp),
        ])
    }
}
