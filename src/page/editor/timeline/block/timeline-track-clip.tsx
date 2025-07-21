import type { AllElement } from '@/lib/remotion/editor-render/schema/element'
import type { TrackClip } from '@/lib/remotion/editor-render/schema/track'
import { cn } from '@/lib/utils'
import React, { memo } from 'react'
import { useZustand } from 'use-zustand'
import { ResizeWrapper } from '../../component/resize-wrapper'
import { useDraftSelector } from '../../hook/draft'
import { useEditorSelector } from '../../hook/editor'
import { useEditorService } from '../../hook/service'
import { getElementById } from '../../util/draft'
import { useTimelineViewController } from '../bootstarp/react-context'
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

  const editorService = useEditorService()
  const selectElementId = useEditorSelector(s => s.selectElementId)
  const vc = useTimelineViewController()

  const clipElement = useDraftSelector(s => getElementById(s.draft, clip.elementId))
  const pixelPerSecond = useZustand(vc.store, s => s.pixelPerSecond)

  const clipWidth = clipElement.length * pixelPerSecond

  return (
    <ResizeWrapper>
      <div
        className="box-border h-full"
        style={{
          overflow: 'hidden',
          width: `${clipWidth}px`,
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
