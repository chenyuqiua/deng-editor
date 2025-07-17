import { Player as RemotionPlayer, type PlayerRef as RemotionPlayerRef } from '@remotion/player'
import {
  forwardRef,
  memo,
  useState,
  type ComponentPropsWithoutRef,
  useEffect,
  useImperativeHandle,
} from 'react'
import { RenderPropsSchema, Renderer } from './renderer'
import type { DraftDataType } from './schema/draft'
import { calcDraftDurationInFrames } from './util/draft'

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
  onPlayStateChange?: (isPlaying: boolean) => void
  onTimeUpdate?: (currentTime: number) => void
  onEnd?: () => void
}

export type EditorPlayerRef = {
  player: RemotionPlayerRef | null
}

export const EditorPlayer = memo(
  forwardRef<EditorPlayerRef, EditorPlayerProps>((props, ref) => {
    const { draft, style, onPlayStateChange, onTimeUpdate, onEnd, ...rest } = props
    const [player, setPlayer] = useState<RemotionPlayerRef | null>(null)
    const { width, height, fps } = draft.meta

    const durationInFrames = calcDraftDurationInFrames(draft)
    useImperativeHandle(
      ref,
      () => ({
        player,
      }),
      [player]
    )

    useEffect(() => {
      if (!player) return
      const handlePlay = () => onPlayStateChange?.(true)
      const handlePause = () => onPlayStateChange?.(false)
      const handleTimeUpdate = () => onTimeUpdate?.(player.getCurrentFrame() / fps)
      const handleEnd = () => onEnd?.()
      player.addEventListener('play', handlePlay)
      player.addEventListener('pause', handlePause)
      player.addEventListener('timeupdate', handleTimeUpdate)
      player.addEventListener('ended', handleEnd)

      return () => {
        player.removeEventListener('play', handlePlay)
        player.removeEventListener('pause', handlePause)
        player.removeEventListener('timeupdate', handleTimeUpdate)
        player.removeEventListener('ended', handleEnd)
      }
    }, [onPlayStateChange, onTimeUpdate, onEnd])

    return (
      <RemotionPlayer
        ref={setPlayer}
        schema={RenderPropsSchema}
        inputProps={{ draft }}
        component={Renderer}
        compositionWidth={width}
        compositionHeight={height}
        fps={fps}
        style={{
          maxHeight: '100%',
          maxWidth: '100%',
          width: '100%',
          aspectRatio: `${width} / ${height}`,
          ...style,
        }}
        durationInFrames={durationInFrames}
        acknowledgeRemotionLicense
        {...rest}
      />
    )
  })
)
