import type { AllElement } from '@/lib/remotion/editor-render/schema/element'
import type { TrackClip } from '@/lib/remotion/editor-render/schema/track'
import React, { memo, useMemo } from 'react'
import { useDraftService } from '../../hook/service'
import { AudioThumbnail, ImageThumbnail, TextThumbnail } from './timeline-thumbnail'

interface IProps {
  clip: TrackClip
}

const getElementThumbnail = (element: AllElement): React.ReactNode => {
  const map = {
    text: <TextThumbnail elementId={element.id} />,
    image: <ImageThumbnail elementId={element.id} />,
    audio: <AudioThumbnail elementId={element.id} />,
  }

  return map[element.type]
}

export const TimelineTrackClip = memo((props: IProps) => {
  const { clip } = props

  const draftService = useDraftService()
  const clipElement = useMemo(() => draftService.getElement(clip.elementId), [clip.elementId])

  return <div className="">{getElementThumbnail(clipElement)}</div>
})
