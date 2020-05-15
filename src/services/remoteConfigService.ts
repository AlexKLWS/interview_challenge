import { injectable } from 'inversify'
import firebase from 'react-native-firebase'

export interface IRemoteConfigService {
  init: (defaults?: { [key: string]: string | number | boolean }) => Promise<boolean>
  getValue: (key: string) => Promise<any>
  getString: (key: string) => Promise<string | undefined>
  getNumber: (key: string) => Promise<number | undefined>
  getBool: (key: string) => Promise<boolean | undefined>
}

@injectable()
export class RemoteConfigService implements IRemoteConfigService {
  public async init(defaults: { [key: string]: string | number | boolean } = {}) {
    firebase.config().setDefaults(defaults)
    await firebase.config().fetch()
    return firebase.config().activateFetched()
  }

  public async getValue(key: string): Promise<any> {
    const remoteConfig = await firebase.config().getValue(key)
    return remoteConfig.val()
  }

  public async getString(key: string): Promise<string | undefined> {
    return this.getValue(key) as Promise<string | undefined>
  }

  public async getNumber(key: string): Promise<number | undefined> {
    return this.getValue(key) as Promise<number | undefined>
  }

  public async getBool(key: string): Promise<boolean | undefined> {
    return this.getValue(key) as Promise<boolean | undefined>
  }
}

export const RemoteConfigServiceId = Symbol('RemoteConfigService')
