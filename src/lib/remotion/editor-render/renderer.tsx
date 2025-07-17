import { memo } from 'react'
import { AbsoluteFill } from 'remotion'
import z from 'zod'
import { AudioElement, DisplayElement } from './component/container'
import { useGetElements } from './hook/use-get-elements'
import { DraftDataSchema } from './schema/draft'
import { getAssetByElement } from './util/draft'
export const RenderPropsSchema = z.object({ draft: DraftDataSchema })

export const Renderer = memo((props: z.infer<typeof RenderPropsSchema>) => {
  const { draft } = props

  const { displayElements, audioElements } = useGetElements(draft)

  return (
    <AbsoluteFill>
      {displayElements.map(element => {
        const asset = getAssetByElement(draft, element)
        return <DisplayElement key={element.id} element={element} asset={asset} />
      })}
      {audioElements.map(element => {
        const asset = getAssetByElement(draft, element)
        if (!asset) return null
        return <AudioElement key={element.id} element={element} asset={asset} />
      })}
    </AbsoluteFill>
  )
})
