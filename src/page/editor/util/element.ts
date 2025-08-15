import type {
  AllElement,
  ImageElement,
  TextElement,
} from '@/lib/remotion/editor-render/schema/element'
import { generateUuid } from '@/common/util/uuid'
import { DefaultElementDuration, defaultTextElementStyle } from '../constant/element'
import type { ImageAsset } from '@/lib/remotion/editor-render/schema/asset'
import { createImageAssetByUrl } from '../util/asset'
import type { AllAsset } from '@/lib/remotion/editor-render/schema/asset'
import { assert } from '@/common/util/assert'
import type { InsertPayload } from '../type/element'

type ImageVideoElementOptions = Partial<Omit<ImageElement, 'assetId' | 'type'>>
type TextElementOptions = Partial<Omit<TextElement, 'assetId' | 'type'>>

/**
 * 根据图片资源创建图片元素
 * @param asset 图片资源
 * @param opts 图片元素其他配置项
 * @returns 图片元素
 */
export const createImageElementByAsset = async (
  asset: ImageAsset,
  opts: ImageVideoElementOptions
): Promise<ImageElement> => {
  return {
    id: generateUuid('image'),
    type: 'image',
    assetId: asset.id,
    width: asset.width,
    height: asset.height,
    opacity: 1,
    start: 0,
    length: DefaultElementDuration,
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
    ...opts,
  }
}

/**
 * 创建文本元素
 * @param text 文本内容
 * @param opts 文本元素其他配置项
 * @returns 文本元素
 */
export const createTextElement = (text: string, opts: TextElementOptions): TextElement => {
  const { style, ...rest } = opts
  return {
    id: generateUuid('text'),
    type: 'text',
    name: '',
    opacity: 1,
    start: 0,
    length: DefaultElementDuration,
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
    text,
    style: { ...defaultTextElementStyle, ...style },
    ...rest,
  }
}

// TODO: 这里是模拟创建一个元素 逻辑还需完善
export const createElement = async (
  payload: InsertPayload,
  start: number
): Promise<{ asset: AllAsset | undefined; element: AllElement }> => {
  let asset: AllAsset | undefined
  let element: AllElement | undefined

  switch (payload.type) {
    case 'image':
      asset = await createImageAssetByUrl(payload.url)
      element = await createImageElementByAsset(asset, { start: start })
      break
    case 'text':
      element = createTextElement('default text', { start: start })
      break
    default:
      assert(false, 'Unsupported element')
  }

  return { asset, element }
}
