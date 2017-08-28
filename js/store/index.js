import {AsyncStorage} from 'react-native'
import {applyMiddleware, compose, createStore} from 'redux'
import createActionBuffer from 'redux-action-buffer'
import {autoRehydrate, persistStore} from 'redux-persist'
import {REHYDRATE} from 'redux-persist/constants'
import createMigration from 'redux-persist-migrate'
import thunk from 'redux-thunk'

import {migrationManifest} from './migrations'

/**
 * Wrapper around a redux store with a few things embedded.
 *   - redux-thunk
 *   - redux-persist
 *
 * Public API:
 *   - store = the redux store
 *   - persistor = a redux-persist persistor that allows fine control of the stored data
 *
 * Construction of a Store requires the app's root reducer and a callback that will be executed when store hydration
 * is done.
 *
 * The following redux middleware is automatically configured:
 *   - thunk = allows async action creation
 *   - autoHydrate = re-hydration of the store from permanent storage
 *
 * The store is synced with permanent storage every 250ms via AsyncStorage, under the 'app' key.
 */
class Store {
    constructor(rootReducer, rehydrationListener) {
        // Creates our Redux store, using composed middleware to allow persistance.
        this.store = createStore(rootReducer, { storage: this }, this.createMiddleware(migrationManifest))

        // Start periodically persisting the store to storage.
        this.persistor = persistStore(this.store, this.createPersistorConfig(), rehydrationListener)
    }
    
    /**
     * Returns the middleware to use for the store.
     */
    createMiddleware(migrationManifest) {
        // Middleware we will apply to redux.
        const baseMiddleware = applyMiddleware(
            // Allows action creators as opposed to just actions.
            thunk,
                                               
            // Keeps redux from firing anything (and thus messing with state) until store rehydration is done.
            createActionBuffer(REHYDRATE)
        )
        
        // Applies the provided migration manifest to the current store.
        const migration = createMigration(migrationManifest, 'app')

        // Compose redux middleware with the persistance rehydration function.
        // NOTE: In debug (RN dev mode) the rehydrator will log to the console.
        return compose(
            migration,
            autoRehydrate({ log: __DEV__ }),
            baseMiddleware
        )
    }
    
    /**
     * Returns the configuration of the permanent storage persistor.
     */
    createPersistorConfig() {
        return {
            // Blacklist of reducer keys to ignore.
            //
            // - 'feed' is ignored since we refresh it every time
            // - 'nav' is ignored so that navigation state doesn't persist
            // - 'storage' is ignored since it is just a convinience state property to allow access to this instance.
            blacklist: ['feed', 'nav', 'storage'],

            // Debounce interval (ms) between store calls.
            debounce: 250,

            // Key prefix (usually for localStorage).
            keyPrefix: 'app',

            // Storage engine used.
            storage: AsyncStorage,

            // List of transformation functions to apply during hydration.
            transforms: [],

            // Whitelist of reducer keys to persist.
            // NOTE: if any are specified, only those are persisted, be careful.
            whitelist: undefined,
        }
    }
}

export {
    Store,
}
