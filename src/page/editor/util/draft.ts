import type { DraftDataType } from '@/lib/remotion/editor-render/schema/draft'
import type {
  AllAssetTypeAttribute,
  AllElementTypeAttribute,
  AssetOfType,
  ElementOfType,
} from '@/lib/remotion/editor-render/schema/util'
import { ElementNotFoundError } from '../error/element-not-found-error'
import type { Track } from '@/lib/remotion/editor-render/schema/track'
import { shallowWalkTracksElement } from '@/lib/remotion/editor-render/util/draft'
import { AssetNotFoundError } from '../error/asset-not-found-error'

/**
 * @description 根据id获取元素, 如果type不为空, 则需要匹配type
 * @param draft 草稿
 * @param id 元素id
 * @param type 元素类型
 * @returns 返回元素, 如果找不到, 则抛出ElementNotFoundError
 */
export const getElementById = <T extends AllElementTypeAttribute>(
  draft: DraftDataType,
  id: string,
  type?: T
) => {
  const element = draft.timeline.elements[id]
  if (!element) throw new ElementNotFoundError({ id, type })

  if (type && element.type !== type) throw new ElementNotFoundError({ id, type })
  return element as ElementOfType<T>
}

/**
 * @description 根据元素id获取元素所在的轨道
 * @param draft 草稿数据
 * @param elementId 元素id
 * @returns 返回轨道, 如果找不到, 则返回undefined
 */
export function getTrackByElementId(draft: DraftDataType, elementId: string) {
  const element = getElementById(draft, elementId)
  let track = undefined as Track | undefined
  shallowWalkTracksElement(draft, draft.timeline.tracks, (el, _track) => {
    if (el === element) {
      track = _track
      return true
    }
  })
  return track
}

/**
 * @description 根据id获取资产, 如果type不为空, 则需要匹配type
 * @param draft 草稿数据
 * @param id 资产id
 * @param type 资产类型
 * @returns 返回资产, 如果找不到, 则抛出AssetNotFoundError
 */
export function getAssetById<T extends AllAssetTypeAttribute>(
  draft: DraftDataType,
  id: string,
  type?: T
) {
  const asset = draft.timeline.assets[id]
  if (!asset) throw new AssetNotFoundError({ id, type })

  if (type && asset.type !== type) throw new AssetNotFoundError({ id, type })

  return asset as AssetOfType<T>
}
