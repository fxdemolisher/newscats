package com.fxdemolisher.newscats;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * An extension of the MainReactPackage that allows us to ignore some view managers
 * that we provide custom implementations for via
 * {@link ApplicationReactPackage#createViewManagers(ReactApplicationContext)}
 */
public class FilteredMainReactPackage extends MainReactPackage {
    // NOTE: This is the main definition of which view managers to skip from the main react package.
    //       If you're providing a custom implementation, add the class you are replacing here
    //       (e.g. ReactTextViewManager.class)
    private static final Set<Class<?>> VIEW_MANAGERS_TO_SKIP = new HashSet<Class<?>>(Arrays.<Class<?>>asList(

    ));

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        List<ViewManager> viewManagers = new ArrayList<>();
        for (ViewManager viewManager : super.createViewManagers(reactContext)) {
            // If the view manager is in the skip set, skip it.
            if (VIEW_MANAGERS_TO_SKIP.contains(viewManager.getClass())) {
                continue;
            }

            viewManagers.add(viewManager);
        }

        return viewManagers;
    }
}
