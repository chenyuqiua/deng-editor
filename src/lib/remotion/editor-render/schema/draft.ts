import z from 'zod'
import { AllAssetSchema } from './asset'
import { AllElementSchema } from './element'
import { TrackSchema } from './track'

export const FontSchema = z.object({
  src: z.string(),
  family: z.string(),
})

export const TimelineSchema = z.object({
  assets: z.record(z.string(), AllAssetSchema),
  elements: z.record(z.string(), AllElementSchema),
  fonts: z.array(FontSchema).optional(),
  tracks: z.array(TrackSchema),
})

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
  timeline: TimelineSchema,
  meta: MetaSchema,
})

export type FontType = z.infer<typeof FontSchema>
export type DraftDataType = z.infer<typeof DraftDataSchema>
