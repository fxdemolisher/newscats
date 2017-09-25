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
        let redditClientId: String?
        let redditClientUsername: String?
    }

    /**
     * Returns a GlobalConfig instance, loaded from a plist file created from our dotenv (../env) file
     * during the build process.
     */
    static func create() -> GlobalConfig {
        let environmentName = Bundle.main.infoDictionary!["ENVIRONMENT_NAME"] as! String
        
        var fabricApiKey: String? = nil
        var buildMachineIpOverride: String? = nil
        var redditClientId: String? = nil
        var redditClientUsername: String? = nil
        
        if let path = Bundle.main.path(forResource: "GlobalConfig-Info", ofType: "plist") {
            let infoDict = NSDictionary(contentsOfFile: path) as! [String : Any]
            fabricApiKey = infoDict["FABRIC_API_KEY"] as? String
            buildMachineIpOverride = infoDict["BUILD_MACHINE_IP_OVERRIDE"] as? String
            
            redditClientId = infoDict["REDDIT_CLIENT_ID"] as? String
            redditClientUsername = infoDict["REDDIT_CLIENT_USERNAME"] as? String
            if (environmentName == "debug") {
                redditClientId = infoDict["DEBUG_REDDIT_CLIENT_ID"] as? String
                redditClientUsername = infoDict["DEBUG_REDDIT_CLIENT_USERNAME"] as? String
            }
        } else {
            print ("WARNING: No global config found, skipping initialization")
        }
        
        return GlobalConfig(
            fabricApiKey: fabricApiKey,
            buildMachineIpOverride: buildMachineIpOverride,
            redditClientId: redditClientId,
            redditClientUsername: redditClientUsername
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
        
        var redditClientIdJson: JSON = .null
        if let redditClientIdActual = redditClientId {
            redditClientIdJson = .string(redditClientIdActual)
        }
        
        var redditClientUsernameJson: JSON = .null
        if let redditClientUsernameActual = redditClientUsername {
            redditClientUsernameJson = .string(redditClientUsernameActual)
        }
        
        return .dictionary([
            "fabricApiKey": fabricApiKeyJson,
            "buildMachineIpOverride": buildMachineIpOverrideJson,
            "redditClientId": redditClientIdJson,
            "redditClientUsername": redditClientUsernameJson,
        ])
    }
}
