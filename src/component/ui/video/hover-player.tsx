import { MediaPlayerManager } from '@/page/editor/manager/media-player-service'
import { useEffect, useRef, useState } from 'react'
import { VideoPlayer, type VideoPlayerProps, type VideoPlayerRef } from './player'

export const HoverVideoPlayer = (props: VideoPlayerProps) => {
  const [hover, setHover] = useState(false)
  const videoPlayerRef = useRef<VideoPlayerRef>(null)
  const [mediaPlayer] = useState(() => new MediaPlayerManager())

  const { clip } = props

  useEffect(() => {
    if (!videoPlayerRef.current) return
    const { videoRef, controls } = videoPlayerRef.current

    if (hover) {
      mediaPlayer.play(videoRef)
    } else {
      controls.pause()
      controls.seek(clip?.start || 0)
      if (videoRef) {
        videoRef.load()
      }
    }
  }, [hover])

  return (
    <VideoPlayer
      {...props}
      ref={videoPlayerRef}
      disableDefaultClick
      hiddenToggleButton
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    />
  )
}
