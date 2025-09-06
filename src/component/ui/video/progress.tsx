import { cn } from '@/common/util/css'
import _ from 'lodash'
import { memo, useEffect, useRef, useState, type MouseEvent } from 'react'
import { useClickAway } from 'react-use'
import type { VideoInfo } from './player'

export const VideoProgress = memo(
  (props: { videoInfo: VideoInfo; clip: { start: number; end: number }; className?: string }) => {
    const { videoInfo, className, clip } = props
    const [_video, state, controls] = videoInfo

    const [currentTime, setCurrentTime] = useState(state.time)
    const [isActive, setIsActive] = useState(false)
    const progressRef = useRef<HTMLDivElement>(null)
    const cursorRef = useRef<HTMLDivElement>(null)
    const isDraggingRef = useRef(false)

    useClickAway(cursorRef, () => {
      setIsActive(false)
    })

    useEffect(() => {
      setCurrentTime(state.time)
    }, [state.time])

    const updateToNewTime = _.throttle((clientX: number) => {
      if (!progressRef.current) return
      const { width, left } = progressRef.current.getBoundingClientRect()
      const clickX = Math.max(0, Math.min(width, clientX - left))
      const percentage = clickX / width
      let newTime = percentage * (clip.end - clip.start) + clip.start
      if (newTime < clip.start) newTime = clip.start
      if (newTime > clip.end) newTime = clip.end
      setCurrentTime(newTime)
      controls.seek(newTime)
      return newTime
    }, 60)

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsActive(true)
      isDraggingRef.current = true
      const prePlaying = state.playing
      if (prePlaying) {
        controls.pause()
      }
      updateToNewTime(e.clientX)

      const handleGlobalMouseMove = (e: globalThis.MouseEvent) => {
        if (isDraggingRef.current) {
          updateToNewTime(e.clientX)
        }
      }

      const handleGlobalMouseUp = () => {
        isDraggingRef.current = false
        if (prePlaying) {
          controls.play()
        }
        document.removeEventListener('mousemove', handleGlobalMouseMove)
        document.removeEventListener('mouseup', handleGlobalMouseUp)
      }

      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
    }

    return (
      <div className="group flex h-3 w-full items-center">
        <div
          ref={progressRef}
          className={cn(
            'group relative flex w-full cursor-pointer items-center rounded bg-white/30',
            'h-[2px] group-hover:h-1',
            'transition-all duration-200 ease-out',
            isActive && 'h-1',
            className
          )}
          onClick={e => {
            e.stopPropagation()
          }}
          onMouseDown={handleMouseDown}
        >
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-white/70"
            style={{ width: `${((currentTime - clip.start) / (clip.end - clip.start)) * 100}%` }}
          >
            <div
              ref={cursorRef}
              className={cn(
                'absolute top-1/2 right-0 size-3 translate-x-1/2 -translate-y-1/2 rounded-full bg-white',
                'opacity-0 transition-opacity duration-200 group-hover:opacity-100',
                isActive && 'opacity-100'
              )}
            />
          </div>
        </div>
      </div>
    )
  }
)
