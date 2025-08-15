import z from 'zod'

export const BaseAssetSchema = z.object({
  type: z.string(),
  id: z.string(),
})

export const SizeAssetSchema = BaseAssetSchema.extend({
  width: z.number(),
  height: z.number(),
})

export const ImageAssetSchema = SizeAssetSchema.extend({
  type: z.literal('image'),
  src: z.string(),

  srcset: z
    .array(
      z.object({
        src: z.string(),
        width: z.number(),
        height: z.number(),
      })
    )
    .optional(),
})

export const AudioAssetSchema = BaseAssetSchema.extend({
  type: z.literal('audio'),
  src: z.string(),
  duration: z.number(),
})

export const VideoAssetSchema = ImageAssetSchema.extend({
  type: z.literal('video'),
  duration: z.number(),
  poster: z.string().optional(),
  transparent: z.boolean().optional(),
  srcset: z
    .array(
      z.object({
        poster: z.string().optional(),
        src: z.string(),
        width: z.number(),
        height: z.number(),
      })
    )
    .optional(),
  isClip: z.boolean().optional(),
})

export const AllAssetSchema = z.discriminatedUnion('type', [
  ImageAssetSchema,
  AudioAssetSchema,
  VideoAssetSchema,
])

export type BaseAsset = z.infer<typeof BaseAssetSchema>
export type SizeAsset = z.infer<typeof SizeAssetSchema>
export type ImageAsset = z.infer<typeof ImageAssetSchema>
export type AudioAsset = z.infer<typeof AudioAssetSchema>
export type VideoAsset = z.infer<typeof VideoAssetSchema>
export type AllAsset = z.infer<typeof AllAssetSchema>
