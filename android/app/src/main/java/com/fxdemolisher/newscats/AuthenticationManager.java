package com.fxdemolisher.newscats;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.Log;

import net.openid.appauth.AppAuthConfiguration;
import net.openid.appauth.AuthState;
import net.openid.appauth.AuthorizationException;
import net.openid.appauth.AuthorizationRequest;
import net.openid.appauth.AuthorizationResponse;
import net.openid.appauth.AuthorizationService;
import net.openid.appauth.AuthorizationServiceConfiguration;
import net.openid.appauth.ClientSecretBasic;
import net.openid.appauth.ResponseTypeValues;
import net.openid.appauth.TokenResponse;
import net.openid.appauth.connectivity.ConnectionBuilder;
import net.openid.appauth.connectivity.DefaultConnectionBuilder;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Utility that acts as an OAuth2 client for generic OAuth2 providers, with persistent storage and handling
 * of returned results. Heavily leans on the https://github.com/openid/AppAuth-Android library for OAuth2 functionality.
 */
public class AuthenticationManager {
    // Request code use for starting authorization flow activities.
    private static final int REQUEST_CODE = 522845;

    private final Context context;
    private final SharedPreferences storage;
    private final Uri redirectUri;
    private final List<AuthenticationListener> listeners;

    /**
     * Defines an interface for components that wish to be notified when provider state has changed.
     * For now this is done across all providers in one shot instead of specifying which provider has changed.
     * It is up to the implementor to query the manager for more information.
     */
    public interface AuthenticationListener {
        /**
         * Called when a provider's configuration or authorization state has changed.
         */
        void onProviderStateChanged();
    }

    /**
     * Interface defining an action to be taken once a fresh access token is available, or an error has occurred
     * trying to retrieve one.
     */
    public interface OnAccessTokenAvailableAction {
        /**
         * Called when a fresh access token is available.
         */
        void onAccessTokenAvailable(String accessToken, String customUserAgentString);

        /**
         * Called if an error occurs retrieving a fresh access token, or the provider is not configured/authorized.
         */
        void onError(Throwable error);
    }

    /**
     * Defines the configuration and current authorized state for a provider.
     * Instances of this class are persisted to storage.
     */
    private static final class ProviderConfiguration {
        private final AuthorizationServiceConfiguration serviceConfiguration;
        private final AuthState authState;
        private final String customUserAgentString;

        public ProviderConfiguration(AuthorizationServiceConfiguration serviceConfiguration, AuthState authState,
                                      String customUserAgentString) {
            this.serviceConfiguration = serviceConfiguration;
            this.authState = authState;
            this.customUserAgentString = customUserAgentString;
        }

        /**
         * Creates a new {@link AuthorizationService} with the provider's config.
         */
        public AuthorizationService createService(Context context) {
            AppAuthConfiguration serviceConfig = new AppAuthConfiguration.Builder()
                    .setConnectionBuilder(new CustomConnectionBuilder(customUserAgentString))
                    .build();

            return new AuthorizationService(context, serviceConfig);
        }

        public String serializeJson() {
            try {
                return new JSONObject()
                    .put("config", serviceConfiguration.toJson())
                    .put("state", authState.jsonSerialize())
                    .put("customUserAgentString", customUserAgentString)
                    .toString();
            } catch(JSONException e) {
                throw new RuntimeException(e);
            }
        }

        public static ProviderConfiguration deserializeJson(String jsonString) {
            try {
                JSONObject root = new JSONObject(jsonString);
                return new ProviderConfiguration(
                    AuthorizationServiceConfiguration.fromJson(root.getJSONObject("config")),
                    AuthState.jsonDeserialize(root.getJSONObject("state")),
                    root.getString("customUserAgentString")
                );
            } catch(JSONException e) {
                throw new RuntimeException(e);
            }
        }
    }

    /**
     * Represents the "state" parameter during authorization flows. Allows us to pass information between
     * authorization request and response legs. This allows us to identify the provider being authorized.
     */
    private static final class AuthenticationRequestState {
        private final String provider;
        private final long nonce;

        public AuthenticationRequestState(String provider, long nonce) {
            this.provider = provider;
            this.nonce = nonce;
        }

        public String serializeJson() {
            try {
                return new JSONObject()
                    .put("provider", provider)
                    .put("nonce", nonce)
                    .toString();
            } catch(JSONException e) {
                throw new RuntimeException(e);
            }
        }

