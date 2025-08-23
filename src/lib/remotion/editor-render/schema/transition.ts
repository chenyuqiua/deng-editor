import z from 'zod'

export const TransitionSchema = z
  .object({
    name: z.string(),
    duration: z.number().optional(),
    ease: z.string().optional(),
  })
  .catchall(z.unknown())
export type TransitionType = z.infer<typeof TransitionSchema>
