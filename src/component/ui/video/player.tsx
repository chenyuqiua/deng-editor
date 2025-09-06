import { useSize } from '@/common/hook/use-size'
import { cn } from '@/common/util/css'
import { MediaPlayerManager } from '@/page/editor/manager/media-player-service'
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type MouseEvent,
} from 'react'
import { useFullscreen, useIntersection, useToggle, useVideo } from 'react-use'
import type { HTMLMediaControls } from 'react-use/lib/factory/createHTMLMediaHook'
import { IconButton } from '../button'
import { VideoPlayerControls } from './controls'
import { ErrorMask, LoadingMask } from './mask'

export type VideoInfo = ReturnType<typeof useVideo>
export type VideoPlayerRef = {
  videoRef: HTMLVideoElement | null
  posterImageRef: HTMLImageElement | null
  controls: HTMLMediaControls
}

export type VideoPlayerProps = React.ComponentPropsWithoutRef<'video'> & {
  /**
   * @description The clip property defines the start and end time of the video in seconds
   */
  clip?: {
    start?: number
    end?: number
  }
  lazyLoad?: boolean
  hiddenToggleButton?: boolean
  hiddenPauseButton?: boolean
  /**
   * @description This variable only controls whether the play button is displayed by default,
   * and does not control whether it is displayed when the mouse is hovering.
   * Now the play button will definitely be displayed when the mouse is hovering,
   * even if this value is true
   */
  hiddenPlayButton?: boolean
  hiddenVolumeButton?: boolean
  disableDefaultClick?: boolean
  showBlurBackground?: boolean
  wrapperClassName?: string
  renderExtra?: (videoInfo: VideoInfo) => React.ReactNode
  errorElement?: React.ReactNode
  /** only called when lazyFetch is true */
  onVideoFetch?: () => void
}

export const VideoPlayer = memo(
  forwardRef<VideoPlayerRef, VideoPlayerProps>((props, ref) => {
    const {
      clip: _clip,
      wrapperClassName,
      controls: _controls,
      onError,
      onCanPlay,
      onWaiting,
      onLoadedMetadata,
      onTimeUpdate,
      lazyLoad = false,
      hiddenToggleButton = false,
      hiddenPauseButton = true,
      hiddenPlayButton = false,
      hiddenVolumeButton = false,
      disableDefaultClick = false,
      className,
      renderExtra,
      errorElement,
      onVideoFetch,
      ...rest
    } = props

    const [mediaPlayer] = useState(() => new MediaPlayerManager())
    const [isLoading, setIsLoading] = useState(rest.preload !== 'none')
    const [isError, setIsError] = useState(false)
    const posterImageRef = useRef<HTMLImageElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
      videoRef: videoRef.current,
      controls,
      posterImageRef: posterImageRef.current,
    }))

    // handle loading state
    const handleOnError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      setIsLoading(false)
      setIsError(true)
      onError?.(e)
    }
    const handleOnCanPlay = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      setIsLoading(false)
      onCanPlay?.(e)
    }
    const handleOnWaiting = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      setIsLoading(true)
      onWaiting?.(e)
    }

    // handle clip
    const handleOnLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      if (_clip && _clip.start && _clip.start > 0) {
        const video = e.target as HTMLVideoElement
        video.currentTime = _clip.start
      }
      onLoadedMetadata?.(e)
    }
    const handleOnTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      const video = e.target as HTMLVideoElement
      if (video.currentTime > (_clip?.end || video.duration)) {
        controls.pause()
        controls.seek(_clip?.start || 0)
      }
      onTimeUpdate?.(e)
    }

    const videoInfo = useVideo(
      <video
        controls={false}
        onWaiting={handleOnWaiting}
        onCanPlay={handleOnCanPlay}
        onError={handleOnError}
        onLoadedMetadata={handleOnLoadedMetadata}
        onTimeUpdate={handleOnTimeUpdate}
        className={cn('size-full', className)}
        {...rest}
      />
    )
    const [video, state, controls, videoRef] = videoInfo

    // handle fullscreen
    const [show, toggle] = useToggle(false)
    useFullscreen(videoRef as React.RefObject<Element>, show, { onClose: () => toggle(false) })
    const clip = { start: _clip?.start || 0, end: _clip?.end || state.duration }

    // handle lazy load
    const entry = useIntersection(videoRef as React.RefObject<HTMLElement>, {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    })
    useEffect(() => {
      const video = videoRef.current
      if (!video || !entry || !lazyLoad) return

      if (entry.isIntersecting && video.readyState < 1) {
        setIsLoading(true)
        video.load()
      }
    }, [entry?.isIntersecting])

    const togglePlay = (e: MouseEvent<HTMLDivElement> | MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()

      if (state.playing) {
        controls.pause()
      } else {
        const video = videoRef.current
        if (video && video.preload === 'none' && video.readyState < 2) {
          setIsLoading(true)
        }
        mediaPlayer.play(videoRef.current)
      }
    }

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disableDefaultClick) return
      togglePlay(e)
    }

    const handleRetry = () => {
      setIsError(false)
      setIsLoading(true)
      videoRef.current?.load()
    }

    //  handle controls display logic
    const size = useSize(videoRef)
    const videoWidth = size?.width ?? 0

    return (
      <div
        className={cn('group/video-player relative', wrapperClassName)}
        onClick={handleClick}
        ref={containerRef}
        // onDoubleClick={() => toggle()}
      >
        {!isError && isLoading && <LoadingMask />}
        {isError && (errorElement || <ErrorMask onRetry={handleRetry} />)}

        {!isError && !isLoading && !hiddenToggleButton && (
          <IconButton
            loading={isLoading}
            icon={state.playing ? 'pause' : 'play-fill'}
            onClick={e => {
              e.stopPropagation()
              togglePlay(e)
            }}
            className={cn(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              'z-[2] flex size-12 items-center justify-center',
              'rounded-full group-hover/video-player:flex',
              hiddenPlayButton && !state.playing && 'hidden',
              state.playing && 'hidden',
              hiddenPauseButton && state.playing && 'hidden group-hover/video-player:hidden'
            )}
          />
        )}

        {video}
        {renderExtra?.(videoInfo)}

        {_controls && videoWidth > 180 && (
          <VideoPlayerControls
            controlsRef={containerRef as React.RefObject<HTMLDivElement>}
            videoInfo={videoInfo}
            clip={clip}
            isLoading={isLoading}
            hiddenTimeInfo={videoWidth < 230}
            togglePlay={togglePlay}
            hiddenVolumeButton={hiddenVolumeButton}
          />
        )}
      </div>
    )
  })
)
