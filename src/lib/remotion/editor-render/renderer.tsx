import { memo } from 'react'
import { AbsoluteFill } from 'remotion'
import z from 'zod'
import { DraftDataSchema } from './schema/draft'
import { useGetElements } from './hook/use-get-elements'
export const RenderPropsSchema = z.object({ draft: DraftDataSchema })

export const Renderer = memo((props: z.infer<typeof RenderPropsSchema>) => {
  const { draft } = props

  const { displayElements, audioElements } = useGetElements(draft)

  return (
    <AbsoluteFill>
      {displayElements.map(i => {
        return <div key={i.id}>{i.type}</div>
      })}
      {audioElements.map(i => {
        return <div key={i.id}>{i.type}</div>
      })}
    </AbsoluteFill>
  )
})
