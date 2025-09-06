import { cn } from '@/common/util/css'
import _ from 'lodash'
import { memo, useEffect, useRef, useState, type MouseEvent } from 'react'
import { useClickAway } from 'react-use'
import { IconButton } from '../button'
import type { VideoInfo } from './player'

export const VolumeButton = memo((props: { videoInfo: VideoInfo }) => {
  const { videoInfo } = props
  const [_video, state, controls] = videoInfo

  const [currentVolume, setCurrentVolume] = useState(state.volume)
  const [isActive, setIsActive] = useState(false)
  const volumeRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const preVolumeNumber = useRef(state.volume)

  const isMute = currentVolume === 0

  const updateToNewVolume = _.throttle((clientY: number) => {
    if (!volumeRef.current) return
    const { height, top } = volumeRef.current.getBoundingClientRect()
    const clickY = Math.max(0, Math.min(height, clientY - top))
    const percentage = 1 - clickY / height
    setCurrentVolume(percentage)
    controls.volume(percentage)
    return percentage
  }, 60)

  useClickAway(containerRef, () => {
    setIsActive(false)
  })

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsActive(true)

    // three seconds after the mouse is released, the active state is set to false
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setIsActive(false)
    }, 3000)

    isDraggingRef.current = true

    updateToNewVolume(e.clientY)

    const handleGlobalMouseMove = (e: globalThis.MouseEvent) => {
      if (isDraggingRef.current) {
        updateToNewVolume(e.clientY)
      }
    }

    const handleGlobalMouseUp = () => {
      isDraggingRef.current = false

      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }

    document.addEventListener('mousemove', handleGlobalMouseMove)
    document.addEventListener('mouseup', handleGlobalMouseUp)
  }

  const handleVolumeClick = () => {
    if (isMute) {
      setCurrentVolume(preVolumeNumber.current)
      controls.volume(preVolumeNumber.current)
    } else {
      preVolumeNumber.current = currentVolume
      setCurrentVolume(0)
      controls.volume(0)
    }
  }

  return (
    <div
      className={cn('group/volume-button relative flex cursor-pointer items-center')}
      ref={containerRef}
    >
      <IconButton
        icon={isMute ? 'volume-mute' : 'volume'}
        color="#fff"
        size="md"
        onClick={handleVolumeClick}
      />
      <div
        className={cn(
          'absolute bottom-full left-1/2 z-10 -translate-x-1/2 translate-y-1',
          'invisible opacity-0 group-hover/volume-button:visible group-hover/volume-button:opacity-100',
          'transition-all duration-200 ease-out',
          'mb-5 flex h-[124px] w-8 items-center justify-center rounded-lg bg-black/60 py-4 backdrop-blur-[6px]',
          isActive && 'visible opacity-100'
        )}
      >
        <div className="group/volume-container flex h-full w-4 items-center justify-center">
          <div
            className={cn(
              'relative h-full rounded-full bg-white/30',
              'w-[2px] group-hover/volume-container:w-1',
              'transition-all duration-200 ease-out',
              isActive && 'w-1'
            )}
            ref={volumeRef}
            onMouseDown={handleMouseDown}
          >
            <div
              className="group/volume-progress absolute bottom-0 left-0 w-full rounded-full bg-white/70"
              style={{ height: `${currentVolume * 100}%` }}
            >
              <div
                className={cn(
                  'absolute top-0 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white',
                  'opacity-0 transition-opacity duration-200 group-hover/volume-progress:opacity-100',
                  isActive && 'opacity-100'
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
