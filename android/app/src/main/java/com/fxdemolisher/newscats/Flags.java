package com.fxdemolisher.newscats;

/**
 * Constants for global preference keys.
 */
public class Flags {
    // Stores a random GUID as an installation id of the app.
    // Can be used in tracking and other facilities to identify the install.
    public static final String INSTALLATION_ID = "installationId";

    // If set to true, dev mode is disabled even when building for debug and the local bundle is loaded instead.
    public static final String LOCAL_BUNDLE_IN_DEBUG = "localBundleInDebug";

    // Actually an internal RN preference key, we use it for overriding the debug
    // dev host URL for our RN bundle.
    public static final String REACT_NATIVE_DEBUG_HOST_IP = "debug_http_host";
}
