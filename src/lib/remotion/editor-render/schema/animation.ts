import z from 'zod'

export const AnimationSchema = z.object({
  name: z.string(),
  /** in out have self default duration */
  duration: z.number().optional(),
  start: z.number().optional(),
})

export type AnimationType = z.infer<typeof AnimationSchema>

export const AnimationDataSchema = z.object({
  in: AnimationSchema.optional(),
  out: AnimationSchema.optional(),
  loop: AnimationSchema.optional(),
})

export const AllAnimationSchema = z.discriminatedUnion('type', [
  AnimationSchema.extend({ type: z.literal('in') }),
  AnimationSchema.extend({ type: z.literal('out') }),
  AnimationSchema.extend({ type: z.literal('loop') }),
])
export type AllAnimationType = z.infer<typeof AllAnimationSchema>
