import { cn } from '@/common/util/css'
import { useZustand } from 'use-zustand'
import { useTimelineViewController } from '../bootstrap/react-context'
import { useEffect, useRef, useState } from 'react'
import { getDraftService, getPlayerService } from '../../util/service'
import { usePlayerSelector } from '../../hook/player'
import { ResizeCursorFullScreen } from '../../component/resize-cursor-full-screen'
import { flushSync } from 'react-dom'
import _ from 'lodash'

export function TimeIndicator() {
  const vc = useTimelineViewController()
  const draftService = getDraftService()
  const playerService = getPlayerService()
  const currentTime = usePlayerSelector(s => s.currentTime)
  const pixelPerSecond = useZustand(vc.store, s => s.pixelPerSecond)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const [isResizing, setIsResizing] = useState(false)

  useEffect(() => {
    const indicatorEl = indicatorRef.current
    if (!indicatorEl) return

    const throttleSeekFrame = _.throttle(playerService.seekToFrame.bind(playerService), 100, {
      leading: true,
      trailing: true,
    })

    const handleMouseDown = () => {
      document.addEventListener('pointermove', handlePointerMove)
      document.addEventListener(
        'pointerup',
        e => {
          handlePointerUp(e)
          document.removeEventListener('pointermove', handlePointerMove)
        },
        { once: true }
      )
      flushSync(() => {
        setIsResizing(true)
      })
    }

    const handlePointerMove = (e: MouseEvent) => {
      const frameOffset = vc.getFrameOffset(e.clientX)
      if (!frameOffset) return
      const pixelPerFrame = vc.state.pixelPerSecond / draftService.fps
      indicatorEl.style.left = `${frameOffset * pixelPerFrame}px`
      throttleSeekFrame(frameOffset)
    }

    const handlePointerUp = (e: MouseEvent) => {
      flushSync(() => {
        setIsResizing(false)
      })
      const frameOffset = vc.getFrameOffset(e.clientX)
      if (!frameOffset) return
      playerService.seekToFrame(frameOffset)
    }

    indicatorEl?.addEventListener('pointerdown', handleMouseDown)

    return () => {
      indicatorEl?.removeEventListener('pointerdown', handleMouseDown)
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  return (
    <>
      <ResizeCursorFullScreen show={isResizing} />
      <div
        ref={indicatorRef}
        className={cn('absolute top-0 left-0 z-1000 h-full w-3 -translate-x-1/2 cursor-ew-resize')}
        style={{ left: currentTime * pixelPerSecond }}
      >
        <div className="absolute top-0 left-1/2 h-full w-[2px] -translate-x-1/2 bg-white" />
        <div className="absolute top-0 left-1/2 size-3 -translate-x-1/2 bg-white" />
        <div className="absolute top-3 left-1/2 size-0 -translate-x-1/2 border-[6px] border-solid border-transparent border-t-white" />
      </div>
    </>
  )
}
