import type { AllElement } from '@/lib/remotion/editor-render/schema/element'
import type { TrackClip } from '@/lib/remotion/editor-render/schema/track'
import { cn } from '@/lib/utils'
import React, { memo, useMemo } from 'react'
import { ResizeWrapper } from '../../component/resize-wrapper'
import { useEditorSelector } from '../../hook/editor'
import { useDraftService, useEditorService } from '../../hook/service'
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
  const editorService = useEditorService()

  const selectElementId = useEditorSelector(s => s.selectElementId)
  const clipElement = useMemo(() => draftService.getElement(clip.elementId), [clip.elementId])

  return (
    <ResizeWrapper>
      <div
        className="box-border h-full"
        style={{
          overflow: 'hidden',
          width: `${100}px`,
        }}
      >
        <div
          className={cn(
            'overflow-hidden rounded-sm',
            'transition-[border-color] duration-150 ease-in-out',
            'border-2 border-solid border-transparent hover:border-[#47E7FF]',
            selectElementId === clip.elementId && 'border-[#47E7FF]'
          )}
          onClick={() => {
            editorService.setSelectElementId(clip.elementId)
          }}
        >
          {getElementThumbnail(clipElement)}
        </div>
      </div>
    </ResizeWrapper>
  )
})
