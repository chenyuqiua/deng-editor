import { cn } from '@/common/util/css'
import { format } from 'date-fns'
import { memo, type MouseEvent } from 'react'
import { useFullscreen, useIdle, useToggle } from 'react-use'
import { IconButton } from '../button'
import type { VideoInfo } from './player'
import { VideoProgress } from './progress'
import { VolumeButton } from './volume-button'

interface IProps {
  videoInfo: VideoInfo
  clip: { start: number; end: number }
  isLoading?: boolean
  controlsRef: React.RefObject<HTMLDivElement>
  hiddenTimeInfo?: boolean
  togglePlay: (e: MouseEvent<HTMLDivElement>) => void
  hiddenVolumeButton?: boolean
}

export const VideoPlayerControls = memo((props: IProps) => {
  const {
    videoInfo,
    clip,
    togglePlay,
    isLoading,
    controlsRef,
    hiddenTimeInfo,
    hiddenVolumeButton,
  } = props
  const [_video, state] = videoInfo

  const [show, toggle] = useToggle(false)
  useFullscreen(controlsRef, show, { onClose: () => toggle(false) })

  const isIdle = useIdle(3000)

  return (
    <div
      className={cn(
        'absolute right-0 bottom-0 left-0 mx-auto',
        'flex w-auto flex-col items-center p-4 pt-1',
        'bg-gradient-to-t from-black to-black/0',
        show ? (isIdle ? 'hidden' : 'flex') : 'hidden group-hover/video-player:flex'
      )}
      onClick={e => {
        e.stopPropagation()
      }}
    >
      <VideoProgress videoInfo={videoInfo} clip={clip} />

      <div className="flex w-full justify-between gap-2">
        <div className="flex items-center gap-2">
          <div onClick={togglePlay} className="size-8">
            <IconButton
              loading={isLoading}
              icon={state.playing ? 'pause' : 'play-fill'}
              color="#fff"
              size="md"
            />
          </div>

          {!hiddenTimeInfo && (
            <div className="text-body-xs text-color-title flex items-center">
              {format(new Date((state.time - clip.start) * 1000), 'mm:ss')}/
              {format(new Date((clip.end - clip.start) * 1000), 'mm:ss')}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!hiddenVolumeButton && <VolumeButton videoInfo={videoInfo} />}
          <IconButton icon="fill-screen" color="#fff" size="md" onClick={() => toggle()} />
        </div>
      </div>
    </div>
  )
})
