import { memo } from 'react'
import { Img } from 'remotion'
import type { ImageAsset } from '../schema/asset'
import type { ImageElement } from '../schema/element'
import { VisualContainer } from './visual-container'

interface IProps {
  element: ImageElement
  asset: ImageAsset
}

export const ImageRenderer = memo((props: IProps) => {
  const { element, asset } = props

  return (
    <VisualContainer element={element}>
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
    </VisualContainer>
  )
})
