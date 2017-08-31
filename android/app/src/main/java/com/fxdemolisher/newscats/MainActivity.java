package com.fxdemolisher.newscats;

import android.os.Bundle;

import com.facebook.react.ReactActivity;

import javax.annotation.Nullable;

/**
 * Single RN hosting activity.
 */
public class MainActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setTitle(R.string.app_name);
    }

    /**
     * @return the RN component name or our app.
     */
    @Nullable
    @Override
    protected String getMainComponentName() {
        return "NewsCats";
    }
}
