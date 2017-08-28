import React from 'react'
import {AppStat} from 'react-native'
import {Provider} from 'react-redux'

import {RootComponent, rootReducer} from '/screens'
import {Store} from '/store'
import {BaseComponent} from '/widgets'

/**
 * Wraps a Redux store provider and the navigation stack to provide the app's entry point.
 */
class Application extends BaseComponent {
    constructor(props) {
        super(props)
        
        // Start as not ready, displaying nothing.
        this.state = { isStoreReady: false }
        
        // Initialize our permanent storage, with a callback when store hydration is completed.
        this.storage = new Store(
            rootReducer,
            () => {
                this.setState({ isStoreReady: true })
            }
        )
    }
    
    render() {
        // If store isn't ready yet.
        if (!this.state.isStoreReady) {
            return null
        }
        
        // Otherwise, render the actual root screen, wrapped in the store provider.
        return (
            <Provider store={this.storage.store}>
                <RootComponent />
            </Provider>
        )
    }
}

export {
    Application
}
