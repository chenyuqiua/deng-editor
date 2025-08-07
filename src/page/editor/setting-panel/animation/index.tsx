import { memo, useState } from 'react'
import { getAnimationListByType } from '../../util/animation'
import { Segment, SegmentItem } from '@/component/ui/segment'
import type { AnimationCategory } from '../../type/animation'
import { pick } from 'lodash'
import { useSettingPanelViewController } from '../bootstrap/react-context'
import { AnimationItem } from '../component/animation-item'
import { useZustand } from 'use-zustand'

export const AnimationPanel = memo(() => {
  const [animationType, setAnimationType] = useState<AnimationCategory>('in')
  const animationList = getAnimationListByType(animationType)
  const vc = useSettingPanelViewController()

  const currentElementAnimation = useZustand(vc.store, s => s.currentElementAnimation)
  console.log(currentElementAnimation, 'currentElementAnimation')

  return (
    <div className="flex flex-col px-4">
      <Segment value={animationType} className="w-full">
        <SegmentItem value="in" onClick={() => setAnimationType('in')}>
          In
        </SegmentItem>
        <SegmentItem value="out" onClick={() => setAnimationType('out')}>
          Out
        </SegmentItem>
        <SegmentItem value="loop" onClick={() => setAnimationType('loop')}>
          Loop
        </SegmentItem>
      </Segment>

      <div className="flex flex-wrap gap-4">
        {animationList.map(preset => {
          return (
            <AnimationItem
              key={preset.name}
              iconUrl={preset.inIconUrl}
              label={preset.label}
              active={preset.name === currentElementAnimation?.[animationType]?.name}
              onClick={() => {
                vc.updateAnimationByType(animationType, pick(preset, ['name', 'start', 'duration']))
              }}
            />
          )
        })}
      </div>
    </div>
  )
})
