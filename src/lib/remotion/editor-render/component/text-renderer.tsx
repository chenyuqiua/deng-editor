import { memo } from 'react'
import type { TextElement } from '../schema/element'
import { VisualContainer } from './visual-container'

interface IProps {
  element: TextElement
}

export const TextRenderer = memo((props: IProps) => {
  const { element } = props

  return (
    <VisualContainer element={element}>
      <div style={element.style}>{element.text}</div>
    </VisualContainer>
  )
})
