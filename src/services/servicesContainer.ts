import 'reflect-metadata'
import { Container, interfaces, ContainerModule } from 'inversify'
import { IResultService, ResultService, ResultServiceId } from './resultService'
import {
  IFeedbackModalService,
  FeedbackModalService,
  FeedbackModalServiceId,
} from './feedbackModalService'
import {
  ICoachWorkoutsService,
  CoachWorkoutsServiceId,
  CoachWorkoutsService,
} from './coachWorkoutsService'
import {
  IRemoteConfigService,
  RemoteConfigServiceId,
  RemoteConfigService,
} from './remoteConfigService'

export const containerModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<IResultService>(ResultServiceId).to(ResultService)
  bind<ICoachWorkoutsService>(CoachWorkoutsServiceId).to(CoachWorkoutsService)
  bind<IFeedbackModalService>(FeedbackModalServiceId)
    .to(FeedbackModalService)
    .inSingletonScope()
  bind<IRemoteConfigService>(RemoteConfigServiceId)
    .to(RemoteConfigService)
    .inSingletonScope()
})

export const container = new Container()
