import { cn } from '@/common/util/css'
import { useZustand } from 'use-zustand'
import { usePlayerSelector } from '../../hook/player'
import { useTimelineViewController } from '../bootstarp/react-context'

export function TimeIndicator() {
  const vc = useTimelineViewController()
  const currentTime = usePlayerSelector(s => s.currentTime)
  const pixelPerSecond = useZustand(vc.store, s => s.pixelPerSecond)

  return (
    <div
      className={cn('absolute top-0 left-0 z-1000 h-full w-3 -translate-x-1/2 cursor-ew-resize')}
      style={{ left: currentTime * pixelPerSecond }}
    >
      <div className="absolute top-0 left-1/2 h-full w-[2px] -translate-x-1/2 bg-white" />
      <div className="absolute top-0 left-1/2 size-3 -translate-x-1/2 bg-white" />
      <div className="absolute top-3 left-1/2 size-0 -translate-x-1/2 border-[6px] border-solid border-transparent border-t-white" />
    </div>
  )
}
