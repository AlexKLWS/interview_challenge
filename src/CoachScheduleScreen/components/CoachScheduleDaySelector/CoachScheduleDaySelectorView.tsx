import React, { useMemo, Ref } from 'react'
import { Text, FlatList, StyleSheet, View } from 'react-native'
import moment, { Moment } from 'moment'

import CoachScheduleDayItem from './CoachScheduleDayItem'
import { scale } from '~/helpers/scaling'
import { useTranslation } from 'react-i18next'
import { prettifyDate } from '~/helpers/prettifyDate'
import { COLORS } from '~/styles'

const ITEM_SIZE = 48
const SCREEN_PADDING = 23

interface Props {
  selectedDate: string
  setSelectedDate: (date: string) => void
  daySelectorScrollToOffset: (index: number) => void
  daySelectorRef: Ref<FlatList<any>>
}

const CoachScheduleDaySelector: React.FC<Props> = (props: Props) => {
  const { t } = useTranslation()

  const dateArray = useMemo(() => {
    const result = []
    let currentDate: Moment & { isSelected?: boolean; isToday?: boolean } = moment(
      props.selectedDate,
    ).startOf('month')
    const endDate = moment(props.selectedDate).endOf('month')
    while (currentDate <= endDate) {
      currentDate.isSelected = currentDate.format('YYYY-MM-DD') === props.selectedDate
      currentDate.isToday = currentDate.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')
      result.push(currentDate)
      currentDate = moment(currentDate).add(1, 'days')
    }
    return result
  }, [props.selectedDate])

  const onPress = (date: Moment, index: number) => {
    props.setSelectedDate(date.format('YYYY-MM-DD'))
    props.daySelectorScrollToOffset(index)
  }

  return (
    <View>
      <FlatList
        ref={props.daySelectorRef}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={dateArray}
        removeClippedSubviews={false}
        initialScrollIndex={Math.max(0, new Date().getDate() - 4)}
        getItemLayout={(data, index) => ({
          length: scale(ITEM_SIZE),
          offset: scale(ITEM_SIZE) * index,
          index,
        })}
        keyExtractor={(_, index) => `${index}`}
        renderItem={(info) => (
          <CoachScheduleDayItem date={info.item} onPress={() => onPress(info.item, info.index)} />
        )}
      />
      <Text style={styles.dateTitle}>{prettifyDate(props.selectedDate, t)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  contentContainer: {
    paddingHorizontal: scale(SCREEN_PADDING),
  },
  dateTitle: {
    paddingTop: scale(32),
    paddingLeft: scale(25),
    fontFamily: 'Inter-SemiBold',
    fontSize: scale(15),
    color: COLORS.greyscale.almostBlack,
  },
})

export default CoachScheduleDaySelector
