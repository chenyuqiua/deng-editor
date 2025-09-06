import { blurElement } from '@/common/util/browser'
import { cn } from '@/common/util/css'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { VideoPlayer, type VideoPlayerProps, type VideoPlayerRef } from './player'

export interface BackgroundFillPlayerProps
  extends Omit<VideoPlayerProps, 'wrapperClassName' | 'onVideoMounted'> {
  /**
   * @description Background blur intensity
   */
  backgroundBlurIntensity?: number
  /**
   * @description Custom wrapper className
   */
  wrapperClassName?: string
  /**
   * @description Background opacity (0-1)
   */
  backgroundOpacity?: number
}

type BackgroundFillPlayerRef = {
  container: HTMLDivElement | null
  videoPlayer: VideoPlayerRef | null
}

export const BackgroundFillPlayer = forwardRef<BackgroundFillPlayerRef, BackgroundFillPlayerProps>(
  (props, ref) => {
    const {
      backgroundBlurIntensity = 4,
      backgroundOpacity = 1,
      wrapperClassName,
      ...videoPlayerProps
    } = props

    const mainVideoRef = useRef<VideoPlayerRef>(null)
    const backgroundVideoRef = useRef<VideoPlayerRef>(null)
    const [isMainVideoLoaded, setIsMainVideoLoaded] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const blurBgCanvasRef = useRef<HTMLCanvasElement>(null)
    const [isVideoMounted, setIsVideoMounted] = useState(false)

    useImperativeHandle(ref, () => ({
      container: containerRef.current,
      videoPlayer: mainVideoRef.current,
    }))

    // Sync background video with main video
    useEffect(() => {
      if (!mainVideoRef.current || !backgroundVideoRef.current) return

      const mainVideo = mainVideoRef.current.videoRef
      const bgVideo = backgroundVideoRef.current.videoRef
      const bgControls = backgroundVideoRef.current.controls

      if (!mainVideo || !bgVideo) return

      // Sync background video with main video
      const syncVideos = () => {
        if (Math.abs(bgVideo.currentTime - mainVideo.currentTime) > 0.3) {
          bgControls.seek(mainVideo.currentTime)
        }
      }

      const handlePlay = () => {
        if (bgVideo.paused) {
          bgControls.play()
        }
      }

      const handlePause = () => {
        if (!bgVideo.paused) {
          bgControls.pause()
        }
      }

      const handleSeek = () => {
        bgControls.seek(mainVideo.currentTime)
      }

      const handleLoadedMetadata = () => {
        setIsMainVideoLoaded(true)
        // Sync initial state when main video loads
        bgControls.seek(mainVideo.currentTime)
        if (!mainVideo.paused) {
          bgControls.play()
        }
      }

      const handleVolumeChange = () => {
        // Ensure background video stays muted
        if (!bgVideo.muted) {
          bgVideo.muted = true
        }
      }

      mainVideo.addEventListener('play', handlePlay)
      mainVideo.addEventListener('pause', handlePause)
      mainVideo.addEventListener('seeked', handleSeek)
      mainVideo.addEventListener('timeupdate', syncVideos)
      mainVideo.addEventListener('loadedmetadata', handleLoadedMetadata)
      mainVideo.addEventListener('volumechange', handleVolumeChange)

      return () => {
        mainVideo.removeEventListener('play', handlePlay)
        mainVideo.removeEventListener('pause', handlePause)
        mainVideo.removeEventListener('seeked', handleSeek)
        mainVideo.removeEventListener('timeupdate', syncVideos)
        mainVideo.removeEventListener('loadedmetadata', handleLoadedMetadata)
        mainVideo.removeEventListener('volumechange', handleVolumeChange)
      }
    }, [isMainVideoLoaded])

    // draw blur background
    useEffect(() => {
      const videoEl = mainVideoRef.current?.videoRef
      const posterImageEl = mainVideoRef.current?.posterImageRef
      const canvasEl = blurBgCanvasRef.current
      const sourceEl = videoEl || posterImageEl

      if (!sourceEl || !canvasEl) return

      let keepDrawing = false

      const draw = () => {
        blurElement(sourceEl, canvasEl, {
          blur: backgroundBlurIntensity,
        })
      }

      const drawBg = () => {
        if (!keepDrawing) return
        draw()
        requestAnimationFrame(drawBg)
      }

      const handleStart = () => {
        keepDrawing = true
        drawBg()
      }

      const handleStop = () => {
        keepDrawing = false
      }

      videoEl?.addEventListener('canplay', draw)
      videoEl?.addEventListener('load', draw)
      videoEl?.addEventListener('play', handleStart)
      videoEl?.addEventListener('pause', handleStop)
      videoEl?.addEventListener('ended', handleStop)

      if (videoEl && videoEl.currentTime <= 0) {
        videoEl.currentTime = Number.EPSILON
      }

      setTimeout(draw, 500)

      return () => {
        videoEl?.removeEventListener('canplay', draw)
        videoEl?.removeEventListener('load', draw)
        videoEl?.removeEventListener('play', handleStart)
        videoEl?.removeEventListener('pause', handleStop)
        videoEl?.removeEventListener('ended', handleStop)
      }
    }, [backgroundBlurIntensity, videoPlayerProps.src, videoPlayerProps.poster, isVideoMounted])

    return (
      <div ref={containerRef} className={cn('relative overflow-hidden', wrapperClassName)}>
        {/* Background video layer */}
        <canvas
          ref={blurBgCanvasRef}
          className="absolute inset-0 size-full"
          style={{ opacity: backgroundOpacity }}
        />
        {/* Main video layer */}
        <div className="relative z-[1] flex size-full items-center justify-center">
          <VideoPlayer
            ref={mainVideoRef}
            {...videoPlayerProps}
            wrapperClassName="size-full"
            className={cn('max-h-full max-w-full object-contain', videoPlayerProps.className)}
            onVideoFetch={() => setIsVideoMounted(true)}
          />
        </div>
      </div>
    )
  }
)
