import z from 'zod'

export const MetaSchema = z.object({
  watermark: z.string().optional(),
  thumbnail: z.boolean().optional(),
  thumbnailFrame: z.number().optional(),
  width: z.number(),
  height: z.number(),
  fps: z.number(),
})

export const DraftDataSchema = z.object({
  name: z.string().optional(),
  meta: MetaSchema,
})

export type DraftDataType = z.infer<typeof DraftDataSchema>
