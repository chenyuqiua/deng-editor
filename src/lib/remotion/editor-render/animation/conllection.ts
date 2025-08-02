import { createAnimationCollection } from '../util/animation'
import { AnimationBase } from './animation-base'
import * as AllAnimation from './class'

export const animations = createAnimationCollection()

for (const key in AllAnimation) {
  const k = key as keyof typeof AllAnimation
  const Animation = AllAnimation[k]
  if (Animation.prototype instanceof AnimationBase) {
    animations.register(Animation)
  }
}
