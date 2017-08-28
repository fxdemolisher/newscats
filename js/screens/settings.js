import React from 'react'
import {Alert, Image, NativeModules, SectionList, StyleSheet, Switch, Text, View} from 'react-native'
import {NavigationActions} from 'react-navigation'
import {connect} from 'react-redux'

import {Images} from '/images'
import {Styles} from '/styles'
import {BaseComponent, ImageButton} from '/widgets'

import * as Actions from './actions'
import {Parsers} from './parsers'

const styles = {
    list: {
        backgroundColor: Styles.Color.White,
        flex: 1,
    },
    headerActions: {
        flexDirection: 'row',
    },
    section: {
        alignItems: 'center',
        backgroundColor: Styles.Color.Grey100,
        flexDirection: 'row',
    },
    sectionIcon: {
        height: 24,
        margin: Styles.Size.Small,
        width: 24,
    },
    sectionText: {
        ...Styles.Text.Standard,
        color: Styles.Color.Grey800,
        fontSize: Styles.Font.Size.Medium,
        flex: 1,
    },
    item: {
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
    },
    itemText: {
        ...Styles.Text.Standard,
        color: Styles.Color.Grey700,
        fontSize: Styles.Font.Size.Small,
        flex: 1,
    },
    itemSwitch: {
        marginLeft: Styles.Size.XSmall,
        marginRight: Styles.Size.Small,
    }
}

const stylesheet = StyleSheet.create(styles)

/**
 * Component to display the action (e.g. reset, info) area of the setting screen's navigation header.
 */
class HeaderActions extends BaseComponent {
    fullReset = () => {
        const reset = () => {
            this.props.storage
                .persistor
                .purge()
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

    gotoInfo = () => {
        const action = NavigationActions.navigate({ routeName: 'debug' })
        this.props.dispatch(action)
    }

    render() {
        return (
            <View style={stylesheet.headerActions}>
                <ImageButton imageSource={Images.info}
                             onPress={this.gotoInfo}
                             style={Styles.Common.headerIcon}
                             tintColor={Styles.Color.Grey700} />

                <ImageButton imageSource={Images.reset}
                             onPress={this.fullReset}
                             style={Styles.Common.headerIcon}
                             tintColor={Styles.Color.Grey700} />
             </View>
        )
    }
}

HeaderActions = connect((state) => ({ storage: state.storage }))(HeaderActions)

/**
 * A screen that allows the user to manipulate the list of sources used for the home screen feed.
 */
class SettingsScreen extends BaseComponent {
    static navigationOptions = {
        title: 'Settings',
        headerRight: (<HeaderActions />),
    }

    componentWillMount() {
        this.initializeSections(this.props.sources)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.sources != nextProps.sources) {
            this.initializeSections(nextProps.sources)
        }
    }

    initializeSections(sources) {
        const redditSources = []
        const instagramSources = []
        Object.keys(sources).forEach((key) => {
            const source = sources[key]

            switch (source.parser) {
                case Parsers.Reddit:
                    redditSources.push(source)
                    break

                case Parsers.Instagram:
                    instagramSources.push(source)
                    break

                default:
                    throw 'Unknown source: ' + source.parser
            }
        })

        const titleSorter = (left, right) => {
            if (left.title == right.title) {
                return 0
            }

            return (left.title < right.title ? -1 : 1)
        }

        redditSources.sort(titleSorter)
        instagramSources.sort(titleSorter)

        this.sections = [
            {
                addFunction: this.getGotoAddSource('Reddit', Parsers.Reddit),
                data: redditSources,
                iconSource: Images.sourceReddit,
                title: 'Reddit',
            },
            {
                addFunction: this.getGotoAddSource('Instagram', Parsers.Instagram),
                data: instagramSources,
                iconSource: Images.sourceInstagram,
                title: 'Instagram',
            },
        ]
    }

    getGotoAddSource(typeName, parser) {
        return () => {
            const action = NavigationActions.navigate({
                routeName: 'addSource',
                params: {
                    parser: parser,
                    typeName: typeName,
                },
            })

            this.props.dispatch(action)
        }
    }

    renderSectionHeader = ({section}) => {
        return (
            <View style={stylesheet.section}>
                <Image resizeMode="contain"
                       source={section.iconSource}
                       style={stylesheet.sectionIcon} />

                <Text style={stylesheet.sectionText}>{section.title}</Text>

                <ImageButton imageSource={Images.add}
                             onPress={section.addFunction}
                             style={Styles.Common.headerIcon}
                             tintColor={Styles.Color.Grey700} />
            </View>
        )
    }

    renderSource = ({item}) => {
        const removeItemDispatch = () => {
            this.props.dispatch(Actions.removeSource(item.key))
        }

        const removeItem = () => {
            Alert.alert(
                'Remove Source',
                'Are you sure you want to remove this source?',
                [ {text: 'Cancel',  style: 'cancel'}, {text: 'Remove', onPress: removeItemDispatch} ],
                { cancelable: true }
            )
        }

        const toggleItem = (value) => {
            this.props.dispatch(Actions.toggleSource(item.key, value))
        }

        const additionalStyle = {
            opacity: (item.enabled ? 1.0 : 0.6),
        }

        return (
            <View style={stylesheet.item}>
                <Switch onTintColor={Styles.Color.Grey300}
                        onValueChange={toggleItem}
                        style={stylesheet.itemSwitch}
                        thumbTintColor={item.enabled ? Styles.Color.Green500 : Styles.Color.Red500}
                        tintColor={Styles.Color.Grey200}
                        value={item.enabled} />

                <Text style={[stylesheet.itemText, additionalStyle]}>
                    {item.title}
                </Text>

                <ImageButton imageSource={Images.remove}
                             onPress={removeItem}
                             style={[Styles.Common.headerIcon, additionalStyle]}
                             tintColor={Styles.Color.Grey500} />
            </View>
        )
    }

    render() {
        return (
            <SectionList renderItem={this.renderSource}
                         renderSectionHeader={this.renderSectionHeader}
                         sections={this.sections}
                         style={stylesheet.list} />
        )
    }
}

const mapStateToProps = (state) => {
    return {
        sources: state.sources,
    }
}

SettingsScreen = connect(mapStateToProps)(SettingsScreen)

export {
    SettingsScreen,
}
