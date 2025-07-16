import { memo } from 'react'
import z from 'zod'
import { DraftDataSchema } from '../schema/draft'
export const RenderPropsSchema = z.object({ draft: DraftDataSchema })

export const Renderer = memo((props: z.infer<typeof RenderPropsSchema>) => {
  return <div>renderer</div>
})
