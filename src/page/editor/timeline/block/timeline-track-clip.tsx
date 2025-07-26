import { cn } from '@/common/util/css'
import type { AllElement } from '@/lib/remotion/editor-render/schema/element'
import type { TrackClip } from '@/lib/remotion/editor-render/schema/track'
import React, { memo, useState } from 'react'
import { useZustand } from 'use-zustand'
import { ResizeWrapper } from '../../component/resize-wrapper'
import { useDraftSelector } from '../../hook/draft'
import { useEditorSelector } from '../../hook/editor'
import type { PixelRange } from '../../type/timeline'
import { getElementById } from '../../util/draft'
import { getDraftService, getEditorService } from '../../util/service'
import { useTimelineViewController } from '../bootstarp/react-context'
import { AudioThumbnail, ImageThumbnail, TextThumbnail } from './timeline-thumbnail'
import { useDrag } from 'react-dnd'
import { EditorDragType, type TrackClipDragItem } from '../../type/drag'

interface IProps {
  clip: TrackClip
  className?: string
}

const getElementThumbnail = (element: AllElement): React.ReactNode => {
  const map = {
    text: <TextThumbnail elementId={element.id} />,
    image: <ImageThumbnail elementId={element.id} />,
    audio: <AudioThumbnail elementId={element.id} />,
  }

  return <div className="size-full select-none">{map[element.type]}</div>
}

export const TimelineTrackClip = memo((props: IProps) => {
  const { clip, className } = props

  const editorService = getEditorService()
  const draftService = getDraftService()
  const selectElementId = useEditorSelector(s => s.selectElementId)
  const vc = useTimelineViewController()

  const clipElement = useDraftSelector(s => getElementById(s.draft, clip.elementId))
  const pixelPerSecond = useZustand(vc.store, s => s.pixelPerSecond)
  const [innerRange, setInnerRange] = useState<PixelRange | undefined>(undefined)

  const clipWidth = innerRange?.width || clipElement.length * pixelPerSecond

  const [, drag] = useDrag(() => ({
    type: EditorDragType.TrackClip,
    item: clip as TrackClipDragItem,
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const handleResizeInPixel = (left: number, right: number) => {
    const params = {
      offset: { left, right },
      clipElementId: clip.elementId,
    }
    const pixelRange = vc.rangeManager.calcResizePixelRange(params)
    if (!pixelRange) return
    setInnerRange(pixelRange)
  }

  const handleResizeComplete = (left: number, right: number) => {
    const timeRange = vc.rangeManager.calcClipTimeRange({
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
      ref={elem => {
        if (elem) drag(elem)
      }}
      onResizing={handleResizeInPixel}
      onResizeComplete={handleResizeComplete}
      leftHandle={<div className="h-full w-1" />}
      rightHandle={<div className="h-full w-1" />}
      className={cn('absolute top-[2px] h-full w-fit', className)}
      style={{
        left: `${innerRange?.start || clipElement.start * pixelPerSecond}px`,
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
            'size-full overflow-hidden rounded-sm',
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
