import React from 'react'
import {BackHandler, Easing, StyleSheet} from 'react-native'
import {NavigationActions, StackNavigator, addNavigationHelpers} from 'react-navigation';
import {combineReducers} from 'redux'
import {connect} from 'react-redux'

import {Reducers} from '/reducers'
import {Styles} from '/styles'
import {BaseComponent} from '/widgets'

import {ConnectedAccountsSettingsScreen} from './connectedAccountsSettings'
import {DebugScreen} from './debug'
import {DetailsScreen} from './details'
import {FavoritesScreen} from './favorites'
import {FeedSourcesSettingsScreen} from './feedSourcesSettings'
import {HomeScreen} from './home'
import {PreviewScreen} from './preview'
import {SettingsScreen} from './settings'

const styles = {
    headerStyle: {
        backgroundColor: Styles.Color.Red600,
    },
    headerTitleStyle: {
        backgroundColor: Styles.Color.Clear,
        color: Styles.Color.White,
        flex: 0,
        fontFamily: Styles.Font.Family.RobotoMedium,
        fontSize: Styles.Font.Size.Medium,
        fontWeight: null,
        justifyContent: 'center',
    },
}

const stylesheet = StyleSheet.create(styles)

// Custom forward/back transition configuration.
const transitionConfig = () => {
    return {
        transitionSpec: {
            duration: 300,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
        },
        screenInterpolator: ({layout, position, scene}) => {
            const index = scene.index
            const width = layout.initWidth

            const translateX = position.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [width, 0, 0],
            })

            const opacity = position.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [1, 1, 0.2],
            })

            const scale = position.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [1, 1, 0.95],
            })

            return {
                opacity: opacity,
                transform: [
                    { scale: scale },
                    { translateX: translateX },
                ]
            }
        },
    }
}

// Set up root navigation.
const RootNavigation = StackNavigator(
    // Route configs.
    {
        home: {
            screen: HomeScreen,
            path: '/',
        },
        details: {
            screen: DetailsScreen,
            path: '/details',
        },
        settings: {
            screen: SettingsScreen,
            path: '/settings',
        },
        favorites: {
            screen: FavoritesScreen,
            path: '/favorites',
        },
        debug: {
            screen: DebugScreen,
            path: '/debug',
        },
        preview: {
            screen: PreviewScreen,
            path: '/preview',
        },
        feedSourceSettings: {
            screen: FeedSourcesSettingsScreen,
            path: '/settings/feedSources',
        },
        connectedAccountsSettings: {
            screen: ConnectedAccountsSettingsScreen,
            path: '/settings/connectedAccounts',
        }
    },

    // Navigation config.
    {
        mode: 'card',
        navigationOptions: {
            headerBackTitle: null,
            headerStyle: stylesheet.headerStyle,
            headerTintColor: Styles.Color.White,
            headerTitleStyle: stylesheet.headerTitleStyle
        },
        transitionConfig: transitionConfig,
    }
)

/**
 * Root component of the app, wraps our navigator to allow for redux support.
 * Also adds support for the Android hardware back button to our navigation.
 */
class RootComponent extends BaseComponent {
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onHardwareBack)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onHardwareBack)
    }

    onHardwareBack = () => {
        if (this.props.nav.index === 0) {
          return false
        }

        this.props.dispatch(NavigationActions.back());
        return true
    }

    render() {
        const navigationHelpers = addNavigationHelpers({
            dispatch: this.props.dispatch,
            state: this.props.nav,
        })

        return (
            <RootNavigation navigation={navigationHelpers} />
        )
    }
}

RootComponent = connect((state) => ({ nav: state.nav }))(RootComponent)

// Set up navigation reducer.
const initialNavAction = RootNavigation.router.getActionForPathAndParams('/')
const initialNavState = RootNavigation.router.getStateForAction(initialNavAction);
const navReducer = (state = initialNavState, action) => {
  const nextState = RootNavigation.router.getStateForAction(action, state);
  return nextState || state;
}

// Create a root reducer, made up of all the other reducers.
const rootReducer = combineReducers({
    app: Reducers.Noop, // No-op reducer for migration versioning.
    favorites: Reducers.Favorites,
    feed: Reducers.Feed.Feed,
    nav: navReducer,
    oauth: Reducers.Noop, // Required so that the oauth manager is available everywhere.
    preview: Reducers.Feed.Preview,
    seenKeys: Reducers.Feed.SeenKeys,
    sourcePacksDownload: Reducers.SourcePacks.Download,
    sources: Reducers.SourcePacks.Sources,
    storage: Reducers.Noop, // Required so that storage is available everywhere.
})

export {
    RootComponent,
    rootReducer,
}
