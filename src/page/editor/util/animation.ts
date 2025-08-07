import { animationPresetList } from '../constant/animation'
import type { AnimationCategory, AnimationPresetItem } from '../type/animation'

export const getAllAnimationList = () => {
  const inList = animationPresetList.filter(item => item.category.includes('in'))
  const outList = animationPresetList.filter(item => item.category.includes('out'))
  const loopList = animationPresetList.filter(item => item.category.includes('loop'))

  return {
    inList,
    outList,
    loopList,
  }
}

export const getAnimationListByType = (animationType: AnimationCategory) => {
  const { inList, outList, loopList } = getAllAnimationList()
  const map: Record<AnimationCategory, AnimationPresetItem[]> = {
    in: inList,
    out: outList,
    loop: loopList,
  }
  return map[animationType]
}
