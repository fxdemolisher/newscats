package com.fxdemolisher.newscats;

import android.app.Application;
import android.preference.PreferenceManager;
import android.util.Log;

import com.crashlytics.android.Crashlytics;
import com.crashlytics.android.answers.Answers;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;

import io.fabric.sdk.android.Fabric;
import io.fabric.sdk.android.services.common.ApiKey;

/**
 * Application entry point. Responsible for initializing the RN environment as well as
 * the application environment.
 */
public class MainApplication extends Application implements ReactApplication {
    private ReactNativeHost host;
    private GlobalConfig globalConfig;
    private Environment environment;
    private AuthenticationManager authenticationManager;

    @Override
    public void onCreate() {
        super.onCreate();

        // Initialize global configuration first.
        globalConfig = new GlobalConfig();

        // Initialize Fabric.
        initializeFabric();

        // Initialize the environment.
        resetEnvironment();

        // Initialize the auth manager.
        authenticationManager = new AuthenticationManager(this, environment);

        // Initialize the RN host.
        host = new MainReactNativeHost(this);
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
        return host;
    }

    public GlobalConfig getGlobalConfig() {
        return globalConfig;
    }

    public Environment getEnvironment() {
        return environment;
    }

    public AuthenticationManager getAuthenticationManager() {
        return authenticationManager;
    }

    public void resetEnvironment() {
        environment = EnvironmentManager.fromContext(this);

        // Makes sure that the 'debug_http_host' global setting is set properly for our environment.
        // RN's dev bridge reads this setting to point to the dev server to download the bundle.
        String buildMachineIp = environment.buildMachineIp;
        if (!globalConfig.buildMachineIpOverride.trim().isEmpty()) {
            buildMachineIp = globalConfig.buildMachineIpOverride;
        }

        String debugHost = null;
        if (buildMachineIp != null && !buildMachineIp.trim().isEmpty()) {
            debugHost = (!environment.localBundleInDebug ? buildMachineIp + ":8081" : null);
        }

        PreferenceManager.getDefaultSharedPreferences(this)
                .edit()
                .putString(Flags.REACT_NATIVE_DEBUG_HOST_IP, debugHost)
                .apply();
    }

    private void initializeFabric() {
        // Don't initialize if there is no API key.
        try {
            (new ApiKey()).getValue(this);
        } catch(Throwable e) {
            Log.w("WARN", "No fabric API key included, skipping fabric set up.");
            return;
        }

        // Otherwise start up with Answers and Crashlytics.
        Fabric.with(
                this,
                new Answers(),
                new Crashlytics()
        );
    }
}
