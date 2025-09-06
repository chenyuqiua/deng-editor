function loadPoster(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export async function blurElement(
  source: HTMLVideoElement | HTMLImageElement | undefined | null,
  target: HTMLCanvasElement | undefined | null,
  options?: {
    blur?: number
    backgroundColor?: string
  }
) {
  if (!source || !target) return
  const ctx = target.getContext('2d')
  if (!ctx) return

  const blur = options?.blur ?? 20
  const backgroundColor = options?.backgroundColor ?? '#000'

  const sourceRect = source.getBoundingClientRect()
  const tw = (target.width = sourceRect.width)
  const th = (target.height = sourceRect.height)

  let sw: number
  let sh: number
  let drawSource: CanvasImageSource | null = null

  if (source instanceof HTMLVideoElement) {
    sw = source.videoWidth
    sh = source.videoHeight

    if (sw && sh) {
      // video frame loaded
      drawSource = source
    } else if (source.poster) {
      // video frame not loaded → try to load poster
      const img = await loadPoster(source.poster)
      sw = img.naturalWidth
      sh = img.naturalHeight
      drawSource = img
    } else {
      return
    }
  } else {
    // normal image
    sw = source.naturalWidth
    sh = source.naturalHeight
    if (!sw || !sh) return
    drawSource = source
  }

  const canvasRatio = tw / th
  const sourceRatio = sw / sh

  let sx = 0
  let sy = 0
  let sWidth = sw
  let sHeight = sh

  if (sourceRatio > canvasRatio) {
    sWidth = sh * canvasRatio
    sx = (sw - sWidth) / 2
  } else {
    sHeight = sw / canvasRatio
    sy = (sh - sHeight) / 2
  }

  ctx.clearRect(0, 0, tw, th)

  if (backgroundColor) {
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, tw, th)
  }

  ctx.filter = `blur(${blur}px)`
  ctx.drawImage(drawSource, sx, sy, sWidth, sHeight, 0, 0, tw, th)
  ctx.filter = 'none'
}
