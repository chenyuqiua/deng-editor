import { memo } from 'react'
import { AbsoluteFill } from 'remotion'
import z from 'zod'
import { DraftDataSchema } from './schema/draft'
export const RenderPropsSchema = z.object({ draft: DraftDataSchema })

export const Renderer = memo((props: z.infer<typeof RenderPropsSchema>) => {
  const { draft } = props

  return <AbsoluteFill>{draft.name}</AbsoluteFill>
})
