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

export class LeftSwipeInAnimation extends AnimationBase {
  static AnimationName = 'leftSwipe-in'
  defaultDuration = 0.35

  getBoxAnimationProperty(box: DisplayElement, time: number, duration: number) {
    const translateX = 100 * (1 - this.timing(time / duration))

    return { translateX }
  }
}

export class RightSwipeInAnimation extends AnimationBase {
  static AnimationName = 'rightSwipe-in'
  defaultDuration = 0.35

  getBoxAnimationProperty(box: DisplayElement, time: number, duration: number) {
    const translateX = -100 * (1 - this.timing(time / duration))

    return { translateX }
  }
}

export class UpSwipeInAnimation extends AnimationBase {
  static AnimationName = 'upSwipe-in'
  defaultDuration = 0.35

  getBoxAnimationProperty(box: DisplayElement, time: number, duration: number) {
    const translateY = 100 * (1 - this.timing(time / duration))

    return { translateY }
  }
}

export class DownSwipeInAnimation extends AnimationBase {
  static AnimationName = 'downSwipe-in'
  defaultDuration = 0.35

  getBoxAnimationProperty(box: DisplayElement, time: number, duration: number) {
    const translateY = -100 * (1 - this.timing(time / duration))

    return { translateY }
  }
}
