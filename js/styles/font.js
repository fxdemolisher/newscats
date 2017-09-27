import {Responsive} from './responsive'

/**
 * Font family names available for styling.
 * Usage:
 *   import {Styles} from '/styles'
 *   const foo = Styles.Font.Family.RobotoRegular
 */
const Family = {
    RobotoMedium: 'Roboto-Medium',
    RobotoRegular: 'Roboto-Regular',
}

/**
 * Font sizes available for styling.
 * Usage:
 *   import {Styles} from '/styles'
 *   const foo = Styles.Font.Size.Normal
 */
const Size = new Responsive()
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
export const Font = {
    Family: Family,
    Size: Size,
}
