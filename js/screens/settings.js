import React from 'react'
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {NavigationActions} from 'react-navigation'
import {connect} from 'react-redux'

import {Images} from '/images'
import {Styles} from '/styles'
import {BaseComponent, ImageButton} from '/widgets'

const styles = {
    list: {
        backgroundColor: Styles.Color.White,
        flex: 1,
    },
    setting: {
        alignItems: 'center',
        borderBottomColor: Styles.Color.Grey300,
        borderBottomWidth: 1,
        flexDirection: 'row',
        flex: 1,
        paddingHorizontal: Styles.Size.Small,
        paddingVertical: Styles.Size.XSmall,
    },
    settingText: {
        backgroundColor: Styles.Color.Clear,
        color: Styles.Color.Grey700,
        flex: 1,
        fontFamily: Styles.Font.Family.RobotoRegular,
        fontSize: Styles.Font.Size.Medium,
    },
    settingIcon: {
        height: 32,
        tintColor: Styles.Color.Grey700,
        width: 32,
    }
}

const stylesheet = StyleSheet.create(styles)

/**
 * Button to send the user to the debug info screen.
 */
class GotoDebugButton extends BaseComponent {
    gotoDebug = () => {
        const action = NavigationActions.navigate({ routeName: 'debug' })
        this.props.dispatch(action)
    }

    render() {
        return (
            <ImageButton imageSource={Images.info}
                         onPress={this.gotoDebug} />
        )
    }
}

GotoDebugButton = connect()(GotoDebugButton)

/**
 * A screen that allows the user to manipulate the list of source packs used for the home screen feed.
 */
class SettingsScreen extends BaseComponent {
    static navigationOptions = {
        title: 'Settings',
        headerRight: (<GotoDebugButton />),
    }

    static settings = [
        { title: 'Feed Sources', route: 'feedSourceSettings'},
        { title: 'Connected Accounts', route: 'connectedAccountsSettings'},
    ]

    renderSetting(setting) {
        const settingPressed = () => {
            const action = NavigationActions.navigate({ routeName: setting.route })
            this.props.dispatch(action)
        }

        return (
            <TouchableOpacity accessibilityComponentType="button"
                              accessibilityTraits="button"
                              key={setting.title}
                              onPress={settingPressed}
                              renderToHardwareTextureAndroid={true}
                              shouldRasterizeIOS={true}
                              style={stylesheet.setting}>

                <Text style={stylesheet.settingText}>
                    {setting.title}
                </Text>

                <Image resizeMode="cover"
                       source={Images.chevronRight}
                       style={stylesheet.settingIcon} />

            </TouchableOpacity>
        )
    }

    render() {
        return (
            <ScrollView style={stylesheet.list}>
                {SettingsScreen.settings.map((setting) => (this.renderSetting(setting)))}
            </ScrollView>
        )
    }
}

SettingsScreen = connect()(SettingsScreen)

export {
    SettingsScreen,
}
