import React from 'react'
import {Animated, AppStat, Easing, Image, StyleSheet, View} from 'react-native'
import {Provider} from 'react-redux'

import {Images} from '/images'
import {RootComponent, rootReducer} from '/screens'
import {Store} from '/store'
import {Styles} from '/styles'
import {BaseComponent} from '/widgets'

const styles = {
    splash: {
        alignItems: 'center',
        backgroundColor: Styles.Color.Grey300,
        height: '100%',
        justifyContent: 'center',
        width: '100%',
    },
    splashImage: {
        height: 128,
        width: 128,
    },
}

const stylesheet = StyleSheet.create(styles)

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

        // Animation value for the splash screen.
        this.splashAnimation = new Animated.Value(0)
        this.startSplashAnimation()
    }

    startSplashAnimation() {
        this.splashAnimation.resetAnimation()
        this.splashAnimation.setValue(0)

        Animated.timing(
            this.splashAnimation,
            {
                duration: 1500,
                easing: Easing.linear,
                toValue: 1.0,
                useNativeDriver: true,
            }
        )
        .start(() => {
            if (this.state.isStoreReady) {
                return
            }

            this.startSplashAnimation()
        })
    }

    renderSplash() {
        const rotation = this.splashAnimation.interpolate({
            inputRange: [0, 1.0],
            outputRange: ['0deg', '359deg']
        })

        const splashImageStyle = [
            stylesheet.splashImage,
            { transform: [{ rotate: rotation }] }
        ]

        return (
            <View style={stylesheet.splash}>
                <Animated.Image resizeMode="contain"
                                source={Images.logo}
                                style={splashImageStyle} />
            </View>
        )
    }
    
    render() {
        // If store isn't ready yet.
        if (!this.state.isStoreReady) {
            return this.renderSplash()
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
