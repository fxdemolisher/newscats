package com.fxdemolisher.newscats;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;

/**
 * A bridge between our native implementation of OAuth2 client support and the RN code that uses it.
 */
public class AuthenticationBridge extends ReactContextBaseJavaModule
        implements AuthenticationManager.AuthenticationListener {
    private final AuthenticationManager manager;

    public AuthenticationBridge(ReactApplicationContext context) {
        super(context);

        this.manager = ((MainApplication) context.getApplicationContext()).getAuthenticationManager();
    }

    @Override
    public String getName() {
        return "auth";
    }

    @Override
    public void initialize() {
        super.initialize();

        manager.addListener(this);
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();

        manager.removeListener(this);
    }

    /**
     * Returns a promise that resolves to the given provider's configured status in the {@link AuthenticationManager}.
     */
    @ReactMethod
    public void isConfigured(String provider, Promise promise) {
        try {
            promise.resolve(manager.isConfigured(provider));
        } catch(Throwable e) {
            promise.reject("isConfiguredError", "Failed to check configuration for provider: " + provider, e);
        }
    }

    /**
     * Returns a promise that resolves when configuring the requested provider via {@link AuthenticationManager}
     * completes.
     */
    @ReactMethod
    public void configure(String provider, String authorizationUrl, String tokenUrl, String customUserAgentString,
                          Promise promise) {
        try {
            manager.configure(provider, authorizationUrl, tokenUrl, customUserAgentString);
            promise.resolve(null);
        } catch(Throwable e) {
            promise.reject("configureError", "Failed to configure provider: " + provider, e);
        }
    }

    /**
     * Returns a promise that resolves to the given provider's authorized status in the {@link AuthenticationManager}.
     */
    @ReactMethod
    public void isAuthorized(String provider, Promise promise) {
        try {
            promise.resolve(manager.isAuthorized(provider));
        } catch(Throwable e) {
            promise.reject("isAuthorizedError", "Failed to check authorization status for provider: " + provider, e);
        }
    }

    /**
     * Returns a promise that resolves when the given provider has been de-authorized via {@link AuthenticationManager}.
     */
    @ReactMethod
    public void deauthorize(String provider, Promise promise) {
        try {
            manager.deauthorize(provider);
            promise.resolve(null);
        } catch(Throwable e) {
            promise.reject("deauthorizeError", "Failed to deauthorize provider: " + provider, e);
        }
    }

    /**
     * Starts the authorization flow for the given provider and specific authorization parameters.
     * Returns a promise that resolves once authorization has started via {@link AuthenticationManager}.
     */
    @ReactMethod
    public void authorize(String provider, String clientId, ReadableArray scopes, ReadableMap additionalParameters,
                          Promise promise) {
        try {
            // Convert scope list to an array.
            String[] scopesArray = new String[scopes.size()];
            for (int i = 0; i < scopesArray.length; i++) {
                if (scopes.getType(i) != ReadableType.String) {
                    throw new RuntimeException("Only strings are allowed in scopes array");
                }

                scopesArray[i] = scopes.getString(i);
            }

            // Convert additional parameter RN map to a native map.
            Map<String, String> additionalParametersMap = new HashMap<>();
            for (ReadableMapKeySetIterator it = additionalParameters.keySetIterator(); it.hasNextKey(); ) {
                String key = it.nextKey();
                if (additionalParameters.getType(key) != ReadableType.String) {
                    throw new RuntimeException("Only strings are allowed as additional parameter values");
                }

                additionalParametersMap.put(key, additionalParameters.getString(key));
            }

            // Start authorization flow.
            manager.authorize(
                getReactApplicationContext().getCurrentActivity(),
                provider,
                clientId,
                scopesArray,
                additionalParametersMap
            );

            promise.resolve(null);
        } catch(Throwable e) {
            promise.reject("authorizeError", "Failed to authorize provider: " + provider, e);
        }
    }

    /**
     * Returns a promise that resolves to a provider's current (or fresh) access token and other parameters
     * via {@link AuthenticationManager}.
     *
     * Current resolved object includes:
     *   - accessToken
     *   - customUserAgentString
     */
    @ReactMethod
    public void getAccessToken(final String provider, final Promise promise) {
        try {
            manager.withAccessToken(
                provider,
                new AuthenticationManager.OnAccessTokenAvailableAction() {
                    @Override
                    public void onAccessTokenAvailable(String accessToken, String customUserAgentString) {
                        WritableMap result = Arguments.createMap();
                        result.putString("accessToken", accessToken);
                        result.putString("customUserAgentString", customUserAgentString);

                        promise.resolve(result);
                    }

                    @Override
                    public void onError(Throwable error) {
                        promise.reject("getAccessTokenError",
                                "Failed to get access token for provider: " + provider, error);
                    }
                }
            );

        } catch(Throwable e) {
            promise.reject("getAccessTokenError", "Failed to get access token for provider: " + provider, e);
        }
    }

    /**
     * Resets the entire OAuth2 authentication system via {@link AuthenticationManager}, returning a promise
     * that resolves once the reset is complete.
     */
    @ReactMethod
    public void reset(Promise promise) {
        try {
            manager.reset();
            promise.resolve(null);
        } catch(Throwable e) {
            promise.reject("resetError", "Failed to reset", e);
        }
    }

    /**
     * Called from {@link AuthenticationManager} every time a provider's configuration/authorization state changes.
     * We emit the native event to JS via the DeviceEventEmitter.
     */
    @Override
    public void onProviderStateChanged() {
        getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("onAuthorizationProviderStateChanged", null);
    }
}
