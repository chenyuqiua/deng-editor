import { memo, useState } from 'react'
import { TimelineTrackClip } from './timeline-track-clip'
import { useDrop } from 'react-dnd'
import type { Track } from '@/lib/remotion/editor-render/schema/track'
import { EditorDragType, type TrackClipDragItem } from '../../type/drag'
import { getDraftService } from '../../util/service'
import { useTimelineViewController } from '../context/timeline.context'
import type { TimeRange } from '../../type/timeline'
import { ClipDragPlaceholder } from './clip-drag-placeholder'

interface IProps {
  track: Track
}

export const TimelineTrack = memo((props: IProps) => {
  const { track } = props
  const vc = useTimelineViewController()
  const draftService = getDraftService()

  const [movingRange, setMovingRange] = useState<TimeRange>({
    start: 0,
    end: 0,
  })

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: EditorDragType.TrackClip,
    drop: (item: TrackClipDragItem, monitor) => {
      if (!monitor.canDrop()) return
      const timeRange = vc.rangeManager.calcDropTimeRange({
        clipElementId: item.elementId,
        offsetLeft: monitor.getDifferenceFromInitialOffset()?.x,
        trackId: track.id,
      })

      if (!timeRange) return

      const elementTrack = draftService.getTrackByElementId(item.elementId)
      if (!elementTrack || !track) return

      if (elementTrack.id !== track.id) {
        draftService.moveElementToTrack(item.elementId, track.id)
      }
      draftService.updateElement(item.elementId, {
        start: timeRange.start,
        length: timeRange.end - timeRange.start,
      })
    },
    canDrop: (item: TrackClipDragItem, monitor) => {
      const elementTrack = draftService.getTrackByElementId(item.elementId)
      const timeRange = vc.rangeManager.calcDropTimeRange({
        clipElementId: item.elementId,
        offsetLeft: monitor.getDifferenceFromInitialOffset()?.x,
        trackId: track.id,
      })

      if (!elementTrack || !timeRange || elementTrack.type !== track.type) return false

      return true
    },
    hover: (item: TrackClipDragItem, monitor) => {
      if (!monitor.isOver() || !monitor.canDrop()) return
      const timeRange = vc.rangeManager.calcDropTimeRange({
        clipElementId: item.elementId,
        offsetLeft: monitor.getDifferenceFromInitialOffset()?.x,
        trackId: track.id,
      })

      if (!timeRange) return
      setMovingRange(timeRange)
    },
    collect: monitor => ({ isOver: monitor.isOver(), canDrop: monitor.canDrop() }),
  }))

  return (
    <div
      className="relative flex h-10 w-full shrink-0 bg-[#2f2f2f]"
      ref={elem => {
        if (elem) drop(elem)
      }}
    >
      {track?.clips.map(clip => (
        <TimelineTrackClip key={clip.elementId} clip={clip} className="h-[calc(100%-4px)]" />
      ))}
      {isOver && canDrop && (
        <ClipDragPlaceholder timeRange={movingRange} className="top-[2px] h-[calc(100%-4px)]" />
      )}
    </div>
  )
})
