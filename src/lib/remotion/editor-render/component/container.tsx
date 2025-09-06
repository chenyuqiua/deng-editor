import { memo, useEffect, useMemo, useState } from 'react'
import { useVideoConfig } from 'remotion'
import { PreMountSeconds } from '../constant/remotion-config'
import { useRegisterHandler } from '../react-context'
import type { AllAsset } from '../schema/asset'
import type { AllAudioElement, AllDisplayElement } from '../schema/element'
import { AudioRenderer } from './audio-renderer'
import { ImageRenderer } from './image-renderer'
import { SequenceController } from './sequence-controller'
import { TextRenderer } from './text-renderer'
import { VideoRenderer } from './video-renderer'

interface IDisplayElementProps {
  element: AllDisplayElement
  asset?: AllAsset
  fromFrame: number
  durationInFrames: number
}

export const DisplayElement = memo((props: IDisplayElementProps) => {
  const { element: originElement, asset, fromFrame, durationInFrames } = props

  const [templateData, setTemplateData] = useState({
    element: null as null | Partial<AllDisplayElement>,
  })

  const { fps } = useVideoConfig()

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
  const isVideo = element.type === 'video' && asset?.type === 'video'
  const isText = element.type === 'text'

  let returnElement = null
  if (isImage) returnElement = <ImageRenderer element={element} asset={asset} />
  if (isVideo) returnElement = <VideoRenderer element={element} asset={asset} />
  if (isText) returnElement = <TextRenderer element={element} />

  if (!returnElement) return null

  return (
    <SequenceController
      from={fromFrame}
      durationInFrames={durationInFrames}
      element={element}
      premountFor={PreMountSeconds * fps}
    >
      {returnElement}
    </SequenceController>
  )
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
