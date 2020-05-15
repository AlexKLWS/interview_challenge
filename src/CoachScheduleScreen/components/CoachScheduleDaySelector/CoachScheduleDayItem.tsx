import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Moment } from 'moment'
import { scale } from '~/helpers/scaling'
import { COLORS } from '~/styles'

interface Props {
  date: Moment & { isSelected?: boolean; isToday?: boolean }
  onPress: (date: string) => void
}

const DayItem: React.FC<Props> = (props: Props) => {
  const containerStyle = () => {
    if (props.date.isSelected) {
      return styles.selectedContainer
    } else if (props.date.isToday) {
      return styles.todayContainer
    }
    return null
  }

  return (
    <TouchableOpacity
      onPress={() => {
        props.onPress(props.date.format('YYYY-MM-DD'))
      }}
      style={[styles.container, containerStyle()]}
    >
      <Text
        style={[
          styles.weekDay,
          (props.date.isSelected || props.date.isToday) && styles.weekDaySelected,
        ]}
      >
        {props.date.format('ddd')}
      </Text>
      <Text
        style={[
          styles.dateText,
          (props.date.isSelected || props.date.isToday) && styles.dateTextSelected,
        ]}
      >
        {props.date.date()}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.greyscale.white,
    width: scale(44),
    height: scale(44),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(8),
    marginHorizontal: scale(2),
  },
  selectedContainer: {
    backgroundColor: COLORS.brand.secondary,
  },
  todayContainer: {
    backgroundColor: COLORS.brand.secondaryLight,
  },
  dateText: {
    color: COLORS.greyscale.almostBlack,
    fontFamily: 'Inter-SemiBold',
    fontSize: scale(15),
  },
  dateTextSelected: {
    fontFamily: 'Inter-SemiBold',
    fontSize: scale(15),
    color: COLORS.greyscale.white,
  },
  weekDay: {
    fontFamily: 'Inter-Regular',
    fontSize: scale(11),
    lineHeight: scale(14),
    paddingBottom: scale(2),
    color: COLORS.greyscale.dark,
  },
  weekDaySelected: {
    fontFamily: 'Inter-Regular',
    fontSize: scale(11),
    lineHeight: scale(14),
    paddingBottom: scale(2),
    color: COLORS.greyscale.white,
  },
})

export default DayItem
