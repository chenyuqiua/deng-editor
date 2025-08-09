import { AnimationBase } from '../animation/animation-base'
import type { AllAnimationType, AnimationCategory, AnimationType } from '../schema/animation'
import type { DisplayElement } from '../schema/element'

export const getElementWithBoxAnimation = <T extends DisplayElement>(
  element: T,
  currentFrame: number
) => {
  return {
    ...element,
    x: currentFrame * 1,
    y: currentFrame * 1,
  }
}

export const createAnimationCollection = () => {
  const animations = {} as Record<string, AnimationBase | undefined>

  function register(animation: typeof AnimationBase) {
    animations[animation.AnimationName] = new animation()
  }

  function get(name: string) {
    return animations[name]
  }

  function getAnimationInstance(name: string, type: AnimationCategory) {
    // 解析动画名称，支持多个动画组合（用分号分隔）
    // 例如："fade-in;slide-in" 会同时应用淡入和滑动效果
    return name
      .split(';')
      .map(name => get(name.trim()) || get(`${name.trim()}-${type}`))
      .filter(Boolean)
  }

  /**
   *
   * @param element 要计算动画的元素
   * @param relateTime 相对于元素开始时间的当前时间（秒）
   */
  function getElementWithBoxAnimation<T extends DisplayElement>(element: T, relateTime: number) {
    const { animation, length } = element

    let el = AnimationBase.applyTo(element, {})
    const oneFrameTime = 1 / 60

    const list: AllAnimationType[] = [
      { name: '', ...animation?.in, type: 'in' as const },
      { name: '', ...animation?.out, type: 'out' as const },
      { name: '', ...animation?.loop, type: 'loop' as const },
    ].filter(i => Boolean(i.name))

    for (const animItem of list) {
      const animInstances = getAnimationInstance(animItem.name, animItem.type)
      if (!animInstances.length) continue

      for (const inst of animInstances) {
        // 计算动画持续时间
        const duration =
          animItem.duration || inst.defaultDuration || (animItem.type === 'loop' ? length : 0)

        // 计算动画开始时间
        let start = 0

        if (animItem.type === 'out') {
          start = length - duration - oneFrameTime
        }

        start = relateTime - start

        // 时间范围检查
        if (start < 0 || start > length) continue
        if (animItem.type !== 'loop') {
          if (start > duration + oneFrameTime) continue
        }

        const animationTime =
          animItem.type !== 'loop' ? Math.min(start, duration) : start % duration

        el = AnimationBase.applyTo(el, inst.getBoxAnimationProperty(el, animationTime, duration))
      }
    }

    return el
  }

  function getAnimationDuration(
    animation: AnimationType,
    options: { type: Omit<AnimationCategory, 'loop'> }
  ) {
    if (animation.duration) return Math.max(0, animation.duration)
    const fns = getAnimationInstance(animation.name, options.type as AnimationCategory)
    if (!fns.length) return 0
    return Math.max(0, ...fns.map(fn => fn?.defaultDuration || 0))
  }

  return {
    animations,
    register,
    get,
    getElementWithBoxAnimation,
    getAnimationDuration,
  }
}
