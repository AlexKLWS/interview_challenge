import React, { useRef, useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Animated,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native'
import { CalendarList } from 'react-native-calendars'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import moment from 'moment'

import { COLORS } from '~/styles'
import { scale } from '~/helpers/scaling'
import ChevronIcon from '~/assets/icons/chevron'

export const HEADER_HEIGHT = getStatusBarHeight() + scale(56)
const CALENDAR_HEIGHT = HEADER_HEIGHT + scale(330)
const CALENDAR_OFFSET = HEADER_HEIGHT - CALENDAR_HEIGHT
const CALENDAR_THEME = {
  'stylesheet.day.basic': {
    base: {
      width: scale(44),
      height: scale(44),
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      marginTop: 0,
      fontSize: scale(14),
      fontFamily: 'Inter-SemiBold',
      color: COLORS.greyscale.almostBlack,
    },
    today: {
      backgroundColor: COLORS.brand.secondaryLight,
      borderRadius: scale(8),
    },
    todayText: {
      color: COLORS.greyscale.white,
    },
    selected: {
      backgroundColor: COLORS.brand.secondary,
      borderRadius: scale(8),
    },
    selectedText: {
      color: COLORS.greyscale.white,
    },
  },
  'stylesheet.calendar.main': {
    week: {
      marginTop: scale(1),
      marginBottom: scale(1),
      flexDirection: 'row',
    },
  },
  'stylesheet.calendar.header': {
    header: {
      ...(Platform.OS === 'android' && { height: 0 }),
    },
  },
  'stylesheet.calendar-list.main': {
    calendar: {
      paddingLeft: scale(24),
      paddingRight: scale(24),
    },
  },
}

interface Props {
  selectedDate: string
  setSelectedDate: (date: string) => void
  daySelectorScrollToOffset: (index: number) => void
}

const CoachScheduleHeader: React.FC<Props> = (props: Props) => {
  const [selectedMonth, setSelectedMonth] = useState(getFormattedMonth(props.selectedDate))
  const originalMonth = useRef(getFormattedMonth(props.selectedDate))
  const [isCalendarMounted, setIsCalendarMounted] = useState(false)
  const calendarPositionRef = useRef(new Animated.Value(CALENDAR_OFFSET))
  const chevronRotationRef = useRef(new Animated.Value(0))
  const isCalendarOpen = useRef(false)
  const showOverlay = useRef(false)

  const onPress = () => {
    showOverlay.current = !showOverlay.current
    Animated.timing(calendarPositionRef.current, {
      toValue: isCalendarOpen.current ? CALENDAR_OFFSET : 0,
      duration: 300,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !isCalendarOpen.current) {
        setIsCalendarMounted(false)
      }
    })
    Animated.timing(chevronRotationRef.current, {
      toValue: isCalendarOpen.current ? 0 : 1,
      duration: 250,
    }).start()
    isCalendarOpen.current = !isCalendarOpen.current
    if (isCalendarOpen.current) {
      originalMonth.current = selectedMonth
      setIsCalendarMounted(true)
    }
  }

  const animatedCurtainStyle = {
    transform: [{ translateY: calendarPositionRef.current }],
  }

  const animatedCalendarContainerStyle = {
    opacity: calendarPositionRef.current.interpolate({
      inputRange: [CALENDAR_OFFSET, CALENDAR_OFFSET * 0.25, 0],
      outputRange: [0, 0, 1],
    }),
  }

  const chevronAnimatedStyle = {
    transform: [
      {
        rotateZ: chevronRotationRef.current.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '-180deg'],
        }),
      },
    ],
  }

  const overlayAnimatedStyle = {
    opacity: calendarPositionRef.current.interpolate({
      inputRange: [CALENDAR_OFFSET, 0],
      outputRange: [0, 1],
    }),
  }

  function getFormattedMonth(date: string) {
    return moment(date)
      .format('MMMM YYYY')
      .toLocaleUpperCase()
  }

  const onDayPress = (dateObject: any) => {
    const dateString = dateObject.dateString
    const formattedMonth = getFormattedMonth(dateString)
    props.setSelectedDate(dateString)
    props.daySelectorScrollToOffset(dateObject.day - 1)
    originalMonth.current = formattedMonth
    setSelectedMonth(formattedMonth)
    setTimeout(onPress, 250)
  }

  useEffect(() => {
    if (!isCalendarOpen.current) {
      if (originalMonth.current !== selectedMonth) {
        setSelectedMonth(originalMonth.current)
      }
    }
  }, [isCalendarOpen.current])

  return (
    <>
      <Animated.View style={[animatedCurtainStyle, styles.headerCalendarContainer, styles.shadow]}>
        <Animated.View style={animatedCalendarContainerStyle}>
          {isCalendarMounted && (
            // @ts-ignore
            <CalendarList
              firstDay={1}
              onVisibleMonthsChange={(months) => {
                if (months.length === 1) {
                  setSelectedMonth(getFormattedMonth(months[0].dateString))
                }
              }}
              onDayPress={onDayPress}
              markedDates={{ [props.selectedDate]: { selected: true } }}
              hideArrows={true}
              horizontal={true}
              pagingEnabled={true}
              monthFormat=''
              current={props.selectedDate}
              theme={CALENDAR_THEME}
              style={styles.shadow}
            />
          )}
        </Animated.View>
      </Animated.View>
      <View style={[styles.headerContainer, !isCalendarOpen.current && styles.shadow]}>
        <TouchableOpacity onPress={onPress} style={styles.interactiveContainer}>
          <Text style={styles.headerTitle}>{selectedMonth}</Text>
          <Animated.View style={[chevronAnimatedStyle, styles.chevronIconContainer]}>
            <ChevronIcon width={14} height={8} />
          </Animated.View>
        </TouchableOpacity>
      </View>
      {showOverlay.current && (
        <TouchableWithoutFeedback onPress={onPress}>
          <Animated.View style={[styles.overlay, overlayAnimatedStyle]} />
        </TouchableWithoutFeedback>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    overflow: 'visible',
    top: 0,
    backgroundColor: COLORS.greyscale.white,
    paddingTop: getStatusBarHeight() + scale(16),
    paddingBottom: scale(17),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: scale(HEADER_HEIGHT),
    zIndex: 2,
    elevation: 8,
  },
  overlay: {
    backgroundColor: COLORS.greyscale.overlay,
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  headerTitle: {
    fontFamily: 'Barlow-Bold',
    fontSize: scale(18),
    lineHeight: scale(22),
    paddingRight: scale(13),
    color: COLORS.greyscale.almostBlack,
  },
  headerCalendarContainer: {
    overflow: 'visible',
    position: 'absolute',
    width: '100%',
    height: CALENDAR_HEIGHT,
    flexDirection: 'column-reverse',
    zIndex: 2,
    backgroundColor: COLORS.greyscale.white,
  },
  shadow: {
    elevation: 8,
    shadowColor: COLORS.greyscale.almostBlack,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 10 },
  },
  interactiveContainer: {
    flexDirection: 'row',
  },
  chevronIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default CoachScheduleHeader
