import type { AllElementTypeAttribute } from '@/lib/remotion/editor-render/schema/util'

export type InsertPayload = { type: AllElementTypeAttribute } & (
  | { type: 'text'; text: string }
  | { type: 'image'; url: string }
  | { type: 'audio'; url: string }
)
