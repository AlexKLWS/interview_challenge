import { useRef, useEffect, useState } from 'react'
import { Subscription } from 'rxjs'

import { useInjection } from '~/services/serviceProvider'
import { ICoachWorkoutsService, CoachWorkoutsServiceId } from '~/services/coachWorkoutsService'
import { onEmit } from './helpersFacade'
import { WorkoutDetails } from '~/types/feedbackWorkoutDetails'

export function useWorkoutsProvider() {
  const service = useRef(useInjection<ICoachWorkoutsService>(CoachWorkoutsServiceId)).current
  const [workouts, setCoachWorkouts] = useState<Array<WorkoutDetails | { daySelector: true }>>([])

  const fetchWorkoutsForDate = (date: string, coachId: string, token: string) => {
    service.fetchWorkoutsForDate(date, coachId, token)
  }

  useEffect(() => {
    const subscriptions: Subscription[] = [
      onEmit<Array<WorkoutDetails | { daySelector: true }>>(
        service.workouts,
        (value: Array<WorkoutDetails | { daySelector: true }>) => setCoachWorkouts(value),
      ),
    ]
    return () => {
      subscriptions.forEach((it) => it.unsubscribe())
    }
  }, [])

  return { fetchWorkoutsForDate, workouts }
}
