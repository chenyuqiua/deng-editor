import { memo } from 'react'
import { TimelineTrackClip } from './timeline-track-clip'
import { useDrop } from 'react-dnd'
import type { Track } from '@/lib/remotion/editor-render/schema/track'

interface IProps {
  track: Track
}

export const TimelineTrack = memo((props: IProps) => {
  const { track } = props

  const [, drop] = useDrop(() => ({
    accept: 'clip',
    drop: () => {
      console.log('drop')
    },
  }))

  return (
    <div
      className="relative flex h-10 w-full bg-[#2f2f2f]"
      ref={elem => {
        if (elem) drop(elem)
      }}
    >
      {track?.clips.map(clip => (
        <TimelineTrackClip key={clip.elementId} clip={clip} />
      ))}
    </div>
  )
})
