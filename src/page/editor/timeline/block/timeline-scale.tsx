import { useSize } from '@/common/hook/use-size'
import { cn } from '@/lib/utils'
import _ from 'lodash'
import { Fragment, memo, useEffect, useRef, type PropsWithChildren } from 'react'
import { useZustand } from 'use-zustand'
import { useDraftSelector } from '../../hook/draft'
import { useDraftService } from '../../hook/service'
import { useTimelineViewController } from '../bootstarp/react-context'

type ScaleIntervalConfigType = { interval: number; intervalCount: number }

const scaleIntervalConfig: ScaleIntervalConfigType[] = [
  { interval: 0.1, intervalCount: 3 },
  { interval: 0.5, intervalCount: 5 },
  { interval: 1, intervalCount: 5 },
  { interval: 2, intervalCount: 4 },
  { interval: 5, intervalCount: 5 },
  { interval: 10, intervalCount: 5 },
  { interval: 30, intervalCount: 6 },
  { interval: 60, intervalCount: 6 },
  { interval: 120, intervalCount: 4 },
]

function getMatchedScaleSection(pixelPerSecond: number): ScaleIntervalConfigType {
  const section = scaleIntervalConfig.find(item => {
    return item.interval * pixelPerSecond > 96
  })
  return section ? section : (scaleIntervalConfig.at(-1) as ScaleIntervalConfigType)
}

export const TimelineScale = memo((props: PropsWithChildren) => {
  const { children } = props
  const vc = useTimelineViewController()
  const draftService = useDraftService()
  const duration = useDraftSelector(s => s.duration)
  const pixelPerSecond = useZustand(vc.store, s => s.pixelPerSecond)

  const containerRef = useRef<HTMLDivElement>(null)
  const size = useSize(containerRef)

  const minDuration = Math.ceil((size?.width ?? 0) / pixelPerSecond)
  // 多展示1秒的位置
  const displayDuration = Math.max(duration + 1, minDuration)
  const { interval, intervalCount } = getMatchedScaleSection(pixelPerSecond)

  const intervalArray = Array(Math.ceil(displayDuration / interval)).fill(null)
  const dotArray = Array(intervalCount).fill(null)

  const throttleUpdateScaleWidth = _.throttle(vc.updateScaleWidth.bind(vc), 100)

  useEffect(() => {
    if (!size?.width) return
    throttleUpdateScaleWidth(size.width)
  }, [size?.width])

  return (
    <div className="flex max-w-full flex-col overflow-x-scroll" ref={containerRef}>
      <div
        className="flex flex-col gap-2 overflow-hidden text-xs"
        style={{ width: `${displayDuration * pixelPerSecond}px` }}
      >
        <div className="relative flex h-5 w-full items-center justify-center bg-white/35 select-none">
          {intervalArray.map((_, intervalIndex) => {
            const time = intervalIndex * interval

            return (
              <Fragment key={intervalIndex}>
                <div
                  className="absolute left-0"
                  style={{
                    transform: `translateX(-50%) translateX(${pixelPerSecond * time}px)`,
                  }}
                >
                  {time.toFixed(1)}s
                </div>
                {dotArray.map((_, dotIndex) => {
                  if (dotIndex === 0) return null
                  const dotInterval = interval / intervalCount
                  const dotTime = time + dotInterval * dotIndex
                  const selfWidth = pixelPerSecond * dotInterval
                  const isShowText = selfWidth > 80

                  return (
                    <div
                      key={dotIndex}
                      className={cn(
                        'absolute left-0',
                        !isShowText && 'size-[2px] rounded-full bg-gray-800'
                      )}
                      style={{
                        transform: `translateX(-50%) translateX(${pixelPerSecond * dotTime}px)`,
                      }}
                    >
                      {isShowText && <span>{Math.floor(dotTime * draftService.fps)}f</span>}
                    </div>
                  )
                })}
              </Fragment>
            )
          })}
        </div>

        {children}
      </div>
    </div>
  )
})
