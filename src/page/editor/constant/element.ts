import type { TrackType } from '@/lib/remotion/editor-render/schema/track'
import type { AllElementTypeAttribute } from '@/lib/remotion/editor-render/schema/util'
import type { CSSProperties } from 'react'

export const DefaultElementDuration = 0.3

export const defaultTextElementStyle: CSSProperties & Record<string, any> = {
  display: 'inline-block',
  fontSize: 30,
  fontStyle: 'normal',
  fontWeight: 'normal',
  textDecoration: 'none',
  color: 'black',
  lineHeight: 1.2,
}

export const elementToTrackTypeMap: Record<AllElementTypeAttribute, TrackType> = {
  text: 'text',
  audio: 'audio',
  image: 'image-video',
  video: 'image-video',
}
