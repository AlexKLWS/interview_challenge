/**
 * @format
 */
import 'reflect-metadata'
import React from 'react'
import { AppRegistry } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import backgroundMessaging from './src/services/backgroundMessaging'
import { container, containerModule } from '~/services/servicesContainer'
import { ServiceProvider } from '~/services/serviceProvider'

container.load(containerModule)

AppRegistry.registerComponent(appName, () => (props) => (
  <ServiceProvider container={container}>
    <App {...props} />
  </ServiceProvider>
))
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => backgroundMessaging)
