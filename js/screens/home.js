import React from 'react'
import {Dimensions, StyleSheet, Text, View} from 'react-native'
import {NavigationActions} from 'react-navigation'
import {connect} from 'react-redux'

import {Actions} from '/actions'
import {Constants} from '/constants'
import {Images} from '/images'
import {Styles} from '/styles'
import {BaseComponent, Feed, ImageButton} from '/widgets'

const styles = {
    container: {
        backgroundColor: Styles.Color.Grey300,
        flex: 1,
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
        backgroundColor: Styles.Color.Clear,
        color: Styles.Color.Grey500,
        fontFamily: Styles.Font.Family.RobotoRegular,
        fontSize: Styles.Font.Size.Medium,
        textAlign: 'center',
    },
    emptySub: {
        backgroundColor: Styles.Color.Clear,
        color: Styles.Color.Grey500,
        fontFamily: Styles.Font.Family.RobotoRegular,
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
                             onPress={this.gotoFavorites} />

                <ImageButton imageSource={Images.settings}
                             onPress={this.gotoSettings} />
             </View>
        )
    }
}

HeaderActions = connect()(HeaderActions)

/**
 * A screen to display the current feed of items from our sources, with pull to refresh functionality.
 */
class HomeScreen extends BaseComponent {
    static navigationOptions = {
        title: 'NewsCats',
        headerRight: (<HeaderActions />),
    }

    componentWillMount() {
        // Start source pack download on start up.
        const action = Actions.SourcePacks.downloadLatest()
        this.props.dispatch(action)
    }

    refresh = () => {
        this.props.dispatch(Actions.Feed.refresh())
    }

    onNewViewableKeys = (keys) => {
        this.props.dispatch(Actions.Feed.markItemsSeen(keys))
    }

    render() {
        const empty = (
            <View style={stylesheet.empty}>
                <Text style={stylesheet.emptyMain}>
                    New pics and videos from your sources will appear here.
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
                      onNewViewableKeys={this.onNewViewableKeys}
                      refresh={this.refresh}
                      refreshing={this.props.feed.status == Constants.Feed.Status.Refreshing} />
            </View>
        )
    }
}

HomeScreen = connect((state) => ({ feed: state.feed }))(HomeScreen)

export {
    HomeScreen,
}
