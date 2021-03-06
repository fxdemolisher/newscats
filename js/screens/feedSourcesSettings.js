import React from 'react'
import {Alert, Animated, Easing, ScrollView, StyleSheet, Switch, Text, View} from 'react-native'
import {NavigationActions} from 'react-navigation'
import {connect} from 'react-redux'

import {Actions} from '/actions'
import {Constants} from '/constants'
import {Images} from '/images'
import {Styles} from '/styles'
import {BaseComponent, ImageButton} from '/widgets'

const styles = {
    list: {
        backgroundColor: Styles.Color.White,
        flex: 1,
    },
    pack: {
        alignItems: 'center',
        borderBottomColor: Styles.Color.Grey300,
        borderBottomWidth: 1,
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
 * Allows to download new packs via a header action.
 */
class DownloadPacksButton extends BaseComponent {
    constructor(props) {
        super(props)

        this.pulseAnimation = new Animated.Value(0)
        this.mounted = false
    }

    componentWillMount() {
        this.mounted = true

        if (this.props.status == Constants.SourcePacks.DownloadStatus.Downloading) {
            this.startPulseAnimation()
        }
    }

    componentWillUnmount() {
        this.mounted = false
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.status == Constants.SourcePacks.DownloadStatus.Downloading) {
            this.startPulseAnimation()
        }

        if (nextProps.status == Constants.SourcePacks.DownloadStatus.Idle &&
                this.props.status == Constants.SourcePacks.DownloadStatus.Downloading) {
            Alert.alert(
                'Download Done',
                'Finished downloading fresh sources',
                [ {text: 'Got it',  style: 'cancel'} ],
                { cancelable: true }
            )
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
            if (!this.mounted || this.props.status != Constants.SourcePacks.DownloadStatus.Downloading) {
                return
            }

            this.startPulseAnimation()
        })
    }

    downloadPacks = () => {
        if (this.props.status == Constants.SourcePacks.DownloadStatus.Downloading) {
            return
        }

        const action = Actions.SourcePacks.downloadLatest()
        this.props.dispatch(action)
    }

    render() {
        const opacity = this.pulseAnimation.interpolate({
            inputRange: [0, 0.5, 1.0],
            outputRange: [1.0, 0.3, 1.0]
        })

        let tintColor = Styles.Color.White
        if (this.props.status == Constants.SourcePacks.DownloadStatus.Error) {
            tintColor = Styles.Color.Amber500
        } else if (this.props.status == Constants.SourcePacks.DownloadStatus.Downloading) {
            tintColor = Styles.Color.Grey100
        }

        const buttonStyle = {
            opacity: opacity,
            tintColor: tintColor,
        }

        return (
            <ImageButton buttonStyle={buttonStyle}
                         imageSource={Images.download}
                         onPress={this.downloadPacks} />
        )
    }
}

DownloadPacksButton = connect((state) => ({ status: state.sourcePacksDownload.status }))(DownloadPacksButton)

/**
 * A screen that allows the user to manipulate the list of source packs used for the home screen feed.
 */
class FeedSourcesSettingsScreen extends BaseComponent {
    static navigationOptions = {
        title: 'Feed Sources',
        headerRight: (<DownloadPacksButton />),
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
            this.props.dispatch(Actions.SourcePacks.toggle(pack.key, value))
        }

        const previewPack = () => {
            this.props.dispatch(NavigationActions.navigate({
                routeName: 'preview',
                params: {
                    sourcePackKey: pack.key,
                    sourcePackTitle: pack.title,
                },
            }))
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

                <ImageButton buttonStyle={{ tintColor: Styles.Color.Grey600 }}
                             containerStyle={additionalStyle}
                             imageSource={Images.preview}
                             onPress={previewPack} />
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

FeedSourcesSettingsScreen = connect((state) => ({ sources: state.sources }))(FeedSourcesSettingsScreen)

export {
    FeedSourcesSettingsScreen,
}
