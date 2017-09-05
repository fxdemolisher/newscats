import React from 'react'
import {Animated, Easing, ScrollView, StyleSheet, Switch, Text, View} from 'react-native'
import {NavigationActions} from 'react-navigation'
import {connect} from 'react-redux'

import {Images} from '/images'
import {Styles} from '/styles'
import {BaseComponent, ImageButton} from '/widgets'

import * as Actions from './actions'

const styles = {
    headerActions: {
        flexDirection: 'row',
    },
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
 * Component for the action (e.g. debug, download packs) area of the settings screen's navigation header.
 */
class HeaderActions extends BaseComponent {
    constructor(props) {
        super(props)

        this.pulseAnimation = new Animated.Value(0)
        this.mounted = false
    }

    componentWillMount() {
        this.mounted = true

        if (this.props.status == Actions.SourcePacksDownloadStatus.Downloading) {
            this.startPulseAnimation()
        }
    }

    componentWillUnmount() {
        this.mounted = false
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.status == Actions.SourcePacksDownloadStatus.Downloading) {
            this.startPulseAnimation()
        }
    }

    startPulseAnimation() {
        this.pulseAnimation.resetAnimation()
        this.pulseAnimation.setValue(0)

        Animated.timing(
            this.pulseAnimation,
            {
                duration: 2000,
                easing: Easing.linear,
                toValue: 1.0,
                useNativeDriver: true,
            }
        )
        .start(() => {
            if (!this.mounted || this.props.status != Actions.SourcePacksDownloadStatus.Downloading) {
                return
            }

            this.startPulseAnimation()
        })
    }

    gotoDebug = () => {
        const action = NavigationActions.navigate({ routeName: 'debug' })
        this.props.dispatch(action)
    }

    downloadPacks = () => {
        if (this.props.status == Actions.SourcePacksDownloadStatus.Downloading) {
            return
        }

        const action = Actions.downloadLatestSourcePacks()
        this.props.dispatch(action)
    }

    render() {
        const opacity = this.pulseAnimation.interpolate({
            inputRange: [0, 0.5, 1.0],
            outputRange: [1.0, 0.3, 1.0]
        })

        let tintColor = Styles.Color.White
        if (this.props.status == Actions.SourcePacksDownloadStatus.Error) {
            tintColor = Styles.Color.Amber500
        } else if (this.props.status == Actions.SourcePacksDownloadStatus.Downloading) {
            tintColor = Styles.Color.Grey100
        }

        const buttonStyle = {
            opacity: opacity,
            tintColor: tintColor,
        }

        return (
            <View style={stylesheet.headerActions}>
                <ImageButton imageSource={Images.info}
                             onPress={this.gotoDebug} />

                <ImageButton buttonStyle={buttonStyle}
                             imageSource={Images.download}
                             onPress={this.downloadPacks} />
             </View>
        )
    }
}

HeaderActions = connect((state) => ({ status: state.sourcePacksDownload.status }))(HeaderActions)

/**
 * A screen that allows the user to manipulate the list of source packs used for the home screen feed.
 */
class SettingsScreen extends BaseComponent {
    static navigationOptions = {
        title: 'Settings',
        headerRight: (<HeaderActions />),
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
                    {pack.title} ({pack.sources.length})
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
