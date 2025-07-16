import { memo } from 'react'
import type { AllElement } from '../schema/element'
import type { AllAsset } from '../schema/asset'

interface IDisplayElementProps {
  element: AllElement
  asset?: AllAsset
}

export const DisplayElement = memo((props: IDisplayElementProps) => {
  const { element, asset } = props

  return (
    <div>
      {element.type}-{`${asset?.type}-${asset?.id}`}
    </div>
  )
})

interface IAudioElementProps {
  element: AllElement
  asset: AllAsset
}

export const AudioElement = memo((props: IAudioElementProps) => {
  const { element, asset } = props

  return (
    <div>
      {element.type}-{`${asset?.type}-${asset?.id}`}
    </div>
  )
})
