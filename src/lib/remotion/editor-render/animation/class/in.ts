import type { DisplayElement } from '../../schema/element'
import { AnimationBase } from '../animation-base'

export class FadeInAnimation extends AnimationBase {
  static AnimationName = 'fade-in'
  defaultDuration = 0.35

  getBoxAnimationProperty(box: DisplayElement, time: number, duration: number) {
    const opacity = 1 * this.timing(time / duration)
    return { opacity }
  }
}
