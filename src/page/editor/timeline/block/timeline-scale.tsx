import { Fragment, memo, useRef, type PropsWithChildren, useEffect } from 'react'
import { useZustand } from 'use-zustand'
import { useDraftSelector } from '../../hook/draft'
import { useTimelineViewController } from '../bootstarp/react-context'
import { useSize } from '@/common/hook/use-size'
import _ from 'lodash'

// const MAX_DURATION = 5 * 60

export const TimelineScale = memo((props: PropsWithChildren) => {
  const { children } = props
  const vc = useTimelineViewController()
  const duration = useDraftSelector(s => s.duration)
  const pixelPerSecond = useZustand(vc.store, s => s.pixelPerSecond)

  const containerRef = useRef<HTMLDivElement>(null)
  const size = useSize(containerRef)

  const minDuration = Math.ceil((size?.width ?? 0) / pixelPerSecond)
  // 多展示1秒的位置
  const displayDuration = Math.max(duration + 1, minDuration)
  const interval = 0.5
  const intervalCount = 4

  const intervalArray = Array(displayDuration / interval).fill(null)
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

                  return (
                    <div
                      key={dotIndex}
                      className="absolute left-0 size-[2px] rounded-full bg-gray-800"
                      style={{
                        transform: `translateX(-50%) translateX(${pixelPerSecond * dotTime}px)`,
                      }}
                    />
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
