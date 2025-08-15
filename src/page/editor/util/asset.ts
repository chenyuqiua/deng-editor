import { getMeta } from '@/common/util/media'
import type { AudioAsset, ImageAsset } from '@/lib/remotion/editor-render/schema/asset'

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
    const { width, height } = await getMeta('image', url)
    imageSize = { width, height }
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
 * 根据音频 url 创建音频资源
 * @param url 音频 url
 * @param opts 音频资源选项可选，如果传入时长，则使用传入的时长，否则使用音频的原始时长
 * @returns 音频资源
 */
export const createAudioAssetByUrl = async (
  url: string,
  opts?: { duration?: number }
): Promise<AudioAsset> => {
  const { duration = 0 } = opts || {}
  let audioInfo = { duration: duration }
  if (!audioInfo.duration) {
    const { duration } = await getMeta('audio', url)
    audioInfo = { duration }
  }

  return {
    id: url,
    type: 'audio',
    src: url,
    duration: audioInfo.duration,
  }
}
