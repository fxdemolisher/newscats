import React from 'react'
import {Alert, DeviceEventEmitter, ScrollView, StyleSheet, Switch, Text, View} from 'react-native'
import {connect} from 'react-redux'

import {Styles} from '/styles'
import {BaseComponent} from '/widgets'

import * as Actions from './actions'

const styles = {
    list: {
        backgroundColor: Styles.Color.White,
        flex: 1,
    },
    account: {
        alignItems: 'center',
        borderBottomColor: Styles.Color.Grey300,
        borderBottomWidth: 1,
        flexDirection: 'row',
        flex: 1,
        paddingVertical: Styles.Size.XSmall,
    },
    accountText: {
        backgroundColor: Styles.Color.Clear,
        color: Styles.Color.Grey700,
        flex: 1,
        fontFamily: Styles.Font.Family.RobotoRegular,
        fontSize: Styles.Font.Size.Medium,
    },
    accountSwitch: {
        marginLeft: Styles.Size.XSmall,
        marginRight: Styles.Size.Small,
    },
}

const stylesheet = StyleSheet.create(styles)

/**
 * A screen that allows the user to enable/disable connected accounts.
 */
class ConnectedAccountsSettingsScreen extends BaseComponent {
    static navigationOptions = {
        title: 'Connected Accounts',
    }

    static availableAccounts = [
        {
            provider: 'reddit',
            title: 'Reddit',
        },
    ]

    constructor(props) {
        super(props)

        this.state = { }
        this.mounted = false
    }

    componentWillMount() {
        this.mounted = true

        this.subscription = DeviceEventEmitter.addListener(
            'onAuthorizationProviderStateChanged',
            this.refreshEnabledStatus
        )

        this.refreshEnabledStatus()
    }

    componentWillUnmount() {
        this.mounted = false

        if (this.subscription) {
            this.subscription.remove()
        }
    }

    refreshEnabledStatus = () => {
        if (!this.mounted) {
            return
        }

        ConnectedAccountsSettingsScreen.availableAccounts.forEach((account) => {
            this.props.oauth
                .isProviderConnected(account.provider)
                .then((result) => {
                    this.setState({ [account.provider]: result })
                })
        })
    }

    renderAccount(account) {
        const enabled = !!this.state[account.provider]

        const toggleAccount = (value) => {
            const toggler = (enabled ? this.props.oauth.disconnect : this.props.oauth.connect)
            toggler.call(this.props.oauth, account.provider)
        }

        const additionalStyle = {
            opacity: (enabled ? 1.0 : 0.6),
        }

        return (
            <View key={account.title}
                  style={stylesheet.account}>
                <Switch onTintColor={Styles.Color.Grey300}
                        onValueChange={toggleAccount}
                        style={stylesheet.accountSwitch}
                        thumbTintColor={enabled ? Styles.Color.Green500 : Styles.Color.Red500}
                        tintColor={Styles.Color.Grey200}
                        value={enabled} />

                <Text style={[stylesheet.accountText, additionalStyle]}>
                    {account.title}
                </Text>
            </View>
        )
    }

    render() {
        return (
            <ScrollView style={stylesheet.list}>
                {ConnectedAccountsSettingsScreen.availableAccounts.map((account) => (this.renderAccount(account)))}
            </ScrollView>
        )
    }
}

ConnectedAccountsSettingsScreen = connect((state) => ({ oauth: state.oauth }))(ConnectedAccountsSettingsScreen)

export {
    ConnectedAccountsSettingsScreen,
}
