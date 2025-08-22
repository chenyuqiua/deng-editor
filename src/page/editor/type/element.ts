import type {
  AudioElement,
  ImageElement,
  TextElement,
  VideoElement,
} from '@/lib/remotion/editor-render/schema/element'
import type { AllElementTypeAttribute } from '@/lib/remotion/editor-render/schema/util'

export type ImageVideoElementOptions = Partial<Omit<ImageElement, 'assetId' | 'type'>>
export type TextElementOptions = Partial<Omit<TextElement, 'assetId' | 'type' | 'text'>>
export type AudioElementOptions = Partial<Omit<AudioElement, 'assetId' | 'type'>>
export type VideoElementOptions = Partial<Omit<VideoElement, 'assetId' | 'type'>>

export type InsertPayload = { type: AllElementTypeAttribute } & (
  | { type: 'text'; text: string; data?: Partial<TextElementOptions> }
  | { type: 'image'; url: string; data?: Partial<ImageVideoElementOptions> }
  | { type: 'audio'; url: string; data?: Partial<AudioElementOptions> }
  | { type: 'video'; url: string; data?: Partial<VideoElementOptions> }
)
