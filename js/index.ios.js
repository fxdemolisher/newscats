/**
 * Entry point file for iOS. Registers the application with the RN app registry so that it can start.
 */
import React from 'react'
import {AppRegistry} from 'react-native'

import {Application} from './application'

AppRegistry.registerComponent('NewsCats', () => Application)
