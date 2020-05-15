import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { get } from 'lodash'

import ElevatedInteractableContainer from '~/components/cards/elevatedInteractibleContainer'
import { scale } from '~/helpers/scaling'
import { WorkoutDetails } from '~/types/feedbackWorkoutDetails'
import { Title } from '~/components/texts'
import { COLORS } from '~/styles'
import PeopleIcon from '~/assets/icons/people'
import TreeIcon from '~/assets/icons/tree'
import HouseIcon from '~/assets/icons/house'
import ExcerciseIcon from '~/assets/icons/excercise'
import { useTranslation } from 'react-i18next'

interface Props {
  workout: WorkoutDetails
  onPressItem: () => void
}

const WorkoutItem: React.FC<Props> = ({ workout, onPressItem }: Props) => {
  const { t } = useTranslation()
  const renderLabel = () => {
    if (workout.isCompleted) {
      return <Text style={styles.tag}>{t('global_completed').toLocaleUpperCase()}</Text>
    } else if (workout.isCancelled) {
      return <Text style={styles.tag}>{t('global_cancelled').toLocaleUpperCase()}</Text>
    }
    return null
  }

  const titleStyle = () => {
    return workout.isCancelled
      ? { ...styles.headerTitle, ...styles.cancelledFade }
      : styles.headerTitle
  }

  const iconColor = () => {
    if (workout.isCancelled) {
      return COLORS.greyscale.medium
    }
    return undefined
  }

  return (
    <ElevatedInteractableContainer style={styles.container} onPress={onPressItem}>
      <View style={styles.leftContainer}>
        <View style={styles.titleContainer}>
          <Title customStyle={titleStyle()} text={workout.formattedDate} />
          {renderLabel()}
        </View>
        <View style={[styles.rowInfoContainer, styles.rowSpacer]}>
          <View style={styles.leftIconView}>
            {workout.locationIsIndoors ? (
              <HouseIcon color={iconColor()} />
            ) : (
              <TreeIcon color={iconColor()} />
            )}
          </View>
          <Text
            numberOfLines={1}
            style={[
              styles.infoTextLeft,
              workout.isCancelled && workout.isCancelled && styles.cancelledFade,
            ]}
          >
            {workout.locationName}
          </Text>
        </View>
        <View style={styles.rowInfoContainer}>
          <View style={styles.leftIconView}>
            <ExcerciseIcon fillColor={iconColor()} />
          </View>
          <Text
            numberOfLines={1}
            style={[styles.infoTextLeft, workout.isCancelled && styles.cancelledFade]}
          >
            {workout.typeName}
          </Text>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <View style={styles.rowInfoContainer}>
          <View style={styles.rightIconView}>
            <PeopleIcon fillColor={iconColor()} />
          </View>
          <Text style={[styles.infoTextRight, workout.isCancelled && styles.cancelledFade]}>
            {workout.participantsCount}
          </Text>
        </View>
      </View>
    </ElevatedInteractableContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: scale(16),
    marginHorizontal: scale(24),
    padding: scale(16),
    flexDirection: 'row',
  },
  leftContainer: {
    borderRightColor: COLORS.greyscale.light,
    borderRightWidth: 1,
    flex: 1,
    maxWidth: scale(233),
  },
  rightContainer: {
    width: scale(83),
  },
  rowInfoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  rowSpacer: {
    marginBottom: scale(8),
  },
  infoTextLeft: {
    color: COLORS.greyscale.almostBlack,
    fontFamily: 'Inter-Regular',
    fontSize: scale(13),
    lineHeight: scale(16),
    paddingRight: scale(20),
  },
  infoTextRight: {
    color: COLORS.greyscale.almostBlack,
    fontFamily: 'Inter-Regular',
    fontSize: scale(13),
    lineHeight: scale(16),
  },
  leftIconView: {
    paddingRight: scale(5),
  },
  rightIconView: {
    paddingRight: scale(5),
    paddingLeft: scale(16),
    paddingBottom: scale(2),
  },
  headerTitle: {
    color: COLORS.greyscale.almostBlack,
    fontFamily: 'Barlow-Bold',
    fontSize: scale(18),
    lineHeight: scale(22),
  },
  titleContainer: {
    paddingBottom: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    fontFamily: 'Inter-Bold',
    fontSize: scale(11),
    textTransform: 'uppercase',
    lineHeight: scale(14),
    color: COLORS.greyscale.white,

    marginTop: scale(1),
    marginLeft: scale(8),
    backgroundColor: COLORS.brand.secondaryDark,
    borderRadius: scale(4),
    paddingHorizontal: scale(4),
    paddingVertical: scale(2),
  },
  cancelledFade: {
    color: COLORS.greyscale.medium,
  },
})

export default WorkoutItem
