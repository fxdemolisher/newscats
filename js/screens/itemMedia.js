import React from 'react'
import {Image, StyleSheet, View} from 'react-native'
import * as ZoomableImage from 'react-native-transformable-image'
import Video from 'react-native-video'

import {Images} from '/images'
import {Styles} from '/styles'
import {BaseComponent, ImageButton} from '/widgets'

import {ItemMediaType} from './parsers'

const styles = {
    fillScreen: {
        height: '100%',
        width: '100%',
    },
    background: {
        backgroundColor: Styles.Color.Black,
    },
    controlContainer: {
        left: '50%',
        marginLeft: -48,
        marginTop: -48,
        position: 'absolute',
        top: '50%',
    },
    playIcon: {
        height: 96,
        tintColor: Styles.Color.Grey200,
        width: 96,
    }
}

const stylesheet = StyleSheet.create(styles)

/**
 * A component for displaying preview and details videos.
 * Videos start paused with a visible play button.
 */
class VideoMedia extends BaseComponent {
    constructor(props) {
        super(props)

        this.state = { paused: true }
    }

    togglePaused = () => {
        this.setState({ paused: !this.state.paused })
    }

    renderPlayButton() {
        return (
            <ImageButton buttonStyle={stylesheet.playIcon}
                         containerStyle={stylesheet.controlContainer}
                         imageSource={Images.play}
                         onPress={this.togglePaused}
                         styleMode="replace" />
        )
    }

    render() {
        return (
            <View style={stylesheet.background}>
                <Video muted={true}
                       onLoad={() => { this.video.seek(0) }}
                       paused={this.state.paused}
                       ref={(ref) => { this.video = ref }}
                       repeat={true}
                       resizeMode="contain"
                       source={{ uri: this.props.url }}
                       style={stylesheet.fillScreen}
                       volume={0} />

                {this.state.paused && this.renderPlayButton()}
            </View>
        )
    }
}

/**
 * A unified way to display media in an item (fed or favorites).
 */
class ItemMedia extends BaseComponent {
    static defaultProps = {
        // The type of media that will be displayed. One of parsers.ItemMediaType.
        mediaType: null,

        // The url of the media to display.
        url: null,

        // Optional, if set to false, pinch-to-zoom on images is disabled. Applies only to images.
        zoomable: true,
    }

    renderSimpleImage() {
        return (
            <Image resizeMode="cover"
                   source={{ uri: this.props.url }}
                   style={[stylesheet.fillScreen, stylesheet.background]} />
        )
    }

    renderZoomableImage() {
        return (
            <ZoomableImage.default source={{ uri: this.props.url }}
                                   style={[stylesheet.fillScreen, stylesheet.background]} />
        )
    }

    renderVideo() {
        return (
            <VideoMedia url={this.props.url} />
        )
    }

    render() {
        switch (this.props.mediaType) {
            case ItemMediaType.Image:
                return (this.props.zoomable ? this.renderZoomableImage() : this.renderSimpleImage())

            case ItemMediaType.VideoMp4:
                return this.renderVideo()

            default:
                throw 'Unknown media type: ' + this.props.mediaType
        }
    }
}

export {
    ItemMedia,
}
