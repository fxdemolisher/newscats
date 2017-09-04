import Freddy

/**
 * Utility to initialize our GlobalConfig.
 */
struct GlobalConfigManager {
    /**
     * Holds the global configuration loaded from the dotenv (../env) file that spans the entire application
     * and both platforms.
     */
    struct GlobalConfig {
        let fabricApiKey: String?
        let buildMachineIpOverride: String?
    }

    /**
     * Returns a GlobalConfig instance, loaded from a plist file created from our dotenv (../env) file
     * during the build process.
     */
    static func create() -> GlobalConfig {
        var fabricApiKey: String? = nil
        var buildMachineIpOverride: String? = nil
        
        if let path = Bundle.main.path(forResource: "GlobalConfig-Info", ofType: "plist") {
            let infoDict = NSDictionary(contentsOfFile: path) as! [String : Any]
            fabricApiKey = infoDict["FABRIC_API_KEY"] as? String
            buildMachineIpOverride = infoDict["BUILD_MACHINE_IP_OVERRIDE"] as? String
        } else {
            print ("WARNING: No global config found, skipping initialization")
        }
        
        return GlobalConfig(
            fabricApiKey: fabricApiKey,
            buildMachineIpOverride: buildMachineIpOverride
        )
    }
}

/**
 * JSON serialization support for global config instances.
 */
extension GlobalConfigManager.GlobalConfig : JSONEncodable {
    func toJSON() -> JSON {
        var fabricApiKeyJson: JSON = .null
        if let fabricApiKeyActual = fabricApiKey {
            fabricApiKeyJson = .string(fabricApiKeyActual)
        }
        
        var buildMachineIpOverrideJson: JSON = .null
        if let buildMachineIpOverrideActual = buildMachineIpOverride {
            buildMachineIpOverrideJson = .string(buildMachineIpOverrideActual)
        }
        
        return .dictionary([
            "fabricApiKey": fabricApiKeyJson,
            "buildMachineIpOverride": buildMachineIpOverrideJson,
        ])
    }
}
