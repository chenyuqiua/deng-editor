import type { DisplayElement } from '../../schema/element'
import { AnimationBase } from '../animation-base'

export class ImageSlideLeftLoop extends AnimationBase {
  static AnimationName = 'imageSlideLeft-loop'
  defaultDuration = 0

  getBoxAnimationProperty(box: DisplayElement, time: number, duration: number) {
    const x = -30 * Math.min(time, 10)
    return { x }
  }
}
