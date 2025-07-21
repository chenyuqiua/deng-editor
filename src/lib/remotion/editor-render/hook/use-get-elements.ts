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
      // 因为 remotion 的渲染顺序是自下而上的，所以需要反转一下, 让数组前面的元素在上面
      displayElements: displayElements.reverse(),
      audioElements,
    }
  }, [draft])
}
