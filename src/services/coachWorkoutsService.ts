import { injectable } from 'inversify'
import firebase from 'react-native-firebase'
import { BehaviorSubject } from 'rxjs'
import get from 'lodash/get'

import { coach as coachApi } from '~/api'
import { currentAppLanguage } from '~/helpers/language'
import errors from '~/const/errors'
import moment from 'moment'
import { WorkoutDetails } from '~/types/feedbackWorkoutDetails'

export interface ICoachWorkoutsService {
  workouts: BehaviorSubject<Array<WorkoutDetails | { daySelector: true }>>
  fetchWorkoutsForDate: (date: string, coachId: string, token: string) => Promise<void>
}

@injectable()
export class CoachWorkoutsService implements ICoachWorkoutsService {
  private readonly _workouts: BehaviorSubject<
    Array<WorkoutDetails | { daySelector: true }>
  > = new BehaviorSubject<Array<WorkoutDetails | { daySelector: true }>>([])

  get workouts(): BehaviorSubject<Array<WorkoutDetails | { daySelector: true }>> {
    return this._workouts
  }

  public async fetchWorkoutsForDate(date: string, coachId: string, token: string) {
    try {
      const params = {
        coach_id: coachId,
        date_begin_gte: moment(date)
          .startOf('day')
          .toDate(),
        date_begin_lte: moment(date)
          .endOf('day')
          .toDate(),
        $limit: 120,
      }

      const { data } = await coachApi.getCoachWorkouts({
        token,
        params,
      })

      const coachWorkouts: Array<WorkoutDetails | { daySelector: true }> = data.map(
        (workout: any) => {
          const workoutDate = moment(workout.date_begin)
          return {
            id: workout.id,
            typeName: workout.type.name,
            locationName: workout.location.name,
            locationIsIndoors: get(workout, 'location.feature_flags.indoors', false),
            participantsCount: workout.participants_count,
            isCancelled: workout.is_cancelled,
            isCompleted: get(workout, 'current_status.status_name', '') === 'completed',
            date: workoutDate,
            formattedDate: workoutDate
              .locale(currentAppLanguage)
              .format('HH:mm')
              .toLocaleUpperCase(),
          }
        },
      )
      coachWorkouts.unshift({ daySelector: true })
      this._workouts.next([])
    } catch (error) {
      firebase.crashlytics().recordCustomError(errors.COACH_WORKOUTS_FETCH_ERROR, error.message)
    }
  }
}

export const CoachWorkoutsServiceId = Symbol('CoachWorkoutsService')
