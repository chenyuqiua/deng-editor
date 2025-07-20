import { memo } from 'react'
import { useDraftSelector } from '../hook/draft'
import { TimelineBootstrap } from './bootstarp/bootstarp'
import { TimelineTrack } from './block/timeline-track'

export const Timeline = memo(() => {
  const tracks = useDraftSelector(s => s.draft.timeline.tracks)

  console.log(tracks, 'tracks')

  return (
    <TimelineBootstrap>
      <div>
        {tracks.map(track => (
          <TimelineTrack key={track.id} track={track} />
        ))}
      </div>
    </TimelineBootstrap>
  )
})
