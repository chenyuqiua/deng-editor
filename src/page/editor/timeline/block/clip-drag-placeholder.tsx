import React, { memo } from 'react'
import type { TimeRange } from '../../type/timeline'
import { cn } from '@/common/util/css'
import { useTimelineViewController } from '../bootstrap/react-context'
import { useZustand } from 'use-zustand'

type IProps = React.HTMLAttributes<HTMLDivElement> & {
  timeRange: TimeRange
  allow?: boolean
}

export const ClipDragPlaceholder = memo((props: IProps) => {
  const { timeRange, className, style, allow = true, ...rest } = props
  const { start, end } = timeRange
  const length = end - start
  const vc = useTimelineViewController()
  const pixelPerSecond = useZustand(vc.store, state => state.pixelPerSecond)

  return (
    <div
      className={cn(
        'absolute h-full rounded-lg border-[2px] border-dotted',
        allow ? 'border-cyan-700 bg-cyan-400' : 'border-r-red-600 bg-red-400',
        className
      )}
      style={{
        width: `${length * pixelPerSecond}px`,
        left: `${start * pixelPerSecond}px`,
        ...style,
      }}
      {...rest}
    />
  )
})
