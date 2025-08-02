import type { BaseElement, DisplayElement } from '../schema/element'
import { ease } from './timing'

// 定义动画可以修改的属性类型
type AnimationProperty = Omit<DisplayElement, keyof BaseElement>
// 定义动画特有的额外属性
type AnimationExtraProperty = { translateX: number; translateY: number; clipPath: string }

export class AnimationBase {
  static AnimationName = ''
  timing = ease
  /** 动画的默认持续时间（秒） */
  defaultDuration = 0.25

  /**
   * 计算动画属性 - 子类必须重写此方法
   *
   * @param box 当前元素的状态
   * @param time 动画已经播放的时间（秒）
   * @param duration 动画的总持续时间（秒）
   * @returns 返回需要应用的动画属性
   *
   * 这个方法接收当前时间和持续时间，返回一个0-1之间的进度值，
   * 然后根据这个进度值计算具体的动画属性（如位置、缩放、透明度等）
   */
  getBoxAnimationProperty(
    box: AnimationProperty,
    time: number,
    duration: number
  ): Partial<AnimationProperty & AnimationExtraProperty> {
    return {}
  }

  static applyTo<T extends AnimationProperty>(
    _element: T,
    _property: Partial<AnimationProperty>
  ): T & AnimationExtraProperty {
    const defaultProperty = {
      opacity: 1,
      scaleX: 1,
      scaleY: 1,
      x: 0,
      y: 0,
      rotate: 0,
      translateX: 0,
      translateY: 0,
      filter: '',
      clipPath: '',
    }

    const element = { ...defaultProperty, ..._element }
    const property = { ...defaultProperty, ..._property }

    return {
      ..._element,
      // 累积属性：使用乘法，确保多次动画的效果能够累积
      opacity: element.opacity * property.opacity,
      scaleX: element.scaleX * property.scaleX,
      scaleY: element.scaleY * property.scaleY,

      // 叠加属性：使用加法，支持位置和旋转的叠加效果
      x: element.x + property.x,
      y: element.y + property.y,
      rotate: element.rotate + property.rotate,
      translateX: element.translateX + property.translateX,
      translateY: element.translateY + property.translateY,

      // 字符串属性：使用拼接，支持滤镜效果的组合
      filter: [element.filter, property.filter].filter(Boolean).join(' '),
      // 覆盖属性：使用覆盖策略，裁剪路径通常只需要最新的值
      clipPath: property.clipPath,
    }
  }
}
