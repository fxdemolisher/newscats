import React from 'react'
import {Image, StyleSheet, TouchableOpacity} from 'react-native'

import {Styles} from '/styles'

import {BaseComponent} from './BaseComponent'

/**
 * A simple image wrapped in a touchable opacity component to allow for touch interactions.
 */
class ImageButton extends BaseComponent {
    static defaultProps = {
        // Used in the 'source' prop for the image component.
        imageSource: null,

        // Callback for when the image is pressed.
        onPress: null,

        // Optionjal, style of the image component.
        style: null,

        // Optional, tint color of the image component.
        tintColor: null,
    }

    render() {
        return (
            <TouchableOpacity accessibilityComponentType="button"
                              accessibilityTraits="button"
                              onPress={this.props.onPress}
                              renderToHardwareTextureAndroid={true}
                              shouldRasterizeIOS={true}>

                <Image resizeMode="center"
                       source={this.props.imageSource}
                       style={this.props.style}
                       tintColor={this.props.tintColor} />

            </TouchableOpacity>
        )
    }
}

export {
    ImageButton,
}
