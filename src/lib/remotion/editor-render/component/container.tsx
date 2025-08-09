import { memo, useEffect, useMemo, useState } from 'react'
import type { AllAsset } from '../schema/asset'
import type { AllAudioElement, AllDisplayElement } from '../schema/element'
import { AudioRenderer } from './audio-renderer'
import { ImageRenderer } from './image-renderer'
import { TextRenderer } from './text-renderer'
import { useRegisterHandler } from '../react-context'

interface IDisplayElementProps {
  element: AllDisplayElement
  asset?: AllAsset
}

export const DisplayElement = memo((props: IDisplayElementProps) => {
  const { element: originElement, asset } = props

  const [templateData, setTemplateData] = useState({
    element: null as null | Partial<AllDisplayElement>,
  })

  useRegisterHandler({
    id: originElement.id,
    eventName: 'setTemplateData',
    handler: (element: Partial<AllDisplayElement>) => {
      setTemplateData({ element })
    },
  })

  useEffect(() => {
    setTemplateData({ element: null })
  }, [originElement])

  const element = useMemo(() => {
    if (templateData.element) {
      return { ...originElement, ...templateData.element } as AllDisplayElement
    }
    return originElement
  }, [originElement, templateData.element])

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
  const { element: originElement, asset } = props

  const [templateData, setTemplateData] = useState({
    element: null as null | Partial<AllAudioElement>,
  })

  useRegisterHandler({
    id: originElement.id,
    eventName: 'setTemplateData',
    handler: (element: Partial<AllAudioElement>) => {
      setTemplateData({ element })
    },
  })

  useEffect(() => {
    setTemplateData({ element: null })
  }, [originElement])

  const element = useMemo(() => {
    if (templateData.element) {
      return { ...originElement, ...templateData.element } as AllAudioElement
    }
    return originElement
  }, [originElement, templateData.element])

  const isAudio = element.type === 'audio' && asset?.type === 'audio'

  if (isAudio) return <AudioRenderer element={element} asset={asset} />

  return null
})
