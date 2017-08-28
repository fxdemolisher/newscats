import {Dimensions} from 'react-native'

/**
 * Represents a static (or default) responsive filter value.
 */
class StaticResponder {
    constructor(value) {
        this.value = value
    }

    applies() {
        return true
    }
}

/**
 * A responder for screen size.
 */
class ScreenWidthResponder {
    // iPhone 5 / SE
    static Small = (value) => (new ScreenWidthResponder(320, value))

    // iPhone 6 / 7
    static Medium = (value) => (new ScreenWidthResponder(375, value))

    // iPhone 6 Plus / 7 Plus
    static Large = (value) => (new ScreenWidthResponder(414, value))

    constructor(minimumWidth, value) {
         this.minimumWidth = minimumWidth
         this.value = value
    }

    applies() {
        const screenWidth = Dimensions.get('window').width
        return screenWidth >= this.minimumWidth
    }
}

/**
 * Container for responsive values.
 */
class Responsive {
    static Value = StaticResponder
    static Screen = ScreenWidthResponder

    /**
     * Adds a collection of responders to a value of a specific name.
     *
     * Example:
     *     const MySizes = new Responsive()
     *         .add(
     *             'fontHeight',
     *             Responsive.Screen.Small(10),
     *             Responsive.Screen.Medium(12),
     *             Responsive.Screen.Large(14)
     *         )
     *
     * Usage:
     *     const value = MySizes.fontHeight
     *
     * Responders are checked when a value is requested. If no responders apply an error is thrown.
     * In the case of multiple responders applying, the value of the last one that applies is returned.
     */
    add(name, ...responders) {
        const getter = () => {
            const applicable = responders.filter((responder) => (responder.applies()))
            if (applicable.length == 0) {
                 throw new Error("Cannot determine responsive value for name: " + name)
            }

            const lastApplicable = applicable[applicable.length - 1]
            return lastApplicable.value
        }

        Object.defineProperty(this, name, { get: getter })
        return this
    }
}

export {
    Responsive,
}
