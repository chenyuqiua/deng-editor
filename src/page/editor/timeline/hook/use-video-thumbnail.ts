import { promiseWithResolvers } from '@/common/util/async'
import { useEffect, useState } from 'react'

type ThumbnailCache = {
  src?: string
  error?: Error
  promise?: Promise<{ src: string }>
}

const thumbnailCache: Map<string, ThumbnailCache> = new Map()

const generateVideoThumbnail = async (url: string) => {
  const { resolve, reject, promise } = promiseWithResolvers<string>()
  const video = document.createElement('video')
  video.crossOrigin = 'anonymous'
  video.src = url
  video.preload = 'metadata'

  await new Promise((resolve, reject) => {
    video.addEventListener('loadedmetadata', resolve)
    video.addEventListener('error', reject)
  })

  video.currentTime = 0.2

  await new Promise((resolve, reject) => {
    video.addEventListener('seeked', resolve)
    video.addEventListener('error', reject)
  })

  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')
  ctx?.drawImage(video, 0, 0)

  video.src = ''

  canvas.toBlob(blob => {
    if (blob) {
      resolve(URL.createObjectURL(blob))
    } else {
      reject(new Error('Failed to generate thumbnail'))
    }
  }, 'image/webp')

  return promise
}

export const useVideoThumbnail = (url: string) => {
  const [thumbnail, setThumbnail] = useState<{ src?: string; error?: Error }>(() => {
    const cached = thumbnailCache.get(url)
    if (cached?.src) return { src: cached.src }
    return {}
  })

  useEffect(() => {
    let cache: ThumbnailCache | undefined = thumbnailCache.get(url)
    if (!cache) {
      cache = {}
      thumbnailCache.set(url, cache)
      cache.promise = (async () => {
        const src = await generateVideoThumbnail(url)
        cache.src = src
        return { src }
      })()
    }

    if (!cache.error && !cache.src && cache.promise) {
      cache.promise
        .then(res => {
          setThumbnail({ src: res.src })
        })
        .catch(err => {
          setThumbnail({ error: err instanceof Error ? err : new Error((err as Error).toString()) })
        })
    }
  }, [url])

  return thumbnail
}
