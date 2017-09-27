import React from 'react'
import {Dimensions, StyleSheet, Text, View} from 'react-native'
import {connect} from 'react-redux'

import {Styles} from '/styles'
import {BaseComponent, Feed} from '/widgets'

const styles = {
    container: {
        backgroundColor: Styles.Color.Grey300,
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
        backgroundColor: Styles.Color.Clear,
        color: Styles.Color.Grey500,
        fontFamily: Styles.Font.Family.RobotoRegular,
        fontSize: Styles.Font.Size.Medium,
        textAlign: 'center',
    },
}

const stylesheet = StyleSheet.create(styles)

/**
 * A screen used to show a feed of favorite items.
 */
class FavoritesScreen extends BaseComponent {
    static navigationOptions = ({navigation}) => {
        const params = navigation.state.params || {}
        let title = 'Favorites'
        if (params.count) {
            if (params.count > 1) {
                title = params.count + ' ' + title
            } else if (params.count == 1) {
                title = params.count + ' Favorite'
            }
        }

        return {
            title: title,
        }
    }
    componentWillMount() {
        this.refreshCount(Object.keys(this.props.favorites).length, null)
    }

    componentWillReceiveProps(nextProps) {
        const count = Object.keys(nextProps.favorites).length
        const previousCount = Object.keys(this.props.favorites).length
        this.refreshCount(count, previousCount)
    }

    refreshCount(count, previousCount) {
        if (count != previousCount) {
            this.props.navigation.setParams({ count: count })
        }
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
                    Your favorites pics and videos will appear here.
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