        public static AuthenticationRequestState deserializeJson(String jsonString) {
            try {
                JSONObject root = new JSONObject(jsonString);
                return new AuthenticationRequestState(
                    root.getString("provider"),
                    root.getLong("nonce")
                );
            } catch(JSONException e) {
                throw new RuntimeException(e);
            }
        }
    }

    /**
     * An implementation of {@link ConnectionBuilder} that allows us to set a custom user agent string for
     * provider's that require it (e.g. reddit).
     */
    private static final class CustomConnectionBuilder implements ConnectionBuilder {
        private final String customUserAgentString;

        private CustomConnectionBuilder(String customUserAgentString) {
            this.customUserAgentString = customUserAgentString;
        }

        @NonNull
        @Override
        public HttpURLConnection openConnection(@NonNull Uri uri) throws IOException {
            HttpURLConnection connection = DefaultConnectionBuilder.INSTANCE.openConnection(uri);

            if (customUserAgentString != null) {
                connection.setRequestProperty("User-Agent", customUserAgentString);
            }

            return connection;
        }
    }

    /**
     * Constructs a new authentication manager.
     */
    public AuthenticationManager(Context context, Environment environment) {
        this.context = context;
        this.storage = context.getSharedPreferences("auth", Context.MODE_PRIVATE);
        this.redirectUri = Uri.parse(String.format("%s://auth", environment.bundleId));
        this.listeners = new ArrayList<>();
    }

    /**
     * Fully resets the manager and its storage.
     * It is highly recommended that the app is restarted after this step.
     */
    public void reset() {
        listeners.clear();
        storage.edit()
            .clear()
            .apply();
    }

    /**
     * Attaches a listener to the manager.
     */
    public void addListener(AuthenticationListener listener) {
        listeners.add(listener);
    }

    /**
     * Removes a listener from this manager.
     */
    public void removeListener(AuthenticationListener listener) {
        listeners.remove(listener);
    }

    /**
     * @return true if the given provider has been configured, false otherwise.
     */
    public boolean isConfigured(String provider) {
        return (loadProvider(provider) != null);
    }

    /**
     * Configures a new provider. It is recommended that {@link #isConfigured(String)} is called first.
     * Otherwise, any current authorization state will be overwritten by the new configuration.
     */
    public void configure(String provider, String authorizationUrl, String tokenUrl, String customUserAgentString) {
        AuthorizationServiceConfiguration serviceConfiguration = new AuthorizationServiceConfiguration(
                Uri.parse(authorizationUrl),
                Uri.parse(tokenUrl)
        );

        AuthState state = new AuthState(serviceConfiguration);

        ProviderConfiguration config = new ProviderConfiguration(
                serviceConfiguration,
                state,
                customUserAgentString
        );

        saveProvider(provider, config);
    }

    /**
     * @return true if the given provider is configured and currently authorized (can perform actions).
     */
    public boolean isAuthorized(String provider) {
        ProviderConfiguration config = loadProvider(provider);
        return (config != null && config.authState.isAuthorized());
    }

    /**
     * Clears the authorization for the given provider without clearing its configuration. Basically a log out.
     */
    public void deauthorize(String provider) {
        ProviderConfiguration config = loadProvider(provider);
        if (config == null) {
            return;
        }

        ProviderConfiguration newConfig = new ProviderConfiguration(
            config.serviceConfiguration,
            new AuthState(config.serviceConfiguration),
            config.customUserAgentString
        );

        saveProvider(provider, newConfig);
    }

    /**
     * Starts the authorization flow for the given provider and parameters.
     */
    public void authorize(Activity activity, String provider, String clientId, String[] scopes,
                          Map<String, String> additionalParameters) {
        // Load the configured provider.
        ProviderConfiguration config = loadProvider(provider);
        if (config == null) {
            throw new RuntimeException("Authorize called before configure for: " + provider);
        }

        // Create the request state so that we know which provider a response is for.
        String requestState = new AuthenticationRequestState(provider, System.currentTimeMillis()).serializeJson();

        // Create the request.
        AuthorizationRequest request = new AuthorizationRequest.Builder(
                    config.serviceConfiguration,
                    clientId,
                    ResponseTypeValues.CODE,
                    redirectUri
                )
                .setScopes(scopes)
                .setState(requestState)
                .setAdditionalParameters(additionalParameters)
                .build();

        // Start authorization flow.
        Intent authIntent = config.createService(context).getAuthorizationRequestIntent(request);
        activity.startActivityForResult(authIntent, REQUEST_CODE);
    }

