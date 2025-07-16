import z from 'zod'

export const AnimationSchema = z.object({
  name: z.string(),
  /** in out have self default duration */
  duration: z.number().optional(),
  start: z.number().optional(),
})

export const InAnimationSchema = AnimationSchema.extend({
  type: z.literal('in'),
})
export const OutAnimationSchema = AnimationSchema.extend({
  type: z.literal('out'),
})
export const LoopAnimationSchema = AnimationSchema.extend({
  type: z.literal('loop'),
})

export const AllAnimationSchema = z.discriminatedUnion('type', [
  InAnimationSchema,
  OutAnimationSchema,
  LoopAnimationSchema,
])
