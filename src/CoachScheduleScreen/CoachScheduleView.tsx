import React, { Ref } from 'react'
import { View, StyleSheet, FlatList, Text } from 'react-native'
import { useTranslation } from 'react-i18next'

import { COLORS } from '~/styles'
import CoachScheduleHeader, { HEADER_HEIGHT } from './components/CoachScheduleHeader'
import CoachScheduleDaySelector from './components/CoachScheduleDaySelector/CoachScheduleDaySelectorView'
import WorkoutItem from './components/WorkoutItem'
import { WorkoutDetails } from '~/types/feedbackWorkoutDetails'
import { scale } from '~/helpers/scaling'
import images from '~/assets/images'
import FastImage from 'react-native-fast-image'
import { NavigationScreenProp, NavigationRoute, NavigationParams } from 'react-navigation'

export interface Props {
  selectedDate: string
  workouts: Array<WorkoutDetails | { daySelector: true }>
  setSelectedDate: (date: string) => void
  daySelectorScrollToOffset: (index: number) => void
  daySelectorRef: Ref<FlatList<any>>
  navigation: NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>
}

const CoachScheduleView: React.FC<Props> = (props: Props) => {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <CoachScheduleHeader
        selectedDate={props.selectedDate}
        setSelectedDate={props.setSelectedDate}
        daySelectorScrollToOffset={props.daySelectorScrollToOffset}
      />
      <FlatList
        data={props.workouts}
        contentContainerStyle={styles.listContentContainer}
        keyExtractor={(_, index) => `${index}`}
        renderItem={({ item }) => {
          if ((item as { daySelector: true }).daySelector) {
            return (
              <CoachScheduleDaySelector
                selectedDate={props.selectedDate}
                setSelectedDate={props.setSelectedDate}
                daySelectorScrollToOffset={props.daySelectorScrollToOffset}
                daySelectorRef={props.daySelectorRef}
              />
            )
          } else {
            return (
              <WorkoutItem
                workout={item as WorkoutDetails}
                onPressItem={() => {
                  props.navigation.navigate('CoachWorkoutDetails', { event: item })
                }}
              />
            )
          }
        }}
      />
      {props.workouts.length <= 1 && (
        <View style={styles.emptyStateContainer}>
          <FastImage source={images.cat} style={styles.emptyStateImage} />
          <Text style={styles.emptyStateTitle}>{t('emptyState_coachSchedule_title')}</Text>
          <Text style={styles.emptyStateDescription}>
            {t('emptyState_coachSchedule_description')}
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.greyscale.light,
    flex: 1,
  },
  listContentContainer: {
    paddingTop: scale(HEADER_HEIGHT + 16),
    paddingBottom: scale(24),
  },
  emptyStateContainer: {
    position: 'absolute',
    top: '50%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateImage: {
    width: scale(48),
    height: scale(48),
  },
  emptyStateTitle: {
    color: COLORS.greyscale.almostBlack,
    fontFamily: 'Inter-SemiBold',
    fontSize: scale(15),
    textAlign: 'center',
    marginVertical: scale(16),
  },
  emptyStateDescription: {
    color: COLORS.greyscale.almostBlack,
    fontFamily: 'Inter-Regular',
    fontSize: scale(13),
    textAlign: 'center',
    lineHeight: scale(21),
  },
})

export default CoachScheduleView
