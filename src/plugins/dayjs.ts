import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import 'dayjs/locale/en'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import weekday from 'dayjs/plugin/weekday'

// Configure dayjs plugins
dayjs.locale('ko')
dayjs.extend(localizedFormat)
dayjs.extend(isBetween)
dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(weekday)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Seoul')

export default dayjs
