import {Responsive} from './responsive'

/**
 * Sizes (margin, padding, spacing, etc) available for styling.
 * Usage:
 *   import {Styles} from '/styles'
 *   const foo = Styles.Size.Small
 */
export const Size = new Responsive()
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
