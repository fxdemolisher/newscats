import React from 'react'
import {NativeModules, ScrollView, StyleSheet, Text, View} from 'react-native'

import {Styles} from '/styles'
import {BaseComponent} from '/widgets'

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
        ...Styles.Text.Standard,
        color: Styles.Color.Grey700,
        fontSize: Styles.Font.Size.Small,
    },
    fieldValue: {
        flex: 1
    },
}

const stylesheet = StyleSheet.create(styles)

/**
 * Simple screen displaying the application's current environment.
 */
class DebugScreen extends BaseComponent {
    static navigationOptions = {
        title: 'Application Information'
    }

    constructor(props) {
        super(props)

        this.state = { }

        NativeModules.env.current((err, jsonString) => {
            this.setState({ env: JSON.parse(jsonString) })
        })
    }

    renderFields() {
        return Object.keys(this.state.env)
            .sort()
            .map((key) => {
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
