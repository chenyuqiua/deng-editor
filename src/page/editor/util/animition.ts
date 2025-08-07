import { animationPresetList } from '../constant/animation'

export const getAnimationList = () => {
  const inList = animationPresetList.filter(item => item.category.includes('in'))
  const outList = animationPresetList.filter(item => item.category.includes('out'))
  const loopList = animationPresetList.filter(item => item.category.includes('loop'))

  return {
    inList,
    outList,
    loopList,
  }
}
