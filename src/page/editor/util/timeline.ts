import type { TimeRange } from '../type/timeline'

/**
 * 判断两个时间范围是否重叠
 * @param a 时间范围a
 * @param b 时间范围b
 * @returns 如果两个时间范围重叠, 则返回true, 否则返回false
 */
export const isOverlap = (a: TimeRange, b: TimeRange) => {
  return Math.max(a.start, b.start) < Math.min(a.end, b.end)
}
