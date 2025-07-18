import { format } from '@formkit/tempo'

/** enum */
export type DateStyle = 'full' | 'long' | 'medium' | 'short'

/**
 * 日付をフォーマットするutils
 * URL：https://tempo.formkit.com/
 */
const formatDate = 'YYYY/MM/DD'
const locale = 'Asia/Tokyo'

/**
 * @returns yyyy年mm月dd日（曜日）
 */
export const toJpString = (date: Date, style: DateStyle): string => {
  return format(date, style)
}

/**
 * @returns YYYY/MM/DD
 */
export const toStringWithTz = (date: Date): string => {
  return format({
    date,
    format: formatDate,
    tz: locale
  })
}
