import 'reflect-metadata'
import React, { useState, useEffect, useRef } from 'react'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { Provider as PaperProvider } from 'react-native-paper'
import firebase from 'react-native-firebase'
import { store, persistor } from '~/store/store'
import { NavigationContainerComponent } from 'react-navigation'
import { I18nextProvider } from 'react-i18next'
import {
  YellowBox,
  AppState,
  Keyboard,
  Platform,
  BackHandler,
  StatusBar,
  NativeEventSubscription,
  AppStateStatus,
} from 'react-native'

import SnackbarContainerView from '~/components/snackbars/SnackbarContainerView'
import CustomerFeedbackController from '~/screens/CustomerFeedbackScreen/CustomerFeedbackController'

import i18n from './i18n'
import { loadInfo } from './const'
import { notificationTopics } from '~/const/notificationTopics'
import RootNavigator from '~/navigation/RootNavigator'
import NavigationService from '~/services/navigation'
import NotificationService from './services/notifications'
import { useFeedbackModal } from '~/facades/feedbackModalServiceFacade'
import { resolveURLDeepLink, resolvePushDeepLink } from '~/helpers/navigationPathResolver'
import { useRemoteConfigSetup } from './facades/remoteConfigServiceFacade'

interface SnackbarData {
  type?: string
  payload?: any
}
export let StaticSnackbarCallback: (type: string, payload?: any, duration?: number) => void

const App = () => {
  const [loaded, setLoadedState] = useState(false)
  const [isModalShown, setModalShown] = useState(false)
  const [snackbarData, setSnackbarData] = useState<SnackbarData>({
    type: undefined,
    payload: undefined,
  })
  const navigator = useRef<NavigationContainerComponent | null>(null)
  const currentAppState = useRef('')
  const backHandler = useRef<NativeEventSubscription | null>(null)
  const unsubscribe = useRef<(() => void) | null>(null)
  const removeOnNotificationListener = useRef<(() => any) | null>(null)
  const removeOnNotificationOpenedListener = useRef<(() => any) | null>(null)
  const { lastResult, showModal, setModalVisible, setModalResult } = useFeedbackModal()

  const closeFeedbackModal = () => {
    setModalVisible(false)
    setModalResult(null)
  }

  StaticSnackbarCallback = (type, payload) => {
    setSnackbarData({ type, payload })
    setModalShown(true)
  }

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'background' && Platform.OS === 'android') {
      Keyboard.dismiss()
    }

    currentAppState.current = nextAppState
  }

  const { setupRemoteConfig } = useRemoteConfigSetup()

  useEffect(() => {
    // @ts-ignore
    i18n.setState = () => {
      setLoadedState(true)
    }

    setupRemoteConfig()
    // Setup notifications
    const channel = new firebase.notifications.Android.Channel(
      'insider',
      'insider channel',
      firebase.notifications.Android.Importance.Max,
    )
    firebase.notifications().android.createChannel(channel)

    removeOnNotificationListener.current = NotificationService.createOnNotificationListener()
    removeOnNotificationOpenedListener.current = NotificationService.createOnNotificationOpenedListener()

    // Only for testing on Firebase Console
    NotificationService.subscribeTo([notificationTopics.firebaseConsole.test])

    //Handle initial notification
    firebase
      .notifications()
      .getInitialNotification()
      .then((notificationOpen) => {
        if (notificationOpen) {
          const resolvedPushData = resolvePushDeepLink(notificationOpen.notification.data)
          if (resolvedPushData) {
            const [resolvedAppRoute, params] = resolvedPushData
            const navigationAction = NavigationService.createNavigationAction(
              resolvedAppRoute,
              params,
            )
            NavigationService.deferNavigationAction(navigationAction)
          }
        }
      })

    //Setup deep link handlers
    firebase
      .links()
      .getInitialLink()
      .then((deepLinkUrl) => {
        if (!deepLinkUrl) {
          return
        }
        const [resolvedAppRoute, params] = resolveURLDeepLink(deepLinkUrl)
        const navigationAction = NavigationService.createNavigationAction(resolvedAppRoute, params)
        NavigationService.deferNavigationAction(navigationAction)
      })

    unsubscribe.current = firebase.links().onLink((deepLinkUrl) => {
      if (!deepLinkUrl) {
        return
      }
      const [resolvedAppRoute, params] = resolveURLDeepLink(deepLinkUrl)
      const currentRoutePath = NavigationService.getCurrentActiveRouteName()
      const navigationAction = NavigationService.createNavigationAction(resolvedAppRoute, params)
      switch (currentRoutePath) {
        case 'LoginScreen':
        case 'LoaderScreen':
          NavigationService.deferNavigationAction(navigationAction)
          break
        default:
          NavigationService.performNavigationAction(navigationAction)
          break
      }
    })

    if (Platform.OS === 'android') {
      backHandler.current = BackHandler.addEventListener('hardwareBackPress', () => true)
    }
    loadInfo()
    AppState.addEventListener('change', handleAppStateChange)
    return () => {
      if (removeOnNotificationListener.current) {
        removeOnNotificationListener.current()
      }
      if (removeOnNotificationOpenedListener.current) {
        removeOnNotificationOpenedListener.current()
      }
      if (unsubscribe.current) {
        unsubscribe.current()
      }
      AppState.removeEventListener('change', handleAppStateChange)
      if (backHandler.current) {
        backHandler.current.remove()
      }
    }
  }, [])

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <I18nextProvider i18n={i18n}>
            <StatusBar backgroundColor='transparent' barStyle='dark-content' />
            {loaded && (
              <>
                <RootNavigator
                  ref={(nav) => {
                    NavigationService.setTopLevelNavigator(nav)
                    navigator.current = nav
                  }}
                />
                <SnackbarContainerView
                  {...snackbarData}
                  isModalVisible={isModalShown}
                  onClose={() => {
                    setModalShown(false)
                  }}
                />
                <CustomerFeedbackController
                  parsedResult={lastResult}
                  isModalVisible={showModal}
                  closeFeedbackModal={closeFeedbackModal}
                />
              </>
            )}
          </I18nextProvider>
        </PaperProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
