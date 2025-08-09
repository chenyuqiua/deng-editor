import { memo, useState } from 'react'
import { getAnimationListByType } from '../../util/animation'
import { Segment, SegmentItem } from '@/component/ui/segment'
import { pick } from 'lodash'
import { useSettingPanelViewController } from '../bootstrap/react-context'
import { AnimationItem } from '../component/animation-item'
import { useZustand } from 'use-zustand'
import { Slider } from '@/component/ui/slider'
import type { AnimationCategory } from '@/lib/remotion/editor-render/schema/animation'

export const AnimationPanel = memo(() => {
  const [animationType, setAnimationType] = useState<AnimationCategory>('in')
  const animationList = getAnimationListByType(animationType)
  const vc = useSettingPanelViewController()
  const [duration, setDuration] = useState(0.3)

  const currentElementAnimation = useZustand(
    vc.animationManager.store,
    s => s.selectElement?.animation
  )
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
            const animation = pick(preset, ['name', 'start', 'duration'])

            return (
              <AnimationItem
                key={preset.name}
                iconUrl={preset.inIconUrl}
                label={preset.label}
                active={preset.name === currentElementAnimation?.[animationType]?.name}
                onClick={() => {
                  vc.animationManager.updateByType(animationType, animation)
                }}
                onMouseEnter={() => {
                  vc.animationManager.preview(animationType, animation)
                }}
                onMouseLeave={() => {
                  vc.animationManager.previewEnd()
                }}
              />
            )
          })}
        </div>
      </div>
      {hasActive && (
        <div className="flex h-10 w-full items-center gap-2 bg-[#484848] px-4">
          <span className="text-sm text-white">Duration</span>
          <div className="flex h-6 w-12 shrink-0 items-center justify-center rounded-lg bg-[#282828] px-2 py-1 text-xs text-white select-none">
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
