package com.fxdemolisher.newscats;

import android.app.Activity;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * A react native bridge that exposes various native navigation actions.
 */
public class NavigationBridge extends ReactContextBaseJavaModule {
    public NavigationBridge(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "nav";
    }

    /**
     * When called, resets the environment and restarts the main RN activity (restarting the RN app).
     */
    @ReactMethod
    public void restart() {
        MainApplication application = (MainApplication) getReactApplicationContext().getApplicationContext();
        application.resetEnvironment();

        final Activity currentActivity = getReactApplicationContext().getCurrentActivity();
        if (currentActivity == null) {
            return;
        }

        getReactApplicationContext().runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                currentActivity.recreate();
            }
        });
    }
}
