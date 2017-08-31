/**
 * Manifest of redux store migrations.
 *
 * See https://github.com/wildlifela/redux-persist-migrate for details.
 */
const migrationManifest = {
    2: clearSourcesState,
}

/**
 * Clear's the sources state, forcing it to reset from defaults.
 * Happened in version 2 when we transitioned to packs from source lists.
 */
function clearSourcesState(state) {
    const copy = {...state}
    delete copy['sources']
    return copy
}

export {
    migrationManifest
}

