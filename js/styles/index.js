import * as ColorManipulator from 'color'

import {Responsive} from './responsive'

/**
 * Colors available for styling.
 * Usage:
 *   import {Styles} from '/styles'
 *   const foo = Styles.Color.Black
 */
const Color = {
    Amber500: ColorManipulator.default('#FFC107FF'),
    Black: ColorManipulator.default('#000000FF'),
    Clear: ColorManipulator.default('#FFFFFF00'),
    Green500: ColorManipulator.default('#4CAF50FF'),
    Grey50: ColorManipulator.default('#FAFAFAFF'),
    Grey100: ColorManipulator.default('#F5F5F5FF'),
    Grey200: ColorManipulator.default('#EEEEEEFF'),
    Grey300: ColorManipulator.default('#E0E0E0FF'),
    Grey400: ColorManipulator.default('#BDBDBDFF'),
    Grey500: ColorManipulator.default('#9E9E9EFF'),
    Grey600: ColorManipulator.default('#757575FF'),
    Grey700: ColorManipulator.default('#616161FF'),
    Grey800: ColorManipulator.default('#424242FF'),
    Grey900: ColorManipulator.default('#212121FF'),
    Red500: ColorManipulator.default('#F44336FF'),
    Red600: ColorManipulator.default('#E53935FF'),
    RedA400: ColorManipulator.default('#FF1744FF'),
    White: ColorManipulator.default('#FFFFFFFF'),
}

/**
 * Font family names available for styling.
 * Usage:
 *   import {Styles} from '/styles'
 *   const foo = Styles.Font.Family.RobotoRegular
 */
const FontFamily = {
    RobotoMedium: 'Roboto-Medium',
    RobotoRegular: 'Roboto-Regular',
}

/**
 * Font sizes available for styling.
 * Usage:
 *   import {Styles} from '/styles'
 *   const foo = Styles.Font.Size.Normal
 */
const FontSize = new Responsive()
    .add(
         'Large',
         Responsive.Screen.Small(20),
         Responsive.Screen.Medium(24),
         Responsive.Screen.Large(28)
    )
    .add(
         'Medium',
         Responsive.Screen.Small(16),
         Responsive.Screen.Medium(20),
         Responsive.Screen.Large(24)
    )
    .add(
         'Small',
         Responsive.Screen.Small(12),
         Responsive.Screen.Medium(16),
         Responsive.Screen.Large(20)
    )
    .add(
         'XSmall',
         Responsive.Screen.Small(8),
         Responsive.Screen.Medium(12),
         Responsive.Screen.Large(16)
    )
    .add(
         'XXSmall',
         Responsive.Screen.Small(8),
         Responsive.Screen.Medium(10),
         Responsive.Screen.Large(12)
    )

/**
 * Definitions for fonts.
 */
const Font = {
    Family: FontFamily,
    Size: FontSize,
}

/**
 * Sizes (margin, padding, spacing, etc) available for styling.
 * Usage:
 *   import {Styles} from '/styles'
 *   const foo = Styles.Size.Small
 */
const Size = new Responsive()
    .add(
         'XLarge',
         Responsive.Screen.Small(24),
         Responsive.Screen.Medium(32),
         Responsive.Screen.Large(40)
    )
    .add(
         'Large',
         Responsive.Screen.Small(20),
         Responsive.Screen.Medium(24),
         Responsive.Screen.Large(32)
    )
    .add(
         'Medium',
         Responsive.Screen.Small(16),
         Responsive.Screen.Medium(20),
         Responsive.Screen.Large(24)
    )
    .add(
         'Small',
         Responsive.Screen.Small(12),
         Responsive.Screen.Medium(16),
         Responsive.Screen.Large(20)
    )
    .add(
         'XSmall',
         Responsive.Screen.Small(4),
         Responsive.Screen.Medium(8),
         Responsive.Screen.Large(12)
    )
    .add(
         'XXSmall',
         Responsive.Screen.Small(2),
         Responsive.Screen.Medium(4),
         Responsive.Screen.Large(8)
    )

/**
 * Collection of our styles.
 */
const Styles = {
    Color: Color,
    Font: Font,
    Size: Size,
}

export {
    Styles,
}
