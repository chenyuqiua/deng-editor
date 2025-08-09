import {
  FadeInAnimation,
  RightSwipeInAnimation,
  LeftSwipeInAnimation,
  DownSwipeInAnimation,
  UpSwipeInAnimation,
} from '.'
import type { DisplayElement } from '../../schema/element'

export class FadeOutAnimation extends FadeInAnimation {
  static AnimationName = 'fade-out'

  getBoxAnimationProperty(box: DisplayElement, time: number, duration: number) {
    return super.getBoxAnimationProperty(box, duration - time, duration)
  }
}

export class LeftSwipeOutAnimation extends RightSwipeInAnimation {
  static AnimationName = 'leftSwipe-out'

  getBoxAnimationProperty(box: DisplayElement, time: number, duration: number) {
    return super.getBoxAnimationProperty(box, duration - time, duration)
  }
}
export class RightSwipeOutAnimation extends LeftSwipeInAnimation {
  static AnimationName = 'rightSwipe-out'

  getBoxAnimationProperty(box: DisplayElement, time: number, duration: number) {
    return super.getBoxAnimationProperty(box, duration - time, duration)
  }
}

export class UpSwipeOutAnimation extends DownSwipeInAnimation {
  static AnimationName = 'upSwipe-out'

  getBoxAnimationProperty(box: DisplayElement, time: number, duration: number) {
    return super.getBoxAnimationProperty(box, duration - time, duration)
  }
}
export class DownSwipeOutAnimation extends UpSwipeInAnimation {
  static AnimationName = 'downSwipe-out'

  getBoxAnimationProperty(box: DisplayElement, time: number, duration: number) {
    return super.getBoxAnimationProperty(box, duration - time, duration)
  }
}
