import { useMemo } from 'react'
import type { DraftDataType } from '../schema/draft'
import { checkElementType, shallowWalkTracksElement } from '../util/draft'
import type { AllElement } from '../schema/element'

export const useGetElements = (draft: DraftDataType) => {
  return useMemo(() => {
    const displayElements: AllElement[] = []
    const audioElements: AllElement[] = []
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
