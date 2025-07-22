import type { AllElement } from '@/lib/remotion/editor-render/schema/element'
import type { TrackClip } from '@/lib/remotion/editor-render/schema/track'
import { cn } from '@/lib/utils'
import React, { memo, useState } from 'react'
import { useZustand } from 'use-zustand'
import { ResizeWrapper } from '../../component/resize-wrapper'
import { useDraftSelector } from '../../hook/draft'
import { useEditorSelector } from '../../hook/editor'
import { useDraftService, useEditorService } from '../../hook/service'
import type { PixelRange } from '../../type/timeline'
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
  const draftService = useDraftService()
  const selectElementId = useEditorSelector(s => s.selectElementId)
  const vc = useTimelineViewController()

  const clipElement = useDraftSelector(s => getElementById(s.draft, clip.elementId))
  const pixelPerSecond = useZustand(vc.store, s => s.pixelPerSecond)
  const [innerRange, setInnerRange] = useState<PixelRange | undefined>(undefined)

  const clipWidth = innerRange?.width || clipElement.length * pixelPerSecond

  const handleResizeInPixel = (left: number, right: number) => {
    const params = {
      offset: { left, right },
      clipElementId: clip.elementId,
    }
    const pixelRange = vc.getClipPixelRange(params)
    if (!pixelRange) return
    setInnerRange(pixelRange)
  }

  const handleResizeComplete = (left: number, right: number) => {
    console.log('resize complete', left, right)
    const timeRange = vc.getClipTimeRange({
      offset: { left, right },
      clipElementId: clip.elementId,
    })
    if (!timeRange) return

    draftService.updateElement(clip.elementId, {
      start: timeRange.start,
      length: timeRange.end - timeRange.start,
    })
    setInnerRange(undefined)
  }

  return (
    <ResizeWrapper
      onResizing={handleResizeInPixel}
      onResizeComplete={handleResizeComplete}
      className="absolute w-fit"
      style={{
        height: 'calc(100% - 4px)',
        left: `${innerRange?.start || clipElement.start * pixelPerSecond}px`,
        top: 2,
      }}
    >
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
