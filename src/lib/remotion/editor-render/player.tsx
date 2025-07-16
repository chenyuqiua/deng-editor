import {
  Player as RemotionPlayer,
  type PlayerRef as RemotionPlayerRef,
} from '@remotion/player'
import { memo, useState } from 'react'
import { RenderPropsSchema, Renderer } from './renderer'

export const EditorPlayer = memo(() => {
  const [player, setPlayer] = useState<RemotionPlayerRef | null>(null)
  const width = 400
  const height = 200

  return (
    <RemotionPlayer
      ref={setPlayer}
      schema={RenderPropsSchema}
      inputProps={{ draft: {} }}
      component={Renderer}
      compositionWidth={width}
      compositionHeight={height}
      style={{
        maxHeight: '100%',
        maxWidth: '100%',
        width: '100%',
        aspectRatio: `${width} / ${height}`,
        // ...style,
      }}
      durationInFrames={60}
      fps={30}
      acknowledgeRemotionLicense
    />
  )
})
