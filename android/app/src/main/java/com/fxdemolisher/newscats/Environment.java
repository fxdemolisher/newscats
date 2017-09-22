package com.fxdemolisher.newscats;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Describes the application's environment.
 */
public class Environment {
    // Generic flags.
    public final String name;
    public final String installationId;

    // RN specific flags.
    public final boolean localBundleInDebug;
    public final boolean allowDebugActions;

    // Application information.
    public final String bundleId;
    public final String version;
    public final String build;
    public final String buildMachineIp;

    public Environment(String name, String installationId, boolean localBundleInDebug, boolean allowDebugActions,
                       String bundleId, String version, String build, String buildMachineIp) {
        this.name = name;
        this.installationId = installationId;
        this.localBundleInDebug = localBundleInDebug;
        this.allowDebugActions = allowDebugActions;
        this.bundleId = bundleId;
        this.version = version;
        this.build = build;
        this.buildMachineIp = buildMachineIp;
    }

    /**
     * Serializes the environment to a JSONObject instance.
     *
     * NOTE: If your project uses another JSON serialization library, just modify this function and its usages.
     */
    public JSONObject toJsonObject() throws JSONException {
        return new JSONObject()
            .put("name", name)
            .put("installationId", installationId)
            .put("localBundleInDebug", localBundleInDebug)
            .put("allowDebugActions", allowDebugActions)
            .put("bundleId", bundleId)
            .put("version", version)
            .put("build", build)
            .put("buildMachineIp", buildMachineIp);
    }
}
