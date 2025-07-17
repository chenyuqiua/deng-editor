import { memo } from 'react'
import { Sequence, type SequenceProps } from 'remotion'
import { useFrameRange } from '../hook/use-frame-range'
import type { AllElement } from '../schema/element'

type IProps = SequenceProps & {
  element: Pick<AllElement, 'start' | 'length' | 'hidden'>
}

export const SequenceController = memo((props: IProps) => {
  const { element, ...rest } = props

  const { startFrame, durationFrame } = useFrameRange({
    start: element.start,
    length: element.length,
  })

  if (element.hidden || durationFrame <= 0) return null

  return <Sequence from={startFrame} durationInFrames={durationFrame} {...rest} />
})
