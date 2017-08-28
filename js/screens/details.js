import React from 'react'
import {Share, StyleSheet, Text, View, WebView} from 'react-native'

import {Images} from '/images'
import {Styles} from '/styles'
import {BaseComponent, ImageButton} from '/widgets'

const styles = {
    page: {
        flex: 1,
    },
    titleContainer: {
        alignItems: 'stretch',
        paddingHorizontal: Styles.Size.Small,
    },
    title: {
        backgroundColor: Styles.Color.Clear,
        color: Styles.Color.White,
        fontFamily: Styles.Font.Family.RobotoRegular,
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
    render() {
        return (
            <View style={stylesheet.titleContainer}>
                <Text numberOfLines={1}
                      style={stylesheet.title}>
                    {this.props.title}
                </Text>
                <Text numberOfLines={1}
                      style={stylesheet.subTitle}>
                    {this.props.url}
                </Text>
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
        const params = navigation.state.params

        const share = () => {
            Share.share({
                title: params.title,
                message: params.url,
            })
        }

        return {
            gesturesEnabled: true,
            headerTitle: (
                <DetailsScreenHeader title={params.title}
                                     url={params.url} />
            ),
            headerRight: (
                <ImageButton imageSource={Images.share}
                             onPress={share} />
            ),
        }
    }

    render() {
        return (
            <WebView source={{ uri: this.props.navigation.state.params.url}}
                     startInLoadingState={true}
                     style={stylesheet.page} />
        )
    }
}

export {
    DetailsScreen,
}
