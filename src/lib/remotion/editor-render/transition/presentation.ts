import type { TransitionPresentation } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { slide } from '@remotion/transitions/slide'
import type { TransitionType } from '../schema/transition'

export const transitionPresentationMap: Record<string, TransitionPresentation<any>> = {
  slide: slide(),
  fade: fade(),
}

export const getTransitionPresentation = (transition?: TransitionType) => {
  if (!transition) {
    return undefined
  }

  return transitionPresentationMap[transition.name]
}

export const defaultTransitionDuration = 1
