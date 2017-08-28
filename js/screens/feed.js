import React from 'react'
import {Alert, Dimensions, FlatList, Image, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native'
import {NavigationActions} from 'react-navigation'
import {connect} from 'react-redux'

import {Images} from '/images'
import {Styles} from '/styles'
import {BaseComponent, ImageButton} from '/widgets'

import * as Actions from './actions'

const styles = {
    card: {
        backgroundColor: Styles.Color.White,
        elevation: 2,
        height: Dimensions.get('window').height * 0.75,
        marginHorizontal: Styles.Size.XSmall,
        marginVertical: Styles.Size.XSmall,
        shadowColor: Styles.Color.Black,
        shadowOffset: {
            height: 2,
            width: 0,
        },
        shadowOpacity: 0.3,
    },
    itemFooter: {
        alignItems: 'center',
        flex: 0,
        flexDirection: 'row',
    },
    itemText: {
        flex: 1,
        padding: Styles.Size.Small
    },
    timestamp: {
        ...Styles.Text.Standard,
        color: Styles.Color.Grey600,
        fontSize: Styles.Font.Size.XSmall,
    },
    title: {
        ...Styles.Text.Standard,
        color: Styles.Color.Grey700,
        fontSize: Styles.Font.Size.Medium,
    },
    itemPreview: {
        flex: 1,
    },
}

const stylesheet = StyleSheet.create(styles)

/**
 * Component to display a single item, as a card with a preview image/video, title, and actions.
 */
class FeedItem extends BaseComponent {
    gotoDetails = () => {
        const action = NavigationActions.navigate({
            routeName: 'details',
            params: {
                title: this.props.item.title,
                url: this.props.item.url
            },
        })

        this.props.dispatch(action)
    }

    toggleFavorite = () => {
        if (this.props.favorite) {
            const remove = () => {
                this.props.dispatch(Actions.removeFavorite(this.props.item))
            }

            Alert.alert(
                'Unfavor',
                'Are you sure you want to unfavor this cat?',
                [ {text: 'Cancel',  style: 'cancel'}, {text: 'Unfavor', onPress: remove} ],
                { cancelable: true }
            )
        } else {
            this.props.dispatch(Actions.addFavorite(this.props.item))
        }
    }

    render() {
        const favoriteTint = (!!this.props.favorite ? Styles.Color.RedA400 : Styles.Color.Grey400)

        return (
            <TouchableWithoutFeedback accessibilityComponentType="button"
                                      accessibilityTraits="button"
                                      onPress={this.gotoDetails}
                                      renderToHardwareTextureAndroid={true}
                                      shouldRasterizeIOS={true}>

                <View style={stylesheet.card}>

                    <Image resizeMode="cover"
                           source={{ uri: this.props.item.previewUrl }}
                           style={stylesheet.itemPreview} />

                    <View style={stylesheet.itemFooter}>

                        <View style={stylesheet.itemText}>

                            <Text numberOfLines={2}
                                  style={stylesheet.title}>
                                {this.props.item.title}
                            </Text>

                            <Text style={stylesheet.timestamp}>
                                {this.props.item.timestamp.fromNow()}
                            </Text>

                        </View>

                        <ImageButton imageSource={Images.paw}
                                     onPress={this.toggleFavorite}
                                     style={Styles.Common.headerIcon}
                                     tintColor={favoriteTint} />

                    </View>

                </View>

            </TouchableWithoutFeedback>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        favorite: !!(state.favorites[ownProps.item.key]),
    }
}

FeedItem = connect(mapStateToProps)(FeedItem)

/**
 * Component to display a feed of items (e.g. current feed or favorites feed).
 */
class Feed extends BaseComponent {
    onViewableChanged = ({changed}) => {
        if (!this.props.onNewViewableKeys) {
            return
        }

        const newViewableKeys = changed
            .map(({item, isViewable}) => {
                return isViewable ? item.key : null
            })
            .filter((key) => (!!key))

        if (!newViewableKeys) {
            return
        }

        this.props.onNewViewableKeys(newViewableKeys)
    }

    renderItem = ({item, index}) => {
        return (
            <FeedItem item={item}
                      key={item.key} />
        )
    }

    render() {
        const viewabilityConfig = {
            minimumViewTime: 500,
            itemVisiblePercentThreshold: 70,
            waitForInteraction: false,
        }

        return (
            <FlatList ListEmptyComponent={this.props.empty}
                      data={this.props.contents}
                      initialNumToRender={2}
                      onRefresh={this.props.refresh}
                      onViewableItemsChanged={this.onViewableChanged}
                      refreshing={this.props.refreshing}
                      renderItem={this.renderItem}
                      showsVerticalScrollIndicator={false}
                      viewabilityConfig={viewabilityConfig}
                      windowSize={21} />
        )
    }
}

Feed = connect()(Feed)

export {
    Feed,
}
