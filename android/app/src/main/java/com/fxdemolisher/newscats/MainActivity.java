package com.fxdemolisher.newscats;

import android.content.Intent;
import android.os.Build;
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

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            getWindow().setStatusBarColor(getResources().getColor(R.color.red700));
        }
    }

    /**
     * @return the RN component name or our app.
     */
    @Nullable
    @Override
    protected String getMainComponentName() {
        return "NewsCats";
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        AuthenticationManager manager = ((MainApplication) getApplicationContext()).getAuthenticationManager();
        if (manager.isAuthorizationResult(requestCode)) {
            manager.onAuthorizationResponse(data);
        }

        super.onActivityResult(requestCode, resultCode, data);
    }
}
