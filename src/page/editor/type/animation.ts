import type {
  AnimationCategory,
  AnimationType,
} from '@/lib/remotion/editor-render/schema/animation'

export enum AnimationNameEnum {
  Fade = 'fade',
}

export type AnimationPresetItem = Omit<AnimationType, 'name'> & {
  name: AnimationNameEnum | string
  label: string
  category: AnimationCategory[]
  inIconUrl?: string
  outIconUrl?: string
}
