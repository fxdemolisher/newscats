package com.fxdemolisher.newscats;

import android.app.Application;

import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;

import java.util.Arrays;
import java.util.List;

/**
 * React native host for the entire application.
 * Defines available bridges and customization endpoints.
 */
public class MainReactNativeHost extends ReactNativeHost {
    public MainReactNativeHost(Application application) {
        super(application);
    }

    @Override
    public boolean getUseDeveloperSupport() {
        MainApplication application = (MainApplication) getApplication();
        Environment environment = application.getEnvironment();
        return ("debug".equals(environment.name) && !environment.localBundleInDebug);
    }

    @Override
    protected String getJSMainModuleName() {
        return (getUseDeveloperSupport() ? "js/index.android" : super.getJSMainModuleName());
    }

    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            // Core react package, filtered if needed for customized view managers, etc.
            new FilteredMainReactPackage(),

            // Linear gradient native support.
            new LinearGradientPackage(),

            // Customized view managers and this application's bridges.
            new ApplicationReactPackage()
        );
    }
}
