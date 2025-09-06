import { memo } from 'react'
import { OffthreadVideo } from 'remotion'
import type { VideoAsset } from '../schema/asset'
import type { VideoElement } from '../schema/element'
import { VisualContainer } from './visual-container'

interface IProps {
  element: VideoElement
  asset: VideoAsset
}

export const VideoRenderer = memo((props: IProps) => {
  const { element, asset } = props

  return (
    <VisualContainer element={element}>
      <OffthreadVideo
        src={asset?.src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'fill',
        }}
      />
    </VisualContainer>
  )
})
