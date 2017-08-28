package com.fxdemolisher.newscats;

import android.app.Application;
import android.preference.PreferenceManager;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;

/**
 * Application entry point. Responsible for initializing the RN environment as well as
 * the application environment.
 */
public class MainApplication extends Application implements ReactApplication {
    private ReactNativeHost host;
    private Environment environment;

    @Override
    public void onCreate() {
        super.onCreate();

        // Initialize the environment.
        resetEnvironment();

        // Initialize the RN host.
        host = new MainReactNativeHost(this);
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
        return host;
    }

    public Environment getEnvironment() {
        return environment;
    }

    public void resetEnvironment() {
        environment = EnvironmentManager.fromContext(this);

        // Makes sure that the 'debug_http_host' global setting is set properly for our environment.
        // RN's dev bridge reads this setting to point to the dev server to download the bundle.
        String debugHost = (!environment.localBundleInDebug ? environment.buildMachineIp + ":8081" : null);
        PreferenceManager.getDefaultSharedPreferences(this)
                .edit()
                .putString(Flags.REACT_NATIVE_DEBUG_HOST_IP, debugHost)
                .apply();
    }
}
