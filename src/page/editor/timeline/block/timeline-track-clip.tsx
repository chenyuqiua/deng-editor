import type { TrackClip } from '@/lib/remotion/editor-render/schema/track'
import React, { memo } from 'react'

interface IProps {
  clip: TrackClip
}

export const TimelineTrackClip = memo((props: IProps) => {
  const { clip } = props

  return <div>TimelineTrackClip-{clip.elementId}</div>
})
