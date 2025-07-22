import { memo, type PropsWithChildren } from 'react'
import { useDraftSelector } from '../../hook/draft'
import { useTimelineViewController } from '../bootstarp/react-context'
import { useZustand } from 'use-zustand'

const MAX_DURATION = 5 * 60

export const TimelineRuler = memo((props: PropsWithChildren) => {
  const { children } = props
  const vc = useTimelineViewController()

  const duration = useDraftSelector(s => s.duration)
  const pixelPerSecond = useZustand(vc.store, s => s.pixelPerSecond)
  const maxDisplayDuration = Math.min(MAX_DURATION, duration + 1)

  return (
    <div
      className="flex flex-col gap-2 overflow-hidden"
      // TODO: 还需要考虑最小宽度
      style={{ width: `${maxDisplayDuration * pixelPerSecond}px` }}
    >
      {children}
    </div>
  )
})
