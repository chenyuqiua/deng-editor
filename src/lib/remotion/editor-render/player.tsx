import {
  Player as RemotionPlayer,
  type PlayerRef as RemotionPlayerRef,
} from '@remotion/player'
import {
  forwardRef,
  memo,
  useState,
  type ComponentPropsWithoutRef,
} from 'react'
import { RenderPropsSchema, Renderer } from './renderer'
import type { DraftDataType } from './schema/draft'

type EditorPlayerProps = Omit<
  ComponentPropsWithoutRef<typeof RemotionPlayer>,
  | 'component'
  | 'schema'
  | 'inputProps'
  | 'durationInFrames'
  | 'fps'
  | 'compositionWidth'
  | 'compositionHeight'
  | 'numberOfSharedAudioTags'
  | 'lazyComponent'
  | 'acknowledgeRemotionLicense'
> & {
  draft: DraftDataType
}

export type EditorPlayerRef = unknown

export const EditorPlayer = memo(
  forwardRef<EditorPlayerRef, EditorPlayerProps>((props, ref) => {
    const { draft, style, ...rest } = props
    const [player, setPlayer] = useState<RemotionPlayerRef | null>(null)
    const { width, height, fps } = draft.meta

    return (
      <RemotionPlayer
        ref={setPlayer}
        schema={RenderPropsSchema}
        inputProps={{ draft }}
        component={Renderer}
        compositionWidth={width}
        compositionHeight={height}
        style={{
          maxHeight: '100%',
          maxWidth: '100%',
          width: '100%',
          aspectRatio: `${width} / ${height}`,
          ...style,
        }}
        durationInFrames={60}
        fps={fps}
        acknowledgeRemotionLicense
        {...rest}
      />
    )
  })
)
