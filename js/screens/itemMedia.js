import React from 'react'
import {ActivityIndicator, Dimensions, Image, StyleSheet, View} from 'react-native'
import PhotoView from 'react-native-photo-view'
import Video from 'react-native-video'

import {Images} from '/images'
import {Styles} from '/styles'
import {BaseComponent, ImageButton} from '/widgets'

import {ItemMediaType} from './sourceParsers'

const styles = {
    fillScreen: {
        height: '100%',
        width: '100%',
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
    playPauseIcon: {
        height: 96,
        tintColor: Styles.Color.Grey200,
        width: 96,
    }
}

const stylesheet = StyleSheet.create(styles)

// Defines the maximum height of the media, a percentage of the screen height.
const MAX_MEDIA_HEIGHT = Dimensions.get('window').height * 0.65

/**
 * Calculates the effective width/height of the media frame, depending on its layout and media dimensions.
 * Takes into account whether we are displaying in full screen or feed mode and whether the media is still loading.
 */
function calculateWidthAndHeight(isFullscreen, isLoading, layoutHeight, layoutWidth, mediaHeight, mediaWidth) {
    // Build a default based on whether we are displaying full screen or not.
    const defaultDimensions = {
        height: (isFullscreen ? '100%' : MAX_MEDIA_HEIGHT),
        width: '100%',
    }

    // If we're not ready or we're displaying fullscreen, return the default width/height.
    if (isFullscreen || isLoading || !mediaHeight || !mediaWidth|| !layoutHeight || !layoutWidth) {
        return defaultDimensions
    }

    // If the image's height is less than our max, shrink the frame.
    if (mediaHeight < MAX_MEDIA_HEIGHT) {
        return {
            ...defaultDimensions,
            height: mediaHeight,
        }
    }

    // If the target height (adjusted for aspect ratio) is greater than our max, return the default.
    const ratio = mediaWidth / mediaHeight
    const targetHeight = layoutWidth / ratio
    if (targetHeight > MAX_MEDIA_HEIGHT) {
        return defaultDimensions
    }

    // Otherwise, return the current layout width and height adjusted for the image's aspect ratio.
    return {
        height: targetHeight,
        width: layoutWidth,
    }
}

/**
 * Given a media components props and state, returns the style used for a View that will contain the media.
 *
 * Expected properties in props:
 *   fullScreen: boolean
 *
 * Expected properties in state:
 *   loading: boolean
 *   layoutHeight: int|null
 *   layoutWidth: int|null
 *   mediaHeight: int|null
 *   mediaWidth: int|null
 */
function getMediaContainerViewStyle(props, state) {
    const {width, height} = calculateWidthAndHeight(
        props.fullScreen,
        state.loading,
        state.layoutHeight,
        state.layoutWidth,
        state.mediaHeight,
        state.mediaWidth,
    )

    return {
        backgroundColor: props.backgroundColor,
        height: height,
        width: width,
    }
}

/**
 * Wraps a loading indicator in a container that makes it appear exactly in the center of its parent.
 */
class LoadingIndicator extends BaseComponent {
    static defaultProps = {
        // If visible, the indicator is shown.
        visible: true,
    }

    render() {
        return (
            <View pointerEvents="none"
                  style={stylesheet.floatingCenteringContainer}>
                <ActivityIndicator animating={this.props.visible}
                                   color={Styles.Color.Grey200}
                                   size="large" />
            </View>
        )
    }
}

/**
 * Component used to display image media.
 */
class ImageMedia extends BaseComponent {
    static defaultProps = {
        // If true, we are displaying the image in full screen mode (unrestricted height and zoomable).
        fullScreen: null,

        // Style to apply to the Image component.
        style: null,

        // The image's URL.
        url: null,
    }

    constructor(props) {
        super(props)

        this.mounted = false
        this.state = { loading: true }
    }

    componentWillMount() {
        this.mounted = true

        Image.getSize(
            this.props.url,
            (width, height) => {
                if (!this.mounted) {
                    return
                }

                this.setState({
                    mediaHeight: height,
                    mediaWidth: width,
                })
            },
            (err) => {
                console.log("WARNING: failed to retrieve image dimensions.")
            }
        )
    }

    componentWillUnmount() {
        this.mounted = false
    }

    onLoadingEnded = () => {
        this.setState({ loading: false })
    }

    onLayout = ({nativeEvent}) => {
        if (this.state.layoutHeight) {
            return
        }

        const {width, height} = nativeEvent.layout
        this.setState({
            layoutHeight: height,
            layoutWidth: width,
        })
    }

    renderSimpleImage() {
        return (
            <Image onLoadEnd={this.onLoadingEnded}
                   resizeMode="contain"
                   source={{ uri: this.props.url }}
                   style={stylesheet.fillScreen} />
        )
    }

    renderZoomableImage() {
        return (
            <PhotoView androidScaleType="fitCenter"
                       maximumZoomScale={5.0}
                       minimumZoomScale={0.5}
                       onLoadEnd={this.onLoadingEnded}
                       source={{ uri: this.props.url }}
                       style={stylesheet.fillScreen} />
        )
    }

    renderImage() {
        if (this.props.fullScreen) {
            return this.renderZoomableImage()
        }

        return this.renderSimpleImage()
    }

    render() {
        return (
            <View onLayout={this.onLayout}
                  style={getMediaContainerViewStyle(this.props, this.state)}>
                {this.state.layoutHeight && this.state.mediaHeight && this.renderImage()}

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
    static defaultProps = {
        // If true, we are displaying the image in full screen mode (unrestricted height).
        fullScreen: null,
    }

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            paused: true,
        }
    }

    onLoad = ({naturalSize}) => {
        this.video.seek(0)

        const {height, width} = naturalSize
        this.setState({
            loading: false,
            mediaHeight: height,
            mediaWidth: width,
        })
    }

    onLayout = ({nativeEvent}) => {
        if (this.state.layoutHeight) {
            return
        }

        const {width, height} = nativeEvent.layout
        this.setState({
            layoutHeight: height,
            layoutWidth: width,
        })
    }

    togglePaused = () => {
        this.setState({ paused: !this.state.paused })
    }

    renderPlayPauseOverlay() {
        const source = (this.state.paused ? Images.play : null)

        return (
            <ImageButton buttonStyle={stylesheet.playPauseIcon}
                         containerStyle={stylesheet.floatingCenteringContainer}
                         imageSource={source}
                         onPress={this.togglePaused}
                         styleMode="replace" />
        )
    }

    render() {
        return (
            <View onLayout={this.onLayout}
                  style={getMediaContainerViewStyle(this.props, this.state)}>
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

                {!this.state.loading && this.renderPlayPauseOverlay()}
            </View>
        )
    }
}

/**
 * A unified way to display media in an item (fed or favorites).
 */
class ItemMedia extends BaseComponent {
    static defaultProps = {
        // The background color in case the media doesn't fill its parent fully.
        backgroundColor: Styles.Color.Black,

        // If true, we are displaying the image in full screen mode.
        fullScreen: true,

        // The type of media that will be displayed. One of sourceParsers.ItemMediaType.
        mediaType: null,

        // The url of the media to display.
        url: null,
    }

    render() {
        switch (this.props.mediaType) {
            case ItemMediaType.Image:
                return (<ImageMedia {...this.props} />)

            case ItemMediaType.VideoMp4:
                return (<VideoMedia {...this.props} />)

            default:
                throw 'Unknown media type: ' + this.props.mediaType
        }
    }
}

export {
    ItemMedia,
}
