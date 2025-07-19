import type { DraftDataType } from '@/lib/remotion/editor-render/schema/draft'
import { ElementNotFoundError } from '../error/element-not-found-error'
import type {
  AllElementTypeAttribute,
  ElementOfType,
} from '@/lib/remotion/editor-render/schema/util'

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
