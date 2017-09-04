package com.fxdemolisher.newscats;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Contains the configuration specified in the dotenv (../env) file that spans the entire app and both platforms.
 *
 * The config initializes itself via Android's BuildConfig file for our package and thus has no external
 * dependencies except the build system.
 */
public class GlobalConfig {
    public final String fabricApiKey;
    public final String buildMachineIpOverride;

    public GlobalConfig() {
        this.fabricApiKey = BuildConfig.GLOBAL_CONFIG_FABRIC_API_KEY;
        this.buildMachineIpOverride = BuildConfig.GLOBAL_CONFIG_BUILD_MACHINE_IP_OVERRIDE;
    }

    /**
     * Serializes the environment to a JSONObject instance.
     *
     * NOTE: If your project uses another JSON serialization library, just modify this function and
     *       it's usages.
     */
    public JSONObject toJsonObject() throws JSONException {
        return new JSONObject()
            .put("fabricApiKey", fabricApiKey)
            .put("buildMachineIpOverride", buildMachineIpOverride);
    }
}
