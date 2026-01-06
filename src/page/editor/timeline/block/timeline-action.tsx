import { Slider } from '@/component/ui/slider'
import { memo, useEffect, useRef } from 'react'
import { useTimelineViewController } from '../context/timeline.context'
import { useZustand } from 'use-zustand'
import { useDraftSelector } from '../../hook/draft'
import _ from 'lodash'
import { useSize } from '@/common/hook/use-size'
import { Button } from '@/component/ui/button'
import { usePlayerSelector } from '../../hook/player'
import { format, subHours } from 'date-fns'
import { getPlayerService } from '../../util/service'

export const TimelineAction = memo(() => {
  const vc = useTimelineViewController()
  const pixelPerSecond = useZustand(vc.store, s => s.pixelPerSecond)
  const duration = useDraftSelector(s => s.duration)
  const playerService = getPlayerService()
  const [isPlaying, currentTime] = usePlayerSelector(s => [s.isPlaying, s.currentTime])
  const scaleDomRef = useRef<HTMLDivElement>(vc.scaleDom)
  const { width: scaleWidth } = useSize(scaleDomRef) || { width: 0 }
  // 当前刻度尺宽度能够刚好容下的时间长度
  const minDuration = Math.ceil(scaleWidth / pixelPerSecond)
  const displayDuration = Math.max(duration, minDuration)

  useEffect(() => {
    if (vc.scaleDom) {
      scaleDomRef.current = vc.scaleDom
    }
  }, [vc.scaleDom])

  const throttleUpdatePixelPerSecond = _.throttle(vc.updatePixelPerSecond.bind(vc), 100)

  return (
    <div className="flex h-12 items-center justify-between px-3">
      <div className="w-[150px]"></div>
      <div className="flex flex-1 items-center justify-center gap-2">
        <Button
          icon={isPlaying ? 'pause' : 'play'}
          iconSize={20}
          variant="secondary"
          className="text-white"
          onClick={() => {
            playerService.toggle()
          }}
        />
        <div className="text-label-sm text-white">
          {format(subHours(new Date(currentTime * 1000), 8), 'HH:mm:ss')}/
          {format(subHours(new Date(duration * 1000), 8), 'HH:mm:ss')}
        </div>
      </div>
      <div className="flex w-[150px] items-center">
        <Slider
          // 最小值按照刻度尺的宽度计算, 目的是让其最小时, 刻度尺刚好完整展示
          min={scaleWidth / displayDuration}
          max={1000}
          value={[pixelPerSecond]}
          onValueChange={([newVal]) => {
            if (!isNaN(newVal)) {
              throttleUpdatePixelPerSecond(newVal)
            }
          }}
        />
      </div>
    </div>
  )
})
