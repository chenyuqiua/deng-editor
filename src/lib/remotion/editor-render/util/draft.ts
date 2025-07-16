import type { DraftDataType } from '../schema/draft'
import type { AllElement } from '../schema/element'
import type { Track } from '../schema/track'
import type { AllElementTypeAttribute } from '../schema/util'

export const shallowWalkTracksElement = (
  draft: DraftDataType,
  tracks: Track[],
  callback: (element: AllElement, track: Track) => boolean | void
) => {
  const { timeline } = draft
  Outer: for (const track of tracks) {
    const { clips } = track
    for (const clip of clips) {
      const element = timeline.elements[clip.elementId]
      if (!element) continue
      const result = callback(element, track)
      if (result) break Outer
    }
  }
}

export const checkElementType = (
  element: { type: AllElementTypeAttribute | string } | undefined,
  type: AllElementTypeAttribute
) => {
  if (!element) return false
  return element.type === type
}
