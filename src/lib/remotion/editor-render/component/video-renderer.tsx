import { memo } from 'react'
import type { VideoElement } from '../schema/element'
import type { VideoAsset } from '../schema/asset'
import { OffthreadVideo, useVideoConfig } from 'remotion'
import { SequenceController } from './sequence-controller'
import { VisualContainer } from './visual-container'
import { PreMountSeconds } from '../constant/remotion-config'

interface IProps {
  element: VideoElement
  asset: VideoAsset
}

export const VideoRenderer = memo((props: IProps) => {
  const { element, asset } = props
  const { fps } = useVideoConfig()

  return (
    <SequenceController element={element} premountFor={PreMountSeconds * fps}>
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
    </SequenceController>
  )
})
