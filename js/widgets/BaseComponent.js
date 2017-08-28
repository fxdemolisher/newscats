import React from 'react'
import ReactMixin from 'react-mixin'
import TimerMixin from 'react-timer-mixin'

/**
 * A base react component that all widgets and screens should extend from.
 * Provides common functionality but most importantly it is a PureComponent and includes the TimerMixin.
 */
class BaseComponent extends React.PureComponent {
    // NOTE: add functions common to all components here.
}

// Add the timer mixin to the base component.
ReactMixin(BaseComponent.prototype, TimerMixin)

export {
    BaseComponent,
}
