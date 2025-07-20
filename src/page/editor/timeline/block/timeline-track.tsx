import React, { memo } from 'react'
import { TimelineTrackClip } from './timeline-track-clip'
import type { Track } from '@/lib/remotion/editor-render/schema/track'

interface IProps {
  track: Track
}

export const TimelineTrack = memo((props: IProps) => {
  const { track } = props

  return (
    <div>
      {track?.clips.map(clip => (
        <TimelineTrackClip key={clip.elementId} clip={clip} />
      ))}
    </div>
  )
})
