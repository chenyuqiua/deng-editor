import { memo } from 'react'
import type { VideoElement } from '../schema/element'
import type { VideoAsset } from '../schema/asset'

interface IProps {
  element: VideoElement
  asset: VideoAsset
}

export const VideoRenderer = memo((props: IProps) => {
  const { element, asset } = props
  console.log(element, asset, 'element, asset')

  return <div>VideoRenderer</div>
})
