import React from 'react'
import {Dimensions, StyleSheet, Text, View} from 'react-native'
import {NavigationActions} from 'react-navigation'
import {connect} from 'react-redux'

import {Images} from '/images'
import {Styles} from '/styles'
import {BaseComponent, ImageButton} from '/widgets'

import * as Actions from './actions'
import {Feed} from './feed'

const styles = {
    container: {
        backgroundColor: Styles.Color.Grey100,
        flex: 1,
    },
    headerLogo: {
        height: 32,
        margin: Styles.Size.Small,
        width: 32,
    },
    headerActions: {
        flexDirection: 'row',
    },
    empty: {
        alignItems: 'center',
        height: Dimensions.get('window').height * 0.4,
        justifyContent: 'flex-end',
        paddingHorizontal: Styles.Size.Medium,
    },
    emptyMain: {
        ...Styles.Text.Standard,
        color: Styles.Color.Grey500,
        fontSize: Styles.Font.Size.Medium,
        textAlign: 'center',
    },
    emptySub: {
        ...Styles.Text.Standard,
        color: Styles.Color.Grey500,
        fontSize: Styles.Font.Size.Small,
        textAlign: 'center',
    },
}

const stylesheet = StyleSheet.create(styles)

/**
 * Component for the action (e.g. favorites, settings) area of the home screen's navigation header.
 */
class HeaderActions extends BaseComponent {
    gotoSettings = () => {
        const action = NavigationActions.navigate({ routeName: 'settings' })
        this.props.dispatch(action)
    }

    gotoFavorites = () => {
        const action = NavigationActions.navigate({ routeName: 'favorites' })
        this.props.dispatch(action)
    }

    render() {
        return (
            <View style={stylesheet.headerActions}>
                <ImageButton imageSource={Images.paw}
                             onPress={this.gotoFavorites}
                             style={Styles.Common.headerIcon} />

                <ImageButton imageSource={Images.settings}
                             onPress={this.gotoSettings}
                             style={Styles.Common.headerIcon} />
             </View>
        )
    }
}

HeaderActions = connect()(HeaderActions)

/**
 * A screen to display the current feed of items from our sources, with pull to refresh funcationality.
 */
class HomeScreen extends BaseComponent {
    static navigationOptions = {
        headerBackTitle: 'Home',
        title: 'NewsCats',
        headerRight: (<HeaderActions />),
    }

    componentDidMount() {
        if (this.props.feed.status == Actions.FeedStatus.NotInitialized) {
            this.refresh()
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.feed.status == Actions.FeedStatus.NotInitialized) {
            this.refresh()
        }
    }

    refresh = () => {
        this.props.dispatch(Actions.refreshFeed())
    }

    onNewViewableKeys = (keys) => {
        this.props.dispatch(Actions.markSeen(keys))
    }

    render() {
        const empty = (
            <View style={stylesheet.empty}>
                <Text style={stylesheet.emptyMain}>
                    New cats and kittens will appear here.
                </Text>
                <Text style={stylesheet.emptySub}>
                    You can also add new sources in settings.
                </Text>
            </View>
        )

        return (
            <View style={stylesheet.container}>
                <Feed empty={empty}
                      contents={this.props.feed.contents}
                      favoritesKeys={this.props.favoriteKeys}
                      onNewViewableKeys={this.onNewViewableKeys}
                      refresh={this.refresh}
                      refreshing={this.props.feed.status == Actions.FeedStatus.Refreshing} />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        feed: state.feed,
    }
}

HomeScreen = connect(mapStateToProps)(HomeScreen)

export {
    HomeScreen,
}
