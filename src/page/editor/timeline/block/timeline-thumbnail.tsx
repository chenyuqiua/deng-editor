import { memo, useMemo } from 'react'
import { useDraftService } from '../../hook/service'

export interface ElementThumbnailProps {
  elementId: string
}

export const TextThumbnail = memo((props: ElementThumbnailProps) => {
  const { elementId } = props
  const draftService = useDraftService()
  const element = useMemo(() => draftService.getElementById(elementId, 'text'), [elementId])

  return (
    <div className="flex size-full items-center overflow-hidden bg-[#924e3c] px-2 text-nowrap">
      {element.text}
    </div>
  )
})

export const ImageThumbnail = memo((props: ElementThumbnailProps) => {
  const { elementId } = props
  const draftService = useDraftService()
  const element = useMemo(() => draftService.getElementById(elementId, 'image'), [elementId])

  return <div className="">{element.id}</div>
})

export const AudioThumbnail = memo((props: ElementThumbnailProps) => {
  const { elementId } = props
  const draftService = useDraftService()
  const element = useMemo(() => draftService.getElementById(elementId, 'audio'), [elementId])

  return <div className="">{element.id}</div>
})
