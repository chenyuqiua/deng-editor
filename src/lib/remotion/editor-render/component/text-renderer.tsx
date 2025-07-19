import { memo } from 'react'
import { useVideoConfig } from 'remotion'
import { PreMountSeconds } from '../constant/remotion-config'
import type { TextElement } from '../schema/element'
import { SequenceController } from './sequence-controller'
import { VisualContainer } from './visual-container'

interface IProps {
  element: TextElement
}

export const TextRenderer = memo((props: IProps) => {
  const { element } = props
  const { fps } = useVideoConfig()

  return (
    <SequenceController element={element} premountFor={PreMountSeconds * fps}>
      <VisualContainer element={element}>
        <div style={element.style}>{element.text}</div>
      </VisualContainer>
    </SequenceController>
  )
})
