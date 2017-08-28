package com.fxdemolisher.newscats;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.json.JSONException;

/**
 * A react native bridge that exposes current native environment information.
 */
public class EnvironmentBridge extends ReactContextBaseJavaModule {
    public EnvironmentBridge(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "env";
    }

    /**
     * When called, serializes the current environment to JSON and invokes the callback with the JSON as
     * the second parameter (null, envJson).
     */
    @ReactMethod
    public void current(Callback callback) {
        MainApplication application = (MainApplication) getReactApplicationContext().getApplicationContext();
        Environment environment = application.getEnvironment();

        String jsonString;
        try {
            jsonString = environment.toJsonObject().toString();
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

        callback.invoke(null, jsonString);
    }

    @ReactMethod
    public void localBundleInDebug(boolean localBundleInDebug) {
        EnvironmentManager.setLocalBundleInDebug(
            getReactApplicationContext().getApplicationContext(),
            localBundleInDebug
        );
    }
}
