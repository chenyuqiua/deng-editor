import type { AllAsset } from '../schema/asset'
import type { DraftDataType } from '../schema/draft'
import type { AllElement } from '../schema/element'
import type { Track } from '../schema/track'
import type { AllElementTypeAttribute } from '../schema/util'

/**
 * @description 浅层遍历轨道元素
 * @param draft 草稿数据用于获取track上的element
 * @param tracks 想要遍历的目标轨道
 * @param callback 回调函数，如果返回true，则中断遍历
 */
export const shallowWalkTracksElement = (
  draft: DraftDataType,
  tracks: Track[],
  callback: (element: AllElement, track: Track) => boolean | void
) => {
  const { timeline } = draft
  Outer: for (const track of tracks) {
    const { clips } = track
    for (const clip of clips) {
      const element = timeline.elements[clip.elementId]
      if (!element) continue
      const result = callback(element, track)
      if (result) break Outer
    }
  }
}

/**
 * @description 检查element的类型是否匹配
 * @param element 要检查的element
 * @param type 要匹配的类型
 * @returns 是否匹配
 */
export const checkElementType = <T extends AllElementTypeAttribute>(
  element: { type: AllElementTypeAttribute | string } | undefined,
  type: T
): element is AllElement & { type: T } => {
  if (!element) return false
  return element.type === type
}

/**
 * @description 根据element获取对应的asset
 * @param draft 草稿数据用于获取asset
 * @param element 要获取asset的目标element
 * @returns 获取到的asset，如果element没有assetId或者没有找到对应的asset，则返回undefined
 */
export const getAssetByElement = (
  draft: DraftDataType,
  element: AllElement
): AllAsset | undefined => {
  const assetId = element.assetId
  if (!assetId) return undefined
  return draft.timeline.assets[assetId]
}

export const getTrimProps = (element: AllElement, fps: number) => {
  const target = { startFrom: undefined, endAt: undefined, ...element }
  const res: Partial<{ startFrom: number; endAt: number }> = {}

  if (target.startFrom !== undefined) {
    res.startFrom = Math.floor(target.startFrom * fps)
  }

  if (target.endAt !== undefined) {
    res.endAt = Math.ceil(target.endAt * fps) + 1 // need add 1 frame for end, else will be white screen on end
  }

  return res
}

/**
 * @description 计算草稿元素的时长，单位为秒
 * @param draft 草稿数据
 * @returns 草稿元素的时长，单位为秒
 */
export const calcDraftDurationInSeconds = (draft: DraftDataType) => {
  let duration = 0
  shallowWalkTracksElement(draft, draft.timeline.tracks, element => {
    duration = Math.max(duration, element.start + element.length)
  })
  return duration
}

/**
 * @description 计算草稿元素的时长，单位为帧
 * @param draft 草稿数据
 * @returns 草稿元素的时长，单位为帧
 */
export const calcDraftDurationInFrames = (draft: DraftDataType) => {
  const durationSeconds = calcDraftDurationInSeconds(draft)
  const { fps } = draft.meta
  return Math.ceil(durationSeconds * fps)
}
