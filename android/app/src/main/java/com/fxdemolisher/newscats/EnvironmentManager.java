package com.fxdemolisher.newscats;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;

import java.util.UUID;

/**
 * Utility for initializing the application's environment.
 */
public class EnvironmentManager {
    /**
     * Returns an instance of {@link Environment} for the current build config.
     */
    public static Environment fromContext(Context context) {
        // Get the name of our environment.
        String environmentName = BuildConfig.ENVIRONMENT_NAME;

        // Make sure the installation ID is present.
        SharedPreferences globalPreferences = PreferenceManager.getDefaultSharedPreferences(context);
        String installationId = getInstallationId(globalPreferences);

        // Initialize the environment.
        Environment environment = new Environment(
            environmentName,
            installationId,
            globalPreferences.getBoolean(Flags.LOCAL_BUNDLE_IN_DEBUG, false),
            "debug".equals(environmentName),
            BuildConfig.APPLICATION_ID,
            BuildConfig.VERSION_NAME,
            Integer.toString(BuildConfig.VERSION_CODE),
            BuildConfig.BUILD_MACHINE_IP
        );

        return environment;
    }

    /**
     * Sets the installationId global setting to a new random guid if it is not yet set.
     * @return the current value of the installation ID.
     */
    private static String getInstallationId(SharedPreferences globalPreferences) {
        String uuidString = globalPreferences.getString(Flags.INSTALLATION_ID, null);
        if (uuidString == null) {
            uuidString = UUID.randomUUID().toString();
            globalPreferences
                .edit()
                .putString(Flags.INSTALLATION_ID, uuidString)
                .apply();
        }

        return uuidString;
    }

    /**
     * Sets the 'localBundleInDebug' flag to the given value.
     */
    public static void setLocalBundleInDebug(Context context, boolean localBundleInDebug) {
        PreferenceManager.getDefaultSharedPreferences(context)
            .edit()
            .putBoolean(Flags.LOCAL_BUNDLE_IN_DEBUG, localBundleInDebug)
            .apply();
    }
}
