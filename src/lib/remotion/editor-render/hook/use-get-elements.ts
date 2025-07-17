import { useMemo } from 'react'
import type { DraftDataType } from '../schema/draft'
import type { AllAudioElement, AllDisplayElement } from '../schema/element'
import { checkElementType, shallowWalkTracksElement } from '../util/draft'

export const useGetElements = (draft: DraftDataType) => {
  return useMemo(() => {
    const displayElements: AllDisplayElement[] = []
    const audioElements: AllAudioElement[] = []
    shallowWalkTracksElement(draft, draft.timeline.tracks, element => {
      if (checkElementType(element, 'audio')) {
        audioElements.push(element)
      } else {
        displayElements.push(element)
      }
    })

    return {
      displayElements,
      audioElements,
    }
  }, [draft])
}
