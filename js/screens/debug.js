import React from 'react'
import {Alert, NativeModules, ScrollView, StyleSheet, Text, View} from 'react-native'
import {connect} from 'react-redux'

import {Images} from '/images'
import {Styles} from '/styles'
import {BaseComponent, ImageButton} from '/widgets'

const styles = {
    container: {
        backgroundColor: Styles.Color.White,
        flex: 1,
    },
    field: {
        paddingHorizontal: Styles.Size.Small,
        paddingVertical: Styles.Size.XSmall,
    },
    text: {
        backgroundColor: Styles.Color.Clear,
        color: Styles.Color.Grey700,
        fontFamily: Styles.Font.Family.RobotoRegular,
        fontSize: Styles.Font.Size.Small,
    },
    fieldValue: {
        flex: 1
    },
}

const stylesheet = StyleSheet.create(styles)

// Set of whitelisted environment field names that are allowed to be shown for non debug environments.
const WHITELISTED_ENVIRONMENT_FIELDS = new Set([
    'build',
    'bundleId',
    'installationId',
    'name',
    'version',
])

/**
 * Component for the header reset button.
 */
class ResetButton extends BaseComponent {
    fullReset = () => {
        const reset = () => {
            NativeModules.auth
                .reset()
                .then(() => (this.props.storage.persistor.purge()))
                .then(() => { NativeModules.nav.restart() })
        }

        Alert.alert(
            'Reset NewsCats',
            (
                'Are you sure you want to reset the entire NewsCats application?\n\n' +
                'This will remove all your favorites and custom sources.'
            ),
            [ {text: 'Cancel',  style: 'cancel'}, {text: 'Reset', onPress: reset} ],
            { cancelable: true }
        )
    }

    render() {
        return (
            <ImageButton imageSource={Images.reset}
                         onPress={this.fullReset} />
        )
    }
}

ResetButton = connect((state) => ({ storage: state.storage }))(ResetButton)

/**
 * Simple screen displaying the application's current environment.
 */
class DebugScreen extends BaseComponent {
    static navigationOptions = {
        title: 'Debug Information',
        headerRight: (<ResetButton />),
    }

    constructor(props) {
        super(props)

        this.state = { }

        NativeModules.env.current((err, jsonString) => {
            const currentEnv = JSON.parse(jsonString)
            NativeModules.env.globalConfig((err, jsonString) => {
                const env = {
                    ...currentEnv,
                    ...JSON.parse(jsonString),
                }

                this.setState({ env:  env})
            })
        })
    }

    renderFields() {
        const isDebug = (this.state.env.name == 'debug')
        return Object.keys(this.state.env)
            .sort()
            .map((key) => {
                if (!isDebug && !WHITELISTED_ENVIRONMENT_FIELDS.has(key)) {
                    return null
                }

                const value = this.state.env[key]

                return (
                    <View key={key}
                          style={stylesheet.field}>

                        <Text style={[stylesheet.text, stylesheet.fieldLabel]}>{key}: </Text>
                        <Text style={[stylesheet.text, stylesheet.fieldValue]}>{value + ""}</Text>

                    </View>
                )
            })
    }

    render() {
        return (
            <ScrollView style={stylesheet.container}>
                {this.state.env && this.renderFields()}
            </ScrollView>
        )
    }
}

export {
    DebugScreen,
}
