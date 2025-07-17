import { memo } from 'react'
import type { AllElement } from '../schema/element'

interface IProps {
  element: AllElement
}

export const TextRenderer = memo((props: IProps) => {
  const { element } = props

  return (
    <div>
      {element.type}-{element.id}
    </div>
  )
})
