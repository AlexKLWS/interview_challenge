import React, { useState, useEffect, useRef } from 'react'
import { Dimensions } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import CoachScheduleView from './CoachScheduleView'
import moment from 'moment'
import { connect } from 'react-redux'
import { get } from 'lodash'

import { scale } from '~/helpers/scaling'
import { useWorkoutsProvider } from '~/facades/coachWorkoutsServiceFacade'
import { CoachUserData, UserData } from '~/types/user'

const ITEM_SIZE = scale(48)
const SCREEN_PADDING = scale(23)
const { width } = Dimensions.get('window')

export interface Props extends NavigationScreenProps {
  token: string
  coachData: CoachUserData
  currentUser: UserData
  initialDate?: string
}

export const CoachScheduleController: React.FC<Props> = (props: Props) => {
  const [selectedDate, setSelectedDate] = useState(
    props.initialDate || moment().format('YYYY-MM-DD'),
  )
  const daySelectorRef = useRef(null)

  const { fetchWorkoutsForDate, workouts } = useWorkoutsProvider()

  useEffect(() => {
    fetchWorkoutsForDate(selectedDate, props.coachData.id, props.token)
  }, [selectedDate])

  const daySelectorScrollToOffset = (index: number) => {
    if (!daySelectorRef.current) {
      return
    }
    const position = index * ITEM_SIZE - (width - SCREEN_PADDING * 2) / 2 + ITEM_SIZE / 2

    // @ts-ignore
    daySelectorRef.current.scrollToOffset({ offset: position })
  }

  return (
    <CoachScheduleView
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      workouts={workouts}
      daySelectorScrollToOffset={daySelectorScrollToOffset}
      daySelectorRef={daySelectorRef}
      navigation={props.navigation}
    />
  )
}

const mapStateToProps = (state: any) => ({
  coachData: get(state, 'currentUser.data.coach') || {},
  currentUser: state.currentUser.data || {},
  token: state.session.token,
})

export default connect(mapStateToProps)(CoachScheduleController)
