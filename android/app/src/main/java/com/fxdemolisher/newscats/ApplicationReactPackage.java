package com.fxdemolisher.newscats;

import com.facebook.react.LazyReactPackage;
import com.facebook.react.bridge.ModuleSpec;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.List;

import javax.inject.Provider;

/**
 * Defines the RN package for the application.
 */
public class ApplicationReactPackage extends LazyReactPackage {
    @Override
    public List<ModuleSpec> getNativeModules(final ReactApplicationContext reactContext) {
        return Arrays.asList(
            // NOTE: Add native bridge modules here.

            // Environment bridge:
            //   - current(callback) = serves up the current environment as a json string (second param).
            //   - localBundleInDebug(value) = sets the localBundleInDebug setting.
            createBridgeModuleSpec(new EnvironmentBridge(reactContext)),

            // Navigation bridge:
            //   - restart() = restarts the RN app.
            createBridgeModuleSpec(new NavigationBridge(reactContext))
        );
    }

    /**
     * @return a ModuleSpec instance created from the given NativeModule instance.
     */
    private ModuleSpec createBridgeModuleSpec(final NativeModule module) {
        return new ModuleSpec(
            module.getClass(),
            new Provider<NativeModule>() {
                @Override
                public NativeModule get() {
                    return module;
                }
            }
        );
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(
            // NOTE: Add custom view managers here.
            //       This is useful if you are using the FilteredMainReactPackage
            //       and are providing your own implementation.
        );
    }

    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return LazyReactPackage.getReactModuleInfoProviderViaReflection(this);
    }
}
