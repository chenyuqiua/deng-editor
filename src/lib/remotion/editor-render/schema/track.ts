import { z } from 'zod'

export const TrackTypeSchema = z.enum(['text', 'audio', 'image-video'])

export const TrackClipSchema = z.object({ elementId: z.string() })

export const TrackSchema = z.object({
  type: TrackTypeSchema,
  id: z.string(),
  /** Redundancies are allowed in elements and assets.
   * Only all the elements referenced by clips are the content that appears during rendering.
   */
  clips: z.array(TrackClipSchema),
  hidden: z.boolean().optional(),
})

export type TrackClip = z.infer<typeof TrackClipSchema>
export type Track = z.infer<typeof TrackSchema>
export type TrackType = z.infer<typeof TrackTypeSchema>
