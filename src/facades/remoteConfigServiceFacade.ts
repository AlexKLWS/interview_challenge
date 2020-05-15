import { useRef } from 'react'

import remoteConfigKeys from '~/const/remoteConfigKeys'
import { useInjection } from '~/services/serviceProvider'
import { IRemoteConfigService, RemoteConfigServiceId } from '~/services/remoteConfigService'

export const initializeRemoteConfigWithDefaults = (
  remoteConfigService: IRemoteConfigService,
  defaults?: {
    [key: string]: string | number | boolean
  },
) => {
  remoteConfigService.init(defaults)
}

export const useRemoteConfig = () => {
  const remoteConfigService = useRef(useInjection<IRemoteConfigService>(RemoteConfigServiceId))
    .current

  const getString = (key: string) => remoteConfigService.getString(key)
  const getNumber = (key: string) => remoteConfigService.getNumber(key)
  const getBool = (key: string) => remoteConfigService.getBool(key)

  return { getString, getNumber, getBool }
}

export const useRemoteConfigSetup = () => {
  const remoteConfigService = useRef(useInjection<IRemoteConfigService>(RemoteConfigServiceId))
    .current

  const remoteConfigDefaults: { [key: string]: string | number | boolean } = {}
  remoteConfigDefaults[remoteConfigKeys.CURRENT_ACTIVE_CHALLENGE] = ''

  const setupRemoteConfig = () => {
    initializeRemoteConfigWithDefaults(remoteConfigService, remoteConfigDefaults)
  }

  return { setupRemoteConfig }
}
