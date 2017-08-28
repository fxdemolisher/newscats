import React from 'react'
import {Dimensions, StyleSheet, Text, View} from 'react-native'
import {connect} from 'react-redux'

import {Styles} from '/styles'
import {BaseComponent} from '/widgets'

import {Feed} from './feed'

const styles = {
    container: {
        backgroundColor: Styles.Color.Grey100,
        height: '100%',
        width: '100%',
    },
    empty: {
        alignItems: 'center',
        height: Dimensions.get('window').height * 0.4,
        justifyContent: 'flex-end',
        paddingHorizontal: Styles.Size.Medium,
    },
    emptyText: {
        ...Styles.Text.Standard,
        color: Styles.Color.Grey500,
        fontSize: Styles.Font.Size.Medium,
        textAlign: 'center',
    },
    headerCount: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: Styles.Size.Small,
    },
    headerCountText: {
        ...Styles.Text.Standard,
        color: Styles.Color.Grey700,
        fontSize: Styles.Font.Size.Medium,
    },
}

const stylesheet = StyleSheet.create(styles)

/**
 * Component used to display the number of favorites in the navigation header.
 * Hidden when the count is zero.
 */
class FavoritesCount extends BaseComponent {
    render() {
        if (this.props.count == 0) {
            return null
        }

        return (
            <View style={stylesheet.headerCount}>
                <Text style={stylesheet.headerCountText}>
                    {this.props.count}
                </Text>
            </View>
        )
    }
}

FavoritesCount = connect((state) => ({ count: Object.keys(state.favorites).length }))(FavoritesCount)

/**
 * A screen used to show a feed of favorite items.
 */
class FavoritesScreen extends BaseComponent {
    static navigationOptions = {
        title: 'Favorites',
        headerRight: (<FavoritesCount />),
    }

    render() {
        const favorites = Object.values(this.props.favorites)
            .sort((left, right) => {
                if (left.timestamp.isBefore(right.timestamp)) {
                    return 1
                }

                if (left.timestamp.isAfter(right.timestamp)) {
                    return -1
                }

                return 0
            })

        const empty = (
            <View style={stylesheet.empty}>
                <Text style={stylesheet.emptyText}>
                    Your favorites cats will appear here.
                </Text>
            </View>
        )

        return (
            <View style={stylesheet.container}>
                <Feed empty={empty}
                      contents={favorites} />
            </View>
        )
    }
}

FavoritesScreen = connect((state) => ({ favorites: state.favorites }))(FavoritesScreen)

export {
    FavoritesScreen,
}
