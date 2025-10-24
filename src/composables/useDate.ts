import dayjs, { type Dayjs, type ConfigType } from 'dayjs'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import '@/plugins/dayjs'

export const useDate = () => {
  // Sync dayjs locale with vue-i18n locale
  const { locale } = useI18n()

  // Update dayjs locale when vue-i18n locale changes
  watch(locale, (newLocale) => {
    dayjs.locale(newLocale)
  }, { immediate: true })
  /**
   * Create a dayjs instance
   */
  const create = (date?: ConfigType): Dayjs => {
    return dayjs(date)
  }

  /**
   * Get current date/time
   */
  const now = (): Dayjs => {
    return dayjs()
  }

  /**
   * Format date
   */
  const format = (date: ConfigType, formatStr: string = 'YYYY-MM-DD'): string => {
    return dayjs(date).format(formatStr)
  }

  /**
   * Format date with localized format
   */
  const formatLocalized = (date: ConfigType, formatStr: string = 'LL'): string => {
    return dayjs(date).format(formatStr)
  }

  /**
   * Check if date is between two dates
   */
  const isBetween = (
    date: ConfigType,
    start: ConfigType,
    end: ConfigType,
    unit?: dayjs.OpUnitType,
    inclusion?: '()' | '[)' | '(]' | '[]'
  ): boolean => {
    return dayjs(date).isBetween(start, end, unit, inclusion)
  }

  /**
   * Check if date is before another date
   */
  const isBefore = (date: ConfigType, compareDate: ConfigType, unit?: dayjs.OpUnitType): boolean => {
    return dayjs(date).isBefore(compareDate, unit)
  }

  /**
   * Check if date is after another date
   */
  const isAfter = (date: ConfigType, compareDate: ConfigType, unit?: dayjs.OpUnitType): boolean => {
    return dayjs(date).isAfter(compareDate, unit)
  }

  /**
   * Check if date is same as another date
   */
  const isSame = (date: ConfigType, compareDate: ConfigType, unit?: dayjs.OpUnitType): boolean => {
    return dayjs(date).isSame(compareDate, unit)
  }

  /**
   * Add time to date
   */
  const add = (date: ConfigType, value: number, unit: dayjs.ManipulateType): Dayjs => {
    return dayjs(date).add(value, unit)
  }

  /**
   * Subtract time from date
   */
  const subtract = (date: ConfigType, value: number, unit: dayjs.ManipulateType): Dayjs => {
    return dayjs(date).subtract(value, unit)
  }

  /**
   * Get start of unit
   */
  const startOf = (date: ConfigType, unit: dayjs.OpUnitType): Dayjs => {
    return dayjs(date).startOf(unit)
  }

  /**
   * Get end of unit
   */
  const endOf = (date: ConfigType, unit: dayjs.OpUnitType): Dayjs => {
    return dayjs(date).endOf(unit)
  }

  /**
   * Get difference between two dates
   */
  const diff = (
    date: ConfigType,
    compareDate: ConfigType,
    unit?: dayjs.QUnitType | dayjs.OpUnitType,
    precise?: boolean
  ): number => {
    return dayjs(date).diff(compareDate, unit, precise)
  }

  /**
   * Convert to timezone
   */
  const toTimezone = (date: ConfigType, timezone: string): Dayjs => {
    return dayjs(date).tz(timezone)
  }

  /**
   * Get date in Asia/Seoul timezone
   */
  const toSeoul = (date: ConfigType): Dayjs => {
    return dayjs(date).tz('Asia/Seoul')
  }

  /**
   * Convert to UTC
   */
  const toUTC = (date: ConfigType): Dayjs => {
    return dayjs(date).utc()
  }

  /**
   * Parse ISO string
   */
  const parseISO = (isoString: string): Dayjs => {
    return dayjs(isoString)
  }

  /**
   * Convert to ISO string
   */
  const toISO = (date: ConfigType): string => {
    return dayjs(date).toISOString()
  }

  /**
   * Get weekday (0-6, Sunday-Saturday)
   */
  const weekday = (date: ConfigType): number => {
    return dayjs(date).weekday()
  }

  /**
   * Create duration
   */
  const duration = (time: number, unit?: 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year') => {
    return dayjs.duration(time, unit)
  }

  /**
   * Format relative time (e.g., "2 hours ago")
   */
  const fromNow = (date: ConfigType): string => {
    return dayjs(date).fromNow()
  }

  /**
   * Format relative time to now
   */
  const toNow = (date: ConfigType): string => {
    return dayjs(date).toNow()
  }

  /**
   * Check if date is valid
   */
  const isValid = (date: ConfigType): boolean => {
    return dayjs(date).isValid()
  }

  /**
   * Get Date object
   */
  const toDate = (date: ConfigType): Date => {
    return dayjs(date).toDate()
  }

  return {
    create,
    now,
    format,
    formatLocalized,
    isBetween,
    isBefore,
    isAfter,
    isSame,
    add,
    subtract,
    startOf,
    endOf,
    diff,
    toTimezone,
    toSeoul,
    toUTC,
    parseISO,
    toISO,
    weekday,
    duration,
    fromNow,
    toNow,
    isValid,
    toDate,
    dayjs, // Export dayjs instance for advanced usage
  }
}
