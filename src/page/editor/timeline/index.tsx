import { cn } from '@/common/util/css'
import { memo } from 'react'
import { useDraftSelector } from '../hook/draft'
import { TimelineAction } from './block/timeline-action'
import { TimelineScale } from './block/timeline-scale'
import { TimelineTrack } from './block/timeline-track'
import { TimelineBootstrap } from './bootstarp/bootstarp'

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
        <TimelineScale>
          {tracks.map(track => (
            <TimelineTrack key={track.id} track={track} />
          ))}
          <div>test</div>
        </TimelineScale>
      </div>
    </TimelineBootstrap>
  )
})
