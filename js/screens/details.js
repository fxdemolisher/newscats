import React from 'react'
import {Alert, Linking, Share, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native'

import {Constants} from '/constants'
import {Images} from '/images'
import {Styles} from '/styles'
import {BaseComponent, ImageButton, ItemMedia} from '/widgets'

const styles = {
    headerActions: {
        flexDirection: 'row',
    },
    page: {
        flex: 1,
    },
    titleContainer: {
        justifyContent: 'center',
        marginRight: 56, // NOTE: hack around floating title component.
    },
    title: {
        backgroundColor: Styles.Color.Clear,
        color: Styles.Color.White,
        fontFamily: Styles.Font.Family.RobotoMedium,
        fontSize: Styles.Font.Size.Small,
    },
    subTitle: {
        backgroundColor: Styles.Color.Clear,
        color: Styles.Color.White,
        fontFamily: Styles.Font.Family.RobotoRegular,
        fontSize: Styles.Font.Size.XSmall,
    },
}

const stylesheet = StyleSheet.create(styles)

/**
 * A component that summarizes the item (e.g. title + url) in the navigation header.
 */
class DetailsScreenHeader extends BaseComponent {
    showInfo = () => {
        Alert.alert(
            'Details',
            (this.props.title + '\n\nFrom: ' + this.props.subTitle),
            [ {text: 'Close',  style: 'cancel'} ],
            { cancelable: true }
        )
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={this.showInfo}>
                <View style={stylesheet.titleContainer}>
                    <Text numberOfLines={1}
                          style={stylesheet.title}>
                        {this.props.title}
                    </Text>
                    <Text numberOfLines={1}
                          style={stylesheet.subTitle}>
                        {this.props.subTitle}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

/**
 * Component for the action (e.g. share, open source) area of the detail screen's navigation header.
 */
class HeaderActions extends BaseComponent {
    shareItem = () => {
        Share.share({
            title: this.props.item.title,
            message: this.props.item.url + ' (via NewsCats)',
        })
    }

    openItem = () => {
        Linking.openURL(this.props.item.url)
    }

    render() {
        return (
            <View style={stylesheet.headerActions}>
                <ImageButton imageSource={Images.share}
                             onPress={this.shareItem} />

                <ImageButton imageSource={Images.openNew}
                             onPress={this.openItem} />
            </View>
        )
    }
}

/**
 * Screen used to display the details on an item (e.g. full screen media preview).
 *
 * Required navigation params:
 *   title: The title of the item
 *   url: The final URL (e.g. reddit post) of the item
 */
class DetailsScreen extends BaseComponent {
    static navigationOptions = ({navigation}) => {
        const item = navigation.state.params.item

        const subTitle = [item.packTitle, item.sourceTitle]
            .filter((item) => (item))
            .join(' / ')

        return {
            gesturesEnabled: true,
            headerTitle: (
                <DetailsScreenHeader subTitle={subTitle}
                                     title={item.title} />
            ),
            headerRight: (<HeaderActions item={item} />),
        }
    }

    render() {
        const item = this.props.navigation.state.params.item

        return (
            <ItemMedia mediaType={item.mediaType}
                       url={item.mediaUrl} />
        )
    }
}

export {
    DetailsScreen,
}
