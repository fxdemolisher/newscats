import React from 'react'
import {Alert, Dimensions, FlatList, Image, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native'
import {NavigationActions} from 'react-navigation'
import {connect} from 'react-redux'

import {Images} from '/images'
import {Styles} from '/styles'
import {BaseComponent, ImageButton} from '/widgets'

import * as Actions from './actions'
import {ItemMedia} from './itemMedia'

const styles = {
    card: {
        backgroundColor: Styles.Color.White,
        borderRadius: 4,
        elevation: 2,
        margin: Styles.Size.XSmall,
        padding: Styles.Size.XSmall,
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
        paddingBottom: Styles.Size.XSmall,
        paddingHorizontal: Styles.Size.Small,
        paddingTop: Styles.Size.Small,
    },
    title: {
        backgroundColor: Styles.Color.Clear,
        color: Styles.Color.Grey800,
        fontFamily: Styles.Font.Family.RobotoMedium,
        fontSize: Styles.Font.Size.Small,
    },
    timestamp: {
        backgroundColor: Styles.Color.Clear,
        color: Styles.Color.Grey800,
        fontFamily: Styles.Font.Family.RobotoRegular,
        fontSize: Styles.Font.Size.XSmall,
        marginTop: Styles.Size.XXSmall,
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
        if (this.props.onGotoDetails) {
            this.props.onGotoDetails()
        }

        const action = NavigationActions.navigate({
            routeName: 'details',
            params: { item: this.props.item },
        })

        this.props.dispatch(action)
    }

    toggleFavorite = () => {
        if (this.props.favorite) {
            const remove = () => {
                this.props.dispatch(Actions.removeFavorite(this.props.item, this.props.oauth))
            }

            Alert.alert(
                'Unfavor',
                'Are you sure you want to unfavor this cat?',
                [ {text: 'Cancel',  style: 'cancel'}, {text: 'Unfavor', onPress: remove} ],
                { cancelable: true }
            )
        } else {
            this.props.dispatch(Actions.addFavorite(this.props.item, this.props.oauth))
        }
    }

    render() {
        const favoriteButtonStyle = {
            tintColor: (!!this.props.favorite ? Styles.Color.Red600 : Styles.Color.Grey400),
        }

        return (
            <TouchableWithoutFeedback accessibilityComponentType="button"
                                      accessibilityTraits="button"
                                      onPress={this.gotoDetails}
                                      renderToHardwareTextureAndroid={true}
                                      shouldRasterizeIOS={true}>

                <View style={stylesheet.card}>

                    <View style={stylesheet.itemPreview}>
                        <ItemMedia backgroundColor={Styles.Color.Clear}
                                   fullScreen={false}
                                   mediaType={this.props.item.mediaType}
                                   url={this.props.item.previewUrl} />
                    </View>

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

                        <ImageButton buttonStyle={favoriteButtonStyle}
                                     imageSource={Images.paw}
                                     onPress={this.toggleFavorite} />

                    </View>

                </View>

            </TouchableWithoutFeedback>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        favorite: !!(state.favorites[ownProps.item.key]),
        oauth: state.oauth,
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

    onGotoItemDetails = () => {
        if (!this.list) {
            return
        }

        this.list.recordInteraction()
    }

    renderItem = ({item, index}) => {
        return (
            <FeedItem item={item}
                      key={item.key}
                      onGotoDetails={this.onGotoItemDetails} />
        )
    }

    render() {
        const viewabilityConfig = {
            minimumViewTime: 500,
            itemVisiblePercentThreshold: 70,
            waitForInteraction: true,
        }

        return (
            <FlatList ListEmptyComponent={this.props.empty}
                      data={this.props.contents}
                      initialNumToRender={2}
                      onRefresh={this.props.refresh}
                      onViewableItemsChanged={this.onViewableChanged}
                      ref={(ref) => { this.list = ref }}
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