    /**
     * @return true if the given request code is the same we used when starting the auth flow, should be called
     * from {@link Activity#onActivityResult(int, int, Intent)} from whatever activity is receiving the auth results.
     */
    public boolean isAuthorizationResult(int requestCode) {
        return requestCode == REQUEST_CODE;
    }

    /**
     * Called from {@link Activity#onActivityResult(int, int, Intent)} from whatever activity is receiving the
     * authorization result. Processes the results and begins the token retrieval step if everything is deemed to be ok.
     */
    public void onAuthorizationResponse(Intent data) {
        AuthorizationException exception = AuthorizationException.fromIntent(data);
        if (exception != null) {
            Log.w("AUTH", "Failed to process authorization", exception);
            return;
        }

        AuthorizationResponse response = AuthorizationResponse.fromIntent(data);
        if (response == null) {
            Log.w("AUTH", "Could not parse response from intent");
            return;
        }

        AuthorizationRequest request = response.request;
        if (request.state == null || !request.state.equals(response.state)) {
            Log.w("AUTH", "Request state does not match response state");
            return;
        }

        final AuthenticationRequestState state = AuthenticationRequestState.deserializeJson(response.state);
        final ProviderConfiguration config = loadProvider(state.provider);
        if (config == null) {
            Log.w("AUTH", "No auth state found for provider on authorization response: " + state.provider);
            return;
        }

        config.authState.update(response, null);

        config.createService(context)
            .performTokenRequest(
                response.createTokenExchangeRequest(),
                new ClientSecretBasic(""),
                new AuthorizationService.TokenResponseCallback() {
                    @Override
                    public void onTokenRequestCompleted(@Nullable TokenResponse tokenResponse,
                                                        @Nullable AuthorizationException e) {
                        onTokenResponse(state.provider, config, tokenResponse, e);
                    }
                }
            );
    }

    /**
     * Called when fresh tokens are retrieved on the last leg of the authorization flow.
     * Updates the provider's config with the response and persists it for later use.
     */
    private void onTokenResponse(String provider, ProviderConfiguration config,
                                 TokenResponse response, AuthorizationException exception) {
        if (exception != null) {
            Log.w("AUTH", "Something went wrong during token leg of auth, resetting", exception);
            deauthorize(provider);
            return;
        }

        config.authState.update(response, null);

        saveProvider(provider, config);
    }

    /**
     * Called to perform actions with a fresh access token for a provider. {@link #isAuthorized(String)} should be
     * called prior to calling this method, or an exception will be raised. Proper callback methods in the provided
     * action will be called once the token is available or if an error occurs while retrieving it.
     */
    public void withAccessToken(String provider, final OnAccessTokenAvailableAction action) {
        if (!isAuthorized(provider)) {
            throw new IllegalStateException("Cannot perform request on an unauthorized provider");
        }

        final ProviderConfiguration config = loadProvider(provider);
        config.authState.performActionWithFreshTokens(
                config.createService(context),
                new ClientSecretBasic(""),
                new AuthState.AuthStateAction() {
                    @Override
                    public void execute(@Nullable String accessToken, @Nullable String idToken,
                                        @Nullable AuthorizationException error) {
                        if (error != null) {
                            action.onError(error);
                            return;
                        }

                        if (accessToken == null) {
                            action.onError(new IllegalStateException("Did not retrieve access token"));
                            return;
                        }

                        action.onAccessTokenAvailable(accessToken, config.customUserAgentString);
                    }
                }
        );
    }

    /**
     * Loads the {@link ProviderConfiguration} from shared preferences for a provider and returns it, or null
     * if no config is currently stored.
     */
    private ProviderConfiguration loadProvider(String provider) {
        String stored = storage.getString(provider, null);
        if (stored == null) {
            return null;
        }

        return ProviderConfiguration.deserializeJson(stored);
    }

    /**
     * Persists the given provider configuration to shared preferences.
     */
    private void saveProvider(String provider, ProviderConfiguration config) {
        String serialized = (config == null ? null : config.serializeJson());

        storage.edit()
            .putString(provider, serialized)
            .apply();

        // Notify all listeners that new state has been saved.
        for (AuthenticationListener listener : listeners) {
            listener.onProviderStateChanged();
        }
    }
}
