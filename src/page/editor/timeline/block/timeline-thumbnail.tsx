import { memo, useMemo } from 'react'
import { useDraftService } from '../../hook/service'

export interface ElementThumbnailProps {
  elementId: string
}

export const TextThumbnail = memo((props: ElementThumbnailProps) => {
  const { elementId } = props
  const draftService = useDraftService()
  const element = useMemo(() => draftService.getElement(elementId, 'text'), [elementId])

  return <div className="w-full bg-[#924e3c] px-2">{element.text}</div>
})

export const ImageThumbnail = memo((props: ElementThumbnailProps) => {
  const { elementId } = props
  const draftService = useDraftService()
  const element = useMemo(() => draftService.getElement(elementId, 'image'), [elementId])

  return <div className="">{element.id}</div>
})

export const AudioThumbnail = memo((props: ElementThumbnailProps) => {
  const { elementId } = props
  const draftService = useDraftService()
  const element = useMemo(() => draftService.getElement(elementId, 'audio'), [elementId])

  return <div className="">{element.id}</div>
})
