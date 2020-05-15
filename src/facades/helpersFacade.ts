import { Subscription, Observable } from 'rxjs'
import firebase from 'react-native-firebase'

import errors from '~/const/errors'

export function onEmit<T>(source: Observable<T>, nextFn: (value: T) => void): Subscription {
  return source.subscribe({
    next: nextFn,
    error: (err) => {
      firebase.crashlytics().recordCustomError(errors.EMIT_RX_ERROR, err.message)
    },
  })
}
