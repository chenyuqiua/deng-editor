import { FadeInAnimation } from '.'
import type { DisplayElement } from '../../schema/element'

export class FadeOutAnimation extends FadeInAnimation {
  static AnimationName = 'fade-out'

  getBoxAnimationProperty(box: DisplayElement, time: number, duration: number) {
    return super.getBoxAnimationProperty(box, duration - time, duration)
  }
}
