import { memo } from 'react'
import { TimelineTrackClip } from './timeline-track-clip'
import { useDrop } from 'react-dnd'
import type { Track } from '@/lib/remotion/editor-render/schema/track'
import { EditorDragType, type TrackClipDragItem } from '../../type/drag'

interface IProps {
  track: Track
}

export const TimelineTrack = memo((props: IProps) => {
  const { track } = props

  const [obj, drop] = useDrop(() => ({
    accept: EditorDragType.TrackClip,
    drop: (item: TrackClipDragItem, monitor) => {
      if (!monitor.canDrop()) return
      console.log('drop', item)
    },
    collect: monitor => ({ isOver: monitor.isOver(), canDrop: monitor.canDrop() }),
  }))

  console.log('obj', obj)

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
