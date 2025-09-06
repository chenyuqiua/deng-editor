import { memo } from 'react'
import { AbsoluteFill } from 'remotion'
import z from 'zod'
import { AudioElement } from './component/container'
import { TrackTransitionRenderer } from './component/track-transition-renderer'
import { DraftDataSchema } from './schema/draft'
import type { AllAudioElement, AllDisplayElement } from './schema/element'
import { getAssetByElement, getElementByTrack, isDisplayTrack } from './util/draft'

export const RenderPropsSchema = z.object({ draft: DraftDataSchema })

export const Renderer = memo((props: z.infer<typeof RenderPropsSchema>) => {
  const { draft } = props

  return (
    <AbsoluteFill style={{ backgroundColor: draft.background || 'transparent' }}>
      {draft.timeline.tracks.map(track => {
        if (isDisplayTrack(track)) {
          const displayElements = getElementByTrack(draft, track) as AllDisplayElement[]
          return (
            <TrackTransitionRenderer
              key={track.id}
              draft={draft}
              displayElements={displayElements}
            />
          )
        } else {
          const audioElements = getElementByTrack(draft, track) as AllAudioElement[]
          return audioElements.map(element => {
            const asset = getAssetByElement(draft, element)
            if (!asset) return null
            return <AudioElement key={element.id} element={element} asset={asset} />
          })
        }
      })}
    </AbsoluteFill>
  )
})
