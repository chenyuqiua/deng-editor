import type {
  AllElement,
  AudioElement,
  ImageElement,
  TextElement,
  VideoElement,
} from '@/lib/remotion/editor-render/schema/element'
import { generateUuid } from '@/common/util/uuid'
import { DefaultElementDuration, defaultTextElementStyle } from '../constant/element'
import type { AudioAsset, ImageAsset, VideoAsset } from '@/lib/remotion/editor-render/schema/asset'
import { createAudioAssetByUrl, createImageAssetByUrl, createVideoAssetByUrl } from '../util/asset'
import type { AllAsset } from '@/lib/remotion/editor-render/schema/asset'
import { assert } from '@/common/util/assert'
import type { InsertPayload } from '../type/element'

type ImageVideoElementOptions = Partial<Omit<ImageElement, 'assetId' | 'type'>>
type TextElementOptions = Partial<Omit<TextElement, 'assetId' | 'type'>>
type AudioElementOptions = Partial<Omit<AudioElement, 'assetId' | 'type'>>
type VideoElementOptions = Partial<Omit<VideoElement, 'assetId' | 'type'>>

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

/**
 * 根据音频资源创建音频元素
 * @param asset 音频资源
 * @param opts 音频元素其他配置项
 * @returns 音频元素
 */
export const createAudioElementByAsset = async (
  asset: AudioAsset,
  opts: AudioElementOptions
): Promise<AudioElement> => {
  return {
    id: generateUuid('audio'),
    type: 'audio',
    assetId: asset.id,
    start: 0,
    length: DefaultElementDuration,
    volume: 0.3,
    ...opts,
  }
}

/**
 * 根据视频资源创建视频元素
 * @param asset 视频资源
 * @param opts 视频元素其他配置项
 * @returns 视频元素
 */
export const createVideoElementByAsset = async (
  asset: VideoAsset,
  opts: VideoElementOptions
): Promise<VideoElement> => {
  return {
    id: generateUuid('video'),
    type: 'video',
    assetId: asset.id,
    width: asset.width,
    height: asset.height,
    opacity: 1,
    start: 0,
    length: asset.duration,
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
    volume: 1,
    ...opts,
  }
}

/**
 * 根据插入的元素类型和开始时间创建元素
 * @param payload 插入的元素类型和位置
 * @param start 开始时间
 * @returns 创建的元素和资源
 */
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
      element = createTextElement(payload.text, { start: start })
      break
    case 'audio':
      asset = await createAudioAssetByUrl(payload.url)
      element = await createAudioElementByAsset(asset, { start: start })
      break
    case 'video':
      asset = await createVideoAssetByUrl(payload.url)
      element = await createVideoElementByAsset(asset, { start: start })
      break
    default:
      assert(false, 'Unsupported element')
  }

  return { asset, element }
}
