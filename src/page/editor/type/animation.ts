import type { AnimationType } from '@/lib/remotion/editor-render/schema/animation'

export enum AnimationNameEnum {
  Fade = 'fade',
}

export type AnimationCategory = 'in' | 'out' | 'loop'

export type AnimationPresetItem = Omit<AnimationType, 'name'> & {
  name: AnimationNameEnum | string
  label: string
  category: AnimationCategory[]
  inIconUrl?: string
  outIconUrl?: string
}
