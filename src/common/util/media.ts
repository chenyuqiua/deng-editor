import { promiseWithResolvers } from './async'
import type { MediaMetaDataOfType, SupportMediaType } from '@/page/editor/type/media'

export const getImageSize = (url: string): Promise<MediaMetaDataOfType<'image'>> => {
  const { promise, resolve, reject } = promiseWithResolvers<MediaMetaDataOfType<'image'>>()
  const i = new Image()
  i.onload = () => {
    const { width, height } = i
    resolve({ type: 'image', width, height })
  }
  i.src = url
  i.onerror = () => reject(new Error('Image load failed'))
  return promise
}

export const getAudioInfo = (url: string): Promise<MediaMetaDataOfType<'audio'>> => {
  const { promise, resolve, reject } = promiseWithResolvers<MediaMetaDataOfType<'audio'>>()
  const audio = new Audio(url)
  audio.preload = 'metadata'
  audio.addEventListener('loadedmetadata', () => {
    const duration = audio.duration
    const playBackRate = audio.playbackRate
    const title = audio.title || null
    resolve({ type: 'audio', duration, playBackRate, title })
  })
  audio.addEventListener('error', () => {
    reject(new Error('Audio load failed'))
  })

  audio.load()
  return promise
}

export const getMeta = async <T extends SupportMediaType>(
  type: T,
  url: string
): Promise<MediaMetaDataOfType<T>> => {
  switch (type) {
    case 'image':
      return (await getImageSize(url)) as MediaMetaDataOfType<T>
    case 'audio':
      return (await getAudioInfo(url)) as MediaMetaDataOfType<T>
    default:
      throw new Error(`Unsupported media type: ${type}`)
  }
}
