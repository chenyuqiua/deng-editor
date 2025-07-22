import { memo } from 'react'
import { useDraftSelector } from '../hook/draft'
import { TimelineBootstrap } from './bootstarp/bootstarp'
import { TimelineTrack } from './block/timeline-track'
import { TimelineAction } from './block/timeline-action'
import { TimelineRuler } from './block/timeline-ruler'
import { cn } from '@/lib/utils'

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
        <div className="flex max-w-full flex-col overflow-x-scroll">
          <TimelineRuler>
            {tracks.map(track => (
              <TimelineTrack key={track.id} track={track} />
            ))}
            <div>test</div>
          </TimelineRuler>
        </div>
      </div>
    </TimelineBootstrap>
  )
})
