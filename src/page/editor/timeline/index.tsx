import { cn } from '@/common/util/css'
import { memo, useState } from 'react'
import { useDraftSelector } from '../hook/draft'
import { TimelineAction } from './block/timeline-action'
import { TimeIndicator } from './block/timeline-indicator'
import { TimelineScale } from './block/timeline-scale'
import { TimelineTrack } from './block/timeline-track'
import { TimelineBootstrap } from './bootstrap/bootstrap'

const PanelConfig = {
  maxHeight: 464,
  minHeight: 120,
  defaultHeight: 304,
}

interface IProps {
  className?: string
}

export const Timeline = memo((props: IProps) => {
  const { className } = props
  const tracks = useDraftSelector(s => s.draft.timeline.tracks)
  // TODO: 需要监听窗口大小变化，动态调整高度
  const [height] = useState(PanelConfig.defaultHeight)

  return (
    <TimelineBootstrap>
      <div
        className={cn('flex w-full flex-col border-t-[1px] border-t-gray-100', className)}
        style={{ height }}
      >
        <TimelineAction />
        <TimelineScale className="relative flex-1">
          <TimeIndicator />
          <div className="flex h-full flex-col gap-2 overflow-y-auto">
            {tracks.map(track => (
              <TimelineTrack key={track.id} track={track} />
            ))}
          </div>
        </TimelineScale>
      </div>
    </TimelineBootstrap>
  )
})
