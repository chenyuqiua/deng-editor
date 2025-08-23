import { cn } from '@/common/util/css'
import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useZustand } from 'use-zustand'
import { ResizeCursorFullScreen } from '../../component/resize-cursor-full-screen'
import { usePlayerSelector } from '../../hook/player'
import { getPlayerService } from '../../util/service'
import { useTimelineViewController } from '../bootstrap/react-context'

export function TimeIndicator() {
  const vc = useTimelineViewController()
  const playerService = getPlayerService()
  const currentTime = usePlayerSelector(s => s.currentTime)
  const pixelPerSecond = useZustand(vc.store, s => s.pixelPerSecond)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const [isResizing, setIsResizing] = useState(false)

  useEffect(() => {
    const indicatorEl = indicatorRef.current
    if (!indicatorEl) return

    const startListener = () => {
      document.addEventListener('pointermove', handlePointerMove)
      document.addEventListener(
        'pointerup',
        e => {
          handlePointerUp(e)
          document.removeEventListener('pointermove', handlePointerMove)
        },
        { once: true }
      )
    }

    let isCanMove = false

    const handlePointerDown = (e: MouseEvent) => {
      isCanMove = true
      startListener()
      flushSync(() => {
        setIsResizing(true)
      })
      vc.moveIndicator(e.clientX)
    }

    const handlePointerMove = (e: MouseEvent) => {
      if (isCanMove) vc.moveIndicator(e.clientX)
    }

    const handlePointerUp = (e: MouseEvent) => {
      isCanMove = false
      flushSync(() => {
        setIsResizing(false)
      })
      const frameOffset = vc.getFrameOffset(e.clientX)
      if (!frameOffset) return
      playerService.seekToFrame(frameOffset)
    }

    indicatorEl?.addEventListener('pointerdown', handlePointerDown)

    return () => {
      indicatorEl?.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  return (
    <>
      <ResizeCursorFullScreen show={isResizing} />
      <div
        ref={dom => {
          if (!dom) return
          indicatorRef.current = dom
          vc.setIndicatorDom(dom)
        }}
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
