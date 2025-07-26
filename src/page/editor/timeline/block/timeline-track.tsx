import { memo } from 'react'
import { TimelineTrackClip } from './timeline-track-clip'
import { useDrop } from 'react-dnd'
import type { Track } from '@/lib/remotion/editor-render/schema/track'
import { EditorDragType, type TrackClipDragItem } from '../../type/drag'
import { getDraftService } from '../../util/service'
import { useTimelineViewController } from '../bootstarp/react-context'

interface IProps {
  track: Track
}

export const TimelineTrack = memo((props: IProps) => {
  const { track } = props
  const vc = useTimelineViewController()
  const draftService = getDraftService()

  const [, drop] = useDrop(() => ({
    accept: EditorDragType.TrackClip,
    drop: (item: TrackClipDragItem, monitor) => {
      if (!monitor.canDrop()) return
      const dropTimeRange = vc.rangeManager.calcDropTimeRange({
        clipElementId: item.elementId,
        offsetLeft: monitor.getDifferenceFromInitialOffset()?.x,
        trackId: track.id,
      })
      if (!dropTimeRange) return
      const elementTrack = draftService.getTrackByElementId(item.elementId)
      if (!elementTrack || !track) return
      draftService.updateElement(item.elementId, {
        start: dropTimeRange.start,
        length: dropTimeRange.end - dropTimeRange.start,
      })
    },
    collect: monitor => ({ isOver: monitor.isOver(), canDrop: monitor.canDrop() }),
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
