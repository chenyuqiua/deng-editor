import { useMemo } from 'react'
import type { DraftDataType } from '../schema/draft'
import type { AllAudioElement, AllDisplayElement } from '../schema/element'
import { isDisplayElementType, shallowWalkTracksElement } from '../util/draft'

type DisplayElement = [
  AllDisplayElement,
  { preElement: AllDisplayElement | undefined; nextElement: AllDisplayElement | undefined },
]

export const useGetElements = (draft: DraftDataType) => {
  return useMemo(() => {
    const displayElements: DisplayElement[] = []
    const audioElements: AllAudioElement[] = []

    shallowWalkTracksElement(draft, draft.timeline.tracks, (element, track, currentClipIndex) => {
      if (isDisplayElementType(element)) {
        const preClip = currentClipIndex > 0 ? track.clips[currentClipIndex - 1] : undefined
        const nextClip =
          currentClipIndex < track.clips.length - 1 ? track.clips[currentClipIndex + 1] : undefined

        let preElement = preClip ? draft.timeline.elements[preClip.elementId] : undefined
        let nextElement = nextClip ? draft.timeline.elements[nextClip.elementId] : undefined

        // 这里仅是为了类型安全，因为音频元素不能作为display元素
        preElement = preElement && isDisplayElementType(preElement) ? preElement : undefined
        nextElement = nextElement && isDisplayElementType(nextElement) ? nextElement : undefined

        displayElements.push([element, { preElement, nextElement }])
      } else {
        audioElements.push(element)
      }
    })

    return {
      // 因为 remotion 的渲染顺序是自下而上的，所以需要反转一下, 让数组前面的元素在上面
      displayElements: displayElements.reverse(),
      audioElements,
    }
  }, [draft])
}
