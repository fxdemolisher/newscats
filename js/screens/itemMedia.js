import React from 'react'
import {ActivityIndicator, Image, StyleSheet, View} from 'react-native'
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
    floatingCenteringContainer: {
        alignItems: 'center',
        backgroundColor: Styles.Color.Clear,
        bottom: 0,
        left: 0,
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        top: 0,
    },
    playIcon: {
        height: 96,
        tintColor: Styles.Color.Grey200,
        width: 96,
    }
}

const stylesheet = StyleSheet.create(styles)

class LoadingIndicator extends BaseComponent {
    static defaultProps = {
        // If visible, the indicator is shown.
        visible: true,
    }

    render() {
        return (
            <View style={stylesheet.floatingCenteringContainer}>
                <ActivityIndicator animating={this.props.visible}
                                   color={Styles.Color.Grey200}
                                   size="large" />
            </View>
        )
    }
}

class ImageMedia extends BaseComponent {
    static defaultProps = {
        // Style to apply to the Image component.
        style: null,

        // The image's URL.
        url: null,

        // Optional, if set to false, pinch-to-zoom on images is disabled.
        zoomable: true,
    }

    constructor(props) {
        super(props)

        this.state = { loading: true }
    }

    onLoadingEnded = () => {
        this.setState({ loading: false })
    }

    renderSimpleImage() {
        return (
            <Image onLoadEnd={this.onLoadingEnded}
                   resizeMode="cover"
                   source={{ uri: this.props.url }}
                   style={this.props.style} />
        )
    }

    renderZoomableImage() {
        return (
            <ZoomableImage.default onLoadEnd={this.onLoadingEnded}
                                   source={{ uri: this.props.url }}
                                   style={this.props.style} />
        )
    }

    render() {
        return (
            <View style={stylesheet.background}>
                {this.props.zoomable ? this.renderZoomableImage() : this.renderSimpleImage()}

                <LoadingIndicator visible={this.state.loading} />
            </View>
        )
    }
}

/**
 * A component for displaying preview and details videos.
 * Videos start paused with a visible play button.
 */
class VideoMedia extends BaseComponent {
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            paused: true,
        }
    }

    onLoad = () => {
        this.video.seek(0)
        this.setState({ loading: false })
    }

    togglePaused = () => {
        this.setState({ paused: !this.state.paused })
    }

    renderPlayButton() {
        return (
            <ImageButton buttonStyle={stylesheet.playIcon}
                         containerStyle={stylesheet.floatingCenteringContainer}
                         imageSource={Images.play}
                         onPress={this.togglePaused}
                         styleMode="replace" />
        )
    }

    render() {
        return (
            <View style={stylesheet.background}>
                <Video muted={true}
                       onLoad={this.onLoad}
                       paused={this.state.paused}
                       ref={(ref) => { this.video = ref }}
                       repeat={true}
                       resizeMode="contain"
                       source={{ uri: this.props.url }}
                       style={stylesheet.fillScreen}
                       volume={0} />

                <LoadingIndicator visible={this.state.loading} />

                {!this.state.loading && this.state.paused && this.renderPlayButton()}
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


    }

    render() {
        switch (this.props.mediaType) {
            case ItemMediaType.Image:
                return (
                    <ImageMedia style={stylesheet.fillScreen}
                                url={this.props.url}
                                zoomable={this.props.zoomable} />
                )

            case ItemMediaType.VideoMp4:
                return (
                    <VideoMedia url={this.props.url} />
                )

            default:
                throw 'Unknown media type: ' + this.props.mediaType
        }
    }
}

export {
    ItemMedia,
}
