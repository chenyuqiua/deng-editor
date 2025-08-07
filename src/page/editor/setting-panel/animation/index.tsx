import { memo, useState } from 'react'
import { getAnimationListByType } from '../../util/animation'
import { Segment, SegmentItem } from '@/component/ui/segment'
import type { AnimationCategory } from '../../type/animation'
import { pick } from 'lodash'
import { useSettingPanelViewController } from '../bootstrap/react-context'
import { AnimationItem } from '../component/animation-item'
import { useZustand } from 'use-zustand'
import { Slider } from '@/component/ui/slider'

export const AnimationPanel = memo(() => {
  const [animationType, setAnimationType] = useState<AnimationCategory>('in')
  const animationList = getAnimationListByType(animationType)
  const vc = useSettingPanelViewController()
  const [duration, setDuration] = useState(0.3)

  const currentElementAnimation = useZustand(vc.store, s => s.currentElementAnimation)
  const hasActive = animationList.some(
    i => i.name === currentElementAnimation?.[animationType]?.name
  )
  console.log(currentElementAnimation, 'currentElementAnimation')

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[calc(100%-40px)] flex-col gap-4 p-4">
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
                  vc.updateAnimationByType(
                    animationType,
                    pick(preset, ['name', 'start', 'duration'])
                  )
                }}
              />
            )
          })}
        </div>
      </div>
      {hasActive && (
        <div className="flex h-10 w-full items-center gap-2 bg-[#484848] px-4">
          <span className="text-sm text-white">Duration</span>
          <div className="flex h-6 w-12 shrink-0 items-center justify-center rounded-lg bg-[#282828] px-2 py-1 text-xs text-white">
            {duration}
          </div>
          <Slider
            min={0}
            max={5}
            step={0.1}
            value={[duration]}
            onValueChange={value => {
              setDuration(value[0])
            }}
          />
        </div>
      )}
    </div>
  )
})
