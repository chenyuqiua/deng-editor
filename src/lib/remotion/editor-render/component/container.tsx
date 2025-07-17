import { memo } from 'react'
import type { AllAsset } from '../schema/asset'
import type { AllAudioElement, AllDisplayElement } from '../schema/element'
import { AudioRenderer } from './audio-renderer'
import { ImageRenderer } from './image-renderer'
import { TextRenderer } from './text-renderer'

interface IDisplayElementProps {
  element: AllDisplayElement
  asset?: AllAsset
}

export const DisplayElement = memo((props: IDisplayElementProps) => {
  const { element, asset } = props

  const isImage = element.type === 'image' && asset?.type === 'image'
  const isText = element.type === 'text'

  if (isImage) return <ImageRenderer element={element} asset={asset} />
  if (isText) return <TextRenderer element={element} />

  return null
})

interface IAudioElementProps {
  element: AllAudioElement
  asset: AllAsset
}

export const AudioElement = memo((props: IAudioElementProps) => {
  const { element, asset } = props

  const isAudio = element.type === 'audio' && asset?.type === 'audio'

  if (isAudio) return <AudioRenderer element={element} asset={asset} />

  return null
})
