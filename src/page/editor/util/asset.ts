import { getImageSize } from '@/common/util/media'
import { generateUuid } from '@/common/util/uuid'
import type { ImageAsset } from '@/lib/remotion/editor-render/schema/asset'
import type { ImageElement, TextElement } from '@/lib/remotion/editor-render/schema/element'
import { DefaultElementDuration, defaultTextElementStyle } from '../constant/element'

type ImageVideoElementOptions = Partial<Omit<ImageElement, 'assetId' | 'type'>>
type TextElementOptions = Partial<Omit<TextElement, 'assetId' | 'type'>>

/**
 * 根据图片 url 创建图片资源
 * @param url 图片 url
 * @param opts 图片资源选项可选，如果传入宽高，则使用传入的宽高，否则使用图片的原始宽高
 * @returns 图片资源
 */
export const createImageAssetByUrl = async (
  url: string,
  opts?: { width?: number; height?: number }
): Promise<ImageAsset> => {
  let imageSize = { width: opts?.width || 0, height: opts?.height || 0 }
  if (!imageSize.width && !imageSize.height) {
    // TODO: 这里需要优化，需要缓存
    imageSize = await getImageSize(url)
  }

  return {
    id: url,
    type: 'image',
    src: url,
    width: imageSize.width,
    height: imageSize.height,
    srcset: [
      {
        src: url,
        width: imageSize.width,
        height: imageSize.height,
      },
    ],
  }
}

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
