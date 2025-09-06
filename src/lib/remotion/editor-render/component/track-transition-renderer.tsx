import { TransitionSeries, linearTiming, type TransitionPresentation } from '@remotion/transitions'
import { Fragment, memo } from 'react'
import { useVideoConfig } from 'remotion'
import { PreMountSeconds } from '../constant/remotion-config'
import type { DraftDataType } from '../schema/draft'
import type { AllDisplayElement } from '../schema/element'
import type { TransitionType } from '../schema/transition'
import { defaultTransitionDuration, getTransitionPresentation } from '../transition/presentation'
import { getAssetByElement } from '../util/draft'
import { getTransitionId } from '../util/transition'

import { DisplayElement } from './container'
type IProps = {
  draft: DraftDataType
  displayElements: AllDisplayElement[]
}
export const TrackTransitionRenderer = memo((props: IProps) => {
  const { draft, displayElements } = props
  const { fps } = useVideoConfig()

  const defaultDuration = defaultTransitionDuration
  // 获取过渡动画
  const getTransition = (preElementId?: string, nextElementId?: string) => {
    if (!preElementId || !nextElementId) return undefined

    const transitionId = getTransitionId(preElementId, nextElementId)
    return (
      draft.timeline.transitions?.[transitionId] || {
        name: '',
        duration: 1,
      }
    )
  }

  // 获取过渡动画时长, 单位为帧
  const getTransitionDurationInFrames = (
    element: AllDisplayElement,
    transition?: TransitionType,
    preElement?: AllDisplayElement,
    transitionPresentation?: TransitionPresentation<any>
  ) => {
    const durationInSeconds = Math.min(
      transition?.duration || defaultDuration,
      element.length * 2,
      (preElement?.length || 0) * 2
    )

    return transitionPresentation ? Math.round(durationInSeconds * fps) : 0
  }

  // 获取过渡动画的一半时长, 单位为帧
  const getHalfTransitionFrames = (transitionFrames: number) => {
    return transitionFrames - Math.round(transitionFrames / 2)
  }

  // 获取过渡动画信息
  const getTransitionInfo = (
    element: AllDisplayElement,
    preElement?: AllDisplayElement,
    nextElement?: AllDisplayElement
  ) => {
    const preTransition = getTransition(preElement?.id, element.id)
    const nextTransition = getTransition(element.id, nextElement?.id)

    const prevTransitionPresentation = getTransitionPresentation(preTransition)
    const nextTransitionPresentation = getTransitionPresentation(nextTransition)

    const prevTransitionFrames = getTransitionDurationInFrames(
      element,
      preTransition,
      preElement,
      prevTransitionPresentation
    )
    const nextTransitionFrames = getTransitionDurationInFrames(
      element,
      nextTransition,
      nextElement,
      nextTransitionPresentation
    )

    const halfPrevTransitionFrames = getHalfTransitionFrames(prevTransitionFrames)
    const halfNextTransitionFrame = getHalfTransitionFrames(nextTransitionFrames)
    const elementFrames = Math.round(element.length * fps)
    const elementStartFrame = Math.round(element.start * fps)

    return {
      prevTransitionPresentation,
      nextTransitionPresentation,
      prevTransitionFrames,
      nextTransitionFrames,
      halfPrevTransitionFrames,
      halfNextTransitionFrame,
      elementFrames,
      elementStartFrame,
    }
  }

  return (
    <TransitionSeries>
      {displayElements.map((element, index) => {
        const preElement = index === 0 ? undefined : displayElements[index - 1]
        const nextElement =
          index < displayElements.length - 1 ? displayElements[index + 1] : undefined
        const isFirstElement = index === 0

        const {
          prevTransitionPresentation,
          prevTransitionFrames,
          halfPrevTransitionFrames,
          halfNextTransitionFrame,
          elementFrames,
          elementStartFrame,
        } = getTransitionInfo(element, preElement, nextElement)

        const asset = getAssetByElement(draft, element)
        const durationInFrames =
          elementFrames +
          halfPrevTransitionFrames +
          halfNextTransitionFrame +
          (isFirstElement ? elementStartFrame : 0)

        return (
          <Fragment key={`${element.id}-fragment`}>
            {prevTransitionPresentation ? (
              <TransitionSeries.Transition
                key={`${element.id}-transition`}
                timing={linearTiming({ durationInFrames: prevTransitionFrames })}
                presentation={prevTransitionPresentation}
              />
            ) : null}
            <TransitionSeries.Sequence
              durationInFrames={durationInFrames}
              premountFor={PreMountSeconds * fps}
              key={element.id}
            >
              <DisplayElement
                element={element}
                asset={asset}
                fromFrame={isFirstElement ? elementStartFrame : 0}
                durationInFrames={durationInFrames}
              />
            </TransitionSeries.Sequence>
          </Fragment>
        )
      })}
    </TransitionSeries>
  )
})
