import { TransitionSeries } from '@remotion/transitions'
import { Fragment, memo, type PropsWithChildren } from 'react'
import type { AllDisplayElement } from '../schema/element'

type IProps = PropsWithChildren & {
  element: AllDisplayElement
  preElement: AllDisplayElement | undefined
  nextElement: AllDisplayElement | undefined
}

export const TransitionRenderer = memo((props: IProps) => {
  const { children, element, preElement, nextElement } = props

  return (
    <TransitionSeries>
      <Fragment>
        {/* <TransitionSeries.Transition
          timing={springTiming({ config: { damping: 200 } })}
          presentation={wipe()}
        /> */}
        <TransitionSeries.Sequence
          durationInFrames={60}
          // durationInFrames={elementFrames + halfPrevTransitionFrames + halfNextTransitionFrame}
          // premountFor={1 * fps}
          // key={element.id}
        >
          {children}
        </TransitionSeries.Sequence>
      </Fragment>
    </TransitionSeries>
  )
})
