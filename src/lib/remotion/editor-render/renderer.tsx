import { memo } from 'react'
import z from 'zod'
export const RenderPropsSchema = z.object({ draft: {} })

export const Renderer = memo((props: z.infer<typeof RenderPropsSchema>) => {
  console.log(props)
  return <div>renderer</div>
})
