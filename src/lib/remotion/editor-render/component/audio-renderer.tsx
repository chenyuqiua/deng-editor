import { memo } from 'react'
import { Audio as RemotionAudio, useVideoConfig } from 'remotion'
import { PreMountSeconds } from '../constant/remotion-config'
import type { AudioAsset } from '../schema/asset'
import type { AudioElement } from '../schema/element'
import { getTrimProps } from '../util/draft'
import { SequenceController } from './sequence-controller'

interface IProps {
  element: AudioElement
  asset: AudioAsset
}

export const AudioRenderer = memo((props: IProps) => {
  const { element, asset } = props
  const { fps } = useVideoConfig()

  return (
    <SequenceController element={element} premountFor={PreMountSeconds * fps}>
      <RemotionAudio
        loop
        src={asset.src}
        volume={Math.max(0, element.volume ?? 1)}
        playbackRate={element.playbackRate || 1.0}
        {...getTrimProps(element, fps)}
      />
    </SequenceController>
  )
})
