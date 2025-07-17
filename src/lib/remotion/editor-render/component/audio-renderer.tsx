import { memo } from 'react'
import type { AllAsset } from '../schema/asset'
import type { AllElement } from '../schema/element'

interface IProps {
  element: AllElement
  asset: AllAsset
}

export const AudioRenderer = memo((props: IProps) => {
  const { element, asset } = props

  return (
    <div>{`${element.type}-${element.id}-${asset?.type}-${asset?.id}`}</div>
  )
})
