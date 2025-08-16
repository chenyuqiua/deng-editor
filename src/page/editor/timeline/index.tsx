import { cn } from '@/common/util/css'
import { memo } from 'react'
import { useDraftSelector } from '../hook/draft'
import { TimelineAction } from './block/timeline-action'
import { TimeIndicator } from './block/timeline-indicator'
import { TimelineScale } from './block/timeline-scale'
import { TimelineTrack } from './block/timeline-track'
import { TimelineBootstrap } from './bootstrap/bootstrap'

interface IProps {
  className?: string
}

export const Timeline = memo((props: IProps) => {
  const { className } = props
  const tracks = useDraftSelector(s => s.draft.timeline.tracks)

  return (
    <TimelineBootstrap>
      <div className={cn('flex w-full flex-col border-t-[1px] border-t-gray-100', className)}>
        <TimelineAction />
        <TimelineScale className="relative">
          <TimeIndicator />
          {tracks.map(track => (
            <TimelineTrack key={track.id} track={track} />
          ))}
        </TimelineScale>
      </div>
    </TimelineBootstrap>
  )
})
