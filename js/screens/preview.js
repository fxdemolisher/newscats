import React from 'react'
import {StyleSheet, View} from 'react-native'
import {connect} from 'react-redux'

import {Actions} from '/actions'
import {Constants} from '/constants'
import {Styles} from '/styles'
import {BaseComponent, Feed} from '/widgets'

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
        this.props.dispatch(Actions.Feed.refreshPreview(sourcePackKey))

        this.startedRefresh = true
    }

    render() {
        return (
            <View style={stylesheet.container}>
                <Feed contents={this.props.preview.contents}
                      refresh={() => {}}
                      refreshing={this.props.preview.status == Constants.Feed.Status.Refreshing} />
            </View>
        )
    }
}

PreviewScreen = connect((state) => ({ preview: state.preview }))(PreviewScreen)

export {
    PreviewScreen,
}
