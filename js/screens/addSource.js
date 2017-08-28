import React from 'react'
import {StyleSheet, Text, TextInput, View} from 'react-native'
import {NavigationActions} from 'react-navigation'
import {connect} from 'react-redux'
import uuid from 'uuid'

import {Images} from '/images'
import {Styles} from '/styles'
import {BaseComponent, ImageButton} from '/widgets'

import * as Actions from './actions'
import {Parsers} from './parsers'

const styles = {
    container: {
        alignItems: 'stretch',
        backgroundColor: Styles.Color.White,
        flex: 1,
        justifyContent: 'flex-start',
    },
    field: {
        alignItems: 'center',
        flexDirection: 'row',
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

/**
 * Redux connected done button to display in the action area of the nav header.
 */
class DoneButton extends BaseComponent {
    addSource = () => {
        if (!this.props.url || !this.props.title) {
            return
        }

        const source = {
            enabled: true,
            key: uuid.v4(),
            parser: this.props.parser,
            title: this.props.title,
            url: this.props.url,
        }

        this.props.dispatch(Actions.addSource(source))
        this.props.dispatch(NavigationActions.back())
    }

    render() {
        const style = {
            tintColor: (this.props.url ? Styles.Color.Grey700 : Styles.Color.Grey100),
        }

        return (
            <ImageButton buttonStyle={style}
                         imageSource={Images.done}
                         onPress={this.addSource} />
        )
    }
}

DoneButton = connect()(DoneButton)

/**
 * Screen used to add sources to the app. Displays a form appropriate to the parser name provided via the screen's
 * navigation params.
 *
 * Required navigation params:
 *   typeName: User facing name of the parser name (e.g. Instagram)
 *   parser: The name of the parser that will process this source (e.g. Parser.Reddit).
 */
class AddSourceScreen extends BaseComponent {
    static navigationOptions = ({navigation}) => {
        const params = navigation.state.params
        return {
            title: 'Add ' + params.typeName + ' Source',
            headerRight: (
                <DoneButton parser={params.parser}
                            title={params.title}
                            url={params.url} />
            ),
        }
    }

    renderRedditForm() {
        const update = () => {
            let title = null
            let url = null
            if (this.redditSub && this.redditLimit) {
                title = '/r/' + this.redditSub
                url = 'https://www.reddit.com' + title + '/.json?raw_json=1&limit=' + this.redditLimit
            }

            this.props.navigation.setParams({
                ...this.props.navigation.state.params,
                title: title,
                url: url,
            })
        }

        const updateSub = (text) => {
            this.redditSub = text
            update()
        }

        this.redditLimit = "25"
        const updateLimit = (text) => {
            this.redditLimit = text
            update()
        }

        return (
            <View style={stylesheet.container}>
                <View style={stylesheet.field}>
                    <Text style={[stylesheet.text, stylesheet.fieldLabel]}>Sub: /r/</Text>
                    <TextInput autoCorrect={false}
                               autoFocus={true}
                               onChangeText={updateSub}
                               placeholder="Cats"
                               placeholderTextColor={Styles.Color.Grey400}
                               style={[stylesheet.text, stylesheet.fieldValue]} />
                </View>

                <View style={stylesheet.field}>
                    <Text style={[stylesheet.text, stylesheet.fieldLabel]}>Limit:</Text>
                    <TextInput autoCorrect={false}
                               autoFocus={false}
                               keyboardType="numeric"
                               maxLength={3}
                               onChangeText={updateLimit}
                               placeholder="25"
                               placeholderTextColor={Styles.Color.Grey400}
                               style={[stylesheet.text, stylesheet.fieldValue]}
                               value="25" />
                </View>
            </View>
        )
    }

    renderInstagramForm() {
        const update = () => {
            let title = null
            let url = null
            if (this.instagramName && this.instagramTitle) {
                title = this.instagramTitle
                url = 'https://www.instagram.com/' + this.instagramName + '/media/'
            }

            this.props.navigation.setParams({
                ...this.props.navigation.state.params,
                title: title,
                url: url,
            })
        }

        const updateName = (text) => {
            this.instagramName = text
            update()
        }

        const updateTitle = (text) => {
            this.instagramTitle = text
            update()
        }

        return (
            <View style={stylesheet.container}>
                <View style={stylesheet.field}>
                    <Text style={[stylesheet.text, stylesheet.fieldLabel]}>Name: @</Text>
                    <TextInput autoCorrect={false}
                               autoFocus={true}
                               onChangeText={updateName}
                               placeholder="whiskersnpurrs"
                               placeholderTextColor={Styles.Color.Grey400}
                               style={[stylesheet.text, stylesheet.fieldValue]} />
                </View>

                <View style={stylesheet.field}>
                    <Text style={[stylesheet.text, stylesheet.fieldLabel]}>Title: </Text>
                    <TextInput autoCorrect={false}
                               autoFocus={false}
                               onChangeText={updateTitle}
                               placeholder="Kitten Foster Home"
                               placeholderTextColor={Styles.Color.Grey400}
                               style={[stylesheet.text, stylesheet.fieldValue]} />
                </View>
            </View>
        )
    }

    render() {
        switch (this.props.navigation.state.params.parser) {
            case Parsers.Reddit:
                return this.renderRedditForm()

            case Parsers.Instagram:
                return this.renderInstagramForm()

            default:
                throw 'Unknown source: ' + this.props.navigation.state.params.parser
        }
    }
}

export {
    AddSourceScreen,
}
