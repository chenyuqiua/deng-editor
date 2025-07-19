import type { CSSProperties } from 'react'
import z from 'zod'
import { AllAnimationSchema } from './animation'
import { PointSchema, RectSchema } from './common'

export const BaseElementSchema = z.object({
  id: z.string(),
  start: z.number(),
  length: z.number(),
  assetId: z.string().optional(),
  // parent和children暂时没有用, 为后续拓展预留这个结构
  parent: z.string().optional(),
  children: z.array(z.string()).optional(),
  hidden: z.boolean().optional(),
  /** display in timeline clip */
  name: z.string().optional(),
})

export const DisplayElementSchema = BaseElementSchema.extend({
  /**
   * display size width, undefined if width is auto
   */
  width: z.number().optional(),
  /**
   * display size width, undefined if height is auto
   */
  height: z.number().optional(),
  /** right is positive */
  x: z.number(),
  /** down is positive */
  y: z.number(),
  scaleX: z.number(),
  scaleY: z.number(),
  /** right rotate is positive */
  rotate: z.number(),

  anchor: PointSchema.partial().optional(),

  /** @link https://www.figma.com/design/0Sdnz2WXtpX3xV72CtIPkJ/editor-tech-design?node-id=34-10&t=c5iv1f1cTu4JRwql-4 */
  crop: RectSchema.optional(),
  /**
   * a path or shape name: like circle; circle:50%,50%;  path:z1...;
   * @link https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path
   */
  shape: z.string().optional(),
  /** @link https://developer.mozilla.org/en-US/docs/Web/CSS/filter */
  filter: z.string().optional(),
  blendMode: z.string().optional(),
  /** opacity 0-1 */
  opacity: z.number().optional(),
  assetFit: z.enum(['cover', 'contain', 'fill', 'contain_blur']).optional(),
  animation: AllAnimationSchema.optional(),
  /** full screen mask, value as style */
  mask: z.string().optional(),
  background: z.string().optional(),
})

export const ImageElementSchema = DisplayElementSchema.extend({
  type: z.literal('image'),
  assetId: z.string(),
})

export const TextElementSchema = DisplayElementSchema.extend({
  type: z.literal('text'),
  text: z.string(),
  style: z.custom<CSSProperties>().optional(),
})

export const AudioElementSchema = BaseElementSchema.extend({
  type: z.literal('audio'),
  assetId: z.string(),
  playbackRate: z.number().optional(),
  startFrom: z.number().optional(),
  endAt: z.number().optional(),
  loop: z.boolean().optional(),
  animation: AllAnimationSchema.optional(),
  /** 0-1 */
  volume: z.number().optional(),
})

export const AllElementSchema = z.discriminatedUnion('type', [
  ImageElementSchema,
  TextElementSchema,
  AudioElementSchema,
])

export const AllDisplayElementSchema = z.discriminatedUnion('type', [
  ImageElementSchema,
  TextElementSchema,
])

// 方便未来扩展其他元素audio类型
export const AllAudioElementSchema = z.discriminatedUnion('type', [AudioElementSchema])

export type BaseElement = z.infer<typeof BaseElementSchema>
export type DisplayElement = z.infer<typeof DisplayElementSchema>

export type ImageElement = z.infer<typeof ImageElementSchema>
export type TextElement = z.infer<typeof TextElementSchema>
export type AudioElement = z.infer<typeof AudioElementSchema>
export type AllElement = z.infer<typeof AllElementSchema>
export type AllDisplayElement = z.infer<typeof AllDisplayElementSchema>
export type AllAudioElement = z.infer<typeof AllAudioElementSchema>
