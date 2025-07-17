import { memo, type ReactNode } from 'react'
import type { AllAsset } from '../schema/asset'
import type { AllElement } from '../schema/element'
import type { AllElementTypeAttribute } from '../schema/util'
import { AudioRenderer } from './audio-renderer'
import { ImageRenderer } from './image-renderer'
import { TextRenderer } from './text-renderer'

interface IDisplayElementProps {
  element: AllElement
  asset?: AllAsset
}

export const DisplayElement = memo((props: IDisplayElementProps) => {
  const { element, asset } = props

  const map: Partial<Record<AllElementTypeAttribute, ReactNode>> = {
    image: <ImageRenderer element={element} asset={asset} />,
    text: <TextRenderer element={element} />,
  }

  return map[element.type] || null
})

interface IAudioElementProps {
  element: AllElement
  asset: AllAsset
}

export const AudioElement = memo((props: IAudioElementProps) => {
  const { element, asset } = props

  // 方便未来扩展其他元素类型
  const map: Partial<Record<AllElementTypeAttribute, ReactNode>> = {
    audio: <AudioRenderer element={element} asset={asset} />,
  }

  return map[element.type] || null
})
