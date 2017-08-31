import React from 'react'
import {ScrollView, StyleSheet, Switch, Text, View} from 'react-native'
import {NavigationActions} from 'react-navigation'
import {connect} from 'react-redux'

import {Images} from '/images'
import {Styles} from '/styles'
import {BaseComponent, ImageButton} from '/widgets'

import * as Actions from './actions'

const styles = {
    list: {
        backgroundColor: Styles.Color.White,
        flex: 1,
    },
    pack: {
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
        paddingVertical: Styles.Size.XSmall,
    },
    packText: {
        backgroundColor: Styles.Color.Clear,
        color: Styles.Color.Grey700,
        flex: 1,
        fontFamily: Styles.Font.Family.RobotoRegular,
        fontSize: Styles.Font.Size.Small,
    },
    packSwitch: {
        marginLeft: Styles.Size.XSmall,
        marginRight: Styles.Size.Small,
    },
}

const stylesheet = StyleSheet.create(styles)

/**
 * Component that sends the user to the debug info screen.
 */
class InfoButton extends BaseComponent {
    gotoInfo = () => {
        const action = NavigationActions.navigate({ routeName: 'debug' })
        this.props.dispatch(action)
    }

    render() {
        return (
            <ImageButton imageSource={Images.info}
                         onPress={this.gotoInfo} />
        )
    }
}

InfoButton = connect()(InfoButton)

/**
 * A screen that allows the user to manipulate the list of source packs used for the home screen feed.
 */
class SettingsScreen extends BaseComponent {
    static navigationOptions = {
        title: 'Settings',
        headerRight: (<InfoButton />),
    }

    componentWillMount() {
        this.setSourcePacks(this.props.sources)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.sources != nextProps.sources) {
            this.setSourcePacks(nextProps.sources)
        }
    }

    setSourcePacks(packs) {
        const titleSorter = (left, right) => {
            if (left.title == right.title) {
                return 0
            }

            return (left.title < right.title ? -1 : 1)
        }

        this.packs = Object.values(packs).sort(titleSorter)
    }

    renderPack(pack) {
        const togglePack = (value) => {
            this.props.dispatch(Actions.toggleSource(pack.key, value))
        }

        const additionalStyle = {
            opacity: (pack.enabled ? 1.0 : 0.6),
        }

        return (
            <View key={pack.key}
                  style={stylesheet.pack}>
                <Switch onTintColor={Styles.Color.Grey300}
                        onValueChange={togglePack}
                        style={stylesheet.packSwitch}
                        thumbTintColor={pack.enabled ? Styles.Color.Green500 : Styles.Color.Red500}
                        tintColor={Styles.Color.Grey200}
                        value={pack.enabled} />

                <Text style={[stylesheet.packText, additionalStyle]}>
                    {pack.title}
                </Text>
            </View>
        )
    }

    render() {
        return (
            <ScrollView style={stylesheet.list}>
                {this.packs.map((pack) => { return this.renderPack(pack) })}
            </ScrollView>
        )
    }
}

SettingsScreen = connect((state) => ({ sources: state.sources }))(SettingsScreen)

export {
    SettingsScreen,
}
