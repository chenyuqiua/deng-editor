import { memo } from 'react'
import { Img, useVideoConfig } from 'remotion'
import { PreMountSeconds } from '../constant/remotion-config'
import type { ImageAsset } from '../schema/asset'
import type { ImageElement } from '../schema/element'
import { SequenceController } from './sequence-controller'

interface IProps {
  element: ImageElement
  asset: ImageAsset
}

export const ImageRenderer = memo((props: IProps) => {
  const { element, asset } = props
  const { fps } = useVideoConfig()

  return (
    <SequenceController element={element} premountFor={PreMountSeconds * fps}>
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Img
          draggable={false}
          src={asset?.src}
          style={{
            userSelect: 'none',
            position: 'relative',
          }}
        />
      </div>
    </SequenceController>
  )
})
