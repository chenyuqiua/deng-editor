import { memo, useMemo } from 'react'
import { getDraftService } from '../../../util/service'
import { ThumbnailStyleWrapper } from './thumbnail-style-wrapper'
import { IconPark } from '@/lib/iconpark'

export interface ElementThumbnailProps {
  elementId: string
}

export const TextThumbnail = memo((props: ElementThumbnailProps) => {
  const { elementId } = props
  const draftService = getDraftService()
  const element = useMemo(() => draftService.getElementById(elementId, 'text'), [elementId])

  return (
    <ThumbnailStyleWrapper className="bg-[#924e3c]" elementId={elementId}>
      <div className="flex items-center gap-1">
        <IconPark icon="text" color="#FFFFFF" size={16} />
        {element.text}
      </div>
    </ThumbnailStyleWrapper>
  )
})

export const ImageThumbnail = memo((props: ElementThumbnailProps) => {
  const { elementId } = props
  const draftService = getDraftService()
  const element = useMemo(() => draftService.getElementById(elementId, 'image'), [elementId])
  const asset = useMemo(() => draftService.getAssetById(element.assetId, 'image'), [elementId])

  console.log(asset, 'asset')

  return (
    <ThumbnailStyleWrapper
      elementId={elementId}
      className="border-[#0C4D6E] bg-[#083349]"
      style={{
        backgroundImage: `url(${asset.src})`,
        backgroundSize: 'auto 100%',
        backgroundRepeat: 'repeat-x',
      }}
    >
      <div className="flex items-center gap-1 text-white">
        <IconPark icon="image" color="#FFFFFF" size={16} />
        <span className="text-xs">Image</span>
      </div>
    </ThumbnailStyleWrapper>
  )
})

export const AudioThumbnail = memo((props: ElementThumbnailProps) => {
  const { elementId } = props
  const draftService = getDraftService()
  const element = useMemo(() => draftService.getElementById(elementId, 'audio'), [elementId])

  return <ThumbnailStyleWrapper elementId={elementId}>{element.id}</ThumbnailStyleWrapper>
})
