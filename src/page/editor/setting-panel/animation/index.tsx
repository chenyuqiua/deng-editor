import { Fragment, memo, useState } from 'react'
import { getAnimationListByType } from '../../util/animation'
import { Segment, SegmentItem } from '@/component/ui/segment'
import { pick } from 'lodash'
import { useSettingPanelViewController } from '../bootstrap/react-context'
import { AnimationItem } from '../component/animation-item'
import { useZustand } from 'use-zustand'
import type { AnimationCategory } from '@/lib/remotion/editor-render/schema/animation'
import { animations } from '@/lib/remotion/editor-render/animation/conllection'
import { DurationSetBar } from '../block/duration-set-bar'

export const AnimationPanel = memo(() => {
  const [animationType, setAnimationType] = useState<AnimationCategory>('in')
  const animationList = getAnimationListByType(animationType)
  const vc = useSettingPanelViewController()
  const [duration, setDuration] = useState<number | undefined>(undefined)

  const currentElementAnimation = useZustand(
    vc.animationManager.store,
    s => s.selectElement?.animation
  )
  const hasActive = animationList.some(
    i => i.name === currentElementAnimation?.[animationType]?.name
  )

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-full flex-col gap-4 p-4">
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

        <div className="relative grid flex-1 auto-rows-min grid-cols-3 gap-4 overflow-hidden overflow-y-auto pb-10">
          {animationList.map(preset => {
            const animation = pick(preset, ['name', 'start', 'duration'])
            const defaultDuration = animations.getAnimationDuration(animation, {
              type: animationType,
            })
            // 不需要设置defaultDuration, 在renderer那边没有取到的话会自动用默认的duration
            if (duration) animation.duration = duration

            return (
              <Fragment key={preset.name}>
                <AnimationItem
                  iconUrl={preset.iconUrl[animationType] || 'https://picsum.photos/200/200'}
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
                {hasActive && (
                  <DurationSetBar
                    defaultValue={defaultDuration}
                    value={duration}
                    onChange={setDuration}
                    className="absolute right-0 bottom-0 rounded-lg"
                  />
                )}
              </Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
})
