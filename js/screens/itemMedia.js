import React from 'react'
import {Image, StyleSheet, View} from 'react-native'
import * as ZoomableImage from 'react-native-transformable-image'

import {Styles} from '/styles'
import {BaseComponent} from '/widgets'

import {ItemMediaType} from './parsers'

const styles = {
    fillScreen: {
        backgroundColor: Styles.Color.Black,
        height: '100%',
        width: '100%',
    }
}

const stylesheet = StyleSheet.create(styles)

/**
 * A unified way to display media in an item (fed or favorites).
 */
class ItemMedia extends BaseComponent {
    static defaultProps = {
        // The type of media that will be displayed. One of parsers.ItemMediaType.
        mediaType: null,

        // The url of the media to display.
        url: null,

        // Optional, if set to false, pinch-to-zoom on images is disabled.
        zoomable: true,
    }

    renderSimpleImage() {
        return (
            <Image resizeMode="cover"
                   source={{ uri: this.props.url }}
                   style={stylesheet.fillScreen} />
        )
    }

    renderZoomableImage() {
        return (
            <ZoomableImage.default source={{ uri: this.props.url }}
                                   style={stylesheet.fillScreen} />
        )
    }

    render() {
        switch (this.props.mediaType) {
            case ItemMediaType.Image:
                return (this.props.zoomable ? this.renderZoomableImage() : this.renderSimpleImage())

            default:
                throw 'Unknown media type: ' + this.props.mediaType
        }
    }
}

export {
    ItemMedia,
}
