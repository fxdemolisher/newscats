import React from 'react'
import {Image, StyleSheet, TouchableOpacity} from 'react-native'

import {Styles} from '/styles'

import {BaseComponent} from './BaseComponent'

const styles = {
    container: {
        alignItems: 'center',
        height: 48,
        justifyContent: 'center',
        marginRight: 8,
        width: 48,
    },
    button: {
        height: 24,
        tintColor: Styles.Color.White,
        width: 24,
    },
}

const stylesheet = StyleSheet.create(styles)

/**
 * A simple image wrapped in a touchable opacity component to allow for touch interactions.
 */
class ImageButton extends BaseComponent {
    static defaultProps = {
        // Optional, style of the image component.
        buttonStyle: null,

        // Optional, style of the container view.
        containerStyle: null,

        // Used in the 'source' prop for the image component.
        imageSource: null,

        // Callback for when the image is pressed.
        onPress: null,
    }

    render() {
        const containerStyle = [
            stylesheet.container,
            this.props.containerStyle,
        ]

        const buttonStyle = [
            stylesheet.button,
            this.props.buttonStyle,
        ]

        return (
            <TouchableOpacity accessibilityComponentType="button"
                              accessibilityTraits="button"
                              onPress={this.props.onPress}
                              renderToHardwareTextureAndroid={true}
                              shouldRasterizeIOS={true}
                              style={containerStyle}>

                <Image resizeMode="center"
                       source={this.props.imageSource}
                       style={buttonStyle} />

            </TouchableOpacity>
        )
    }
}

export {
    ImageButton,
}
