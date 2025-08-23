import z from 'zod'
import { AllAssetSchema } from './asset'
import { AllElementSchema } from './element'
import { TrackSchema } from './track'
import { TransitionSchema } from './transition'

export const FontSchema = z.object({
  src: z.string(),
  family: z.string(),
})

export const TimelineSchema = z.object({
  assets: z.record(z.string(), AllAssetSchema),
  elements: z.record(z.string(), AllElementSchema),
  fonts: z.array(FontSchema).optional(),
  /**
   * 轨道的顺序很重要，第一个元素是在最顶层，最后一个元素是在最底层
   */
  tracks: z.array(TrackSchema),
  transitions: z.record(z.string(), TransitionSchema).optional(),
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
  background: z.string().optional(),
})

export type FontType = z.infer<typeof FontSchema>
export type MetaType = z.infer<typeof MetaSchema>
export type TimelineType = z.infer<typeof TimelineSchema>
export type DraftDataType = z.infer<typeof DraftDataSchema>
