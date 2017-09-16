import React from 'react'
import {StyleSheet, View} from 'react-native'
import {connect} from 'react-redux'

import {Styles} from '/styles'
import {BaseComponent} from '/widgets'

import * as Actions from './actions'
import {Feed} from './feed'

const styles = {
    container: {
        backgroundColor: Styles.Color.Grey300,
        height: '100%',
        width: '100%',
    },
}

const stylesheet = StyleSheet.create(styles)

/**
 * A screen used to show a feed of preview items.
 */
class PreviewScreen extends BaseComponent {
    static navigationOptions = ({navigation}) => {
        const params = navigation.state.params || {}
        return {
            title: 'Preview: ' + params.sourcePackTitle,
        }
    }

    constructor(props) {
        super(props)

        this.startedRefresh = false
    }

    componentWillMount() {
        if (this.startedRefresh) {
            return
        }

        const sourcePackKey = this.props.navigation.state.params.sourcePackKey
        this.props.dispatch(Actions.refreshPreview(sourcePackKey))

        this.startedRefresh = true
    }

    render() {
        return (
            <View style={stylesheet.container}>
                <Feed contents={this.props.preview.contents}
                      refresh={() => {}}
                      refreshing={this.props.preview.status == Actions.FeedStatus.Refreshing} />
            </View>
        )
    }
}

PreviewScreen = connect((state) => ({ preview: state.preview }))(PreviewScreen)

export {
    PreviewScreen,
}
