import { useSize } from '@/common/hook/use-size'
import { cn } from '@/common/util/css'
import { Fragment, memo, useRef, type PropsWithChildren } from 'react'
import { useZustand } from 'use-zustand'
import { useDraftSelector } from '../../hook/draft'
import { usePlayerSelector } from '../../hook/player'
import { getDraftService } from '../../util/service'
import { useTimelineViewController } from '../bootstrap/react-context'

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

function FrameBlock(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, children, ...rest } = props
  return (
    <div className={cn('absolute top-0 left-0 h-full bg-white/1', className)} {...rest}>
      {children}
    </div>
  )
}

export const TimelineScale = memo((props: PropsWithChildren<{ className?: string }>) => {
  const { children, className } = props
  const vc = useTimelineViewController()
  const draftService = getDraftService()
  const duration = useDraftSelector(s => s.duration)
  const isPlaying = usePlayerSelector(s => s.isPlaying)
  const currentTime = usePlayerSelector(s => s.currentTime)
  const pixelPerSecond = useZustand(vc.store, s => s.pixelPerSecond)

  const containerRef = useRef<HTMLDivElement>(null)
  const size = useSize(containerRef)

  const minDuration = Math.ceil((size?.width ?? 0) / pixelPerSecond)
  // 多展示1秒的位置
  const displayDuration = Math.max(duration + 1, minDuration)
  const { interval, intervalCount } = getMatchedScaleSection(pixelPerSecond)

  const intervalArray = Array(Math.ceil(displayDuration / interval)).fill(null)
  const dotArray = Array(intervalCount).fill(null)
  const pixelPerFrame = pixelPerSecond / draftService.fps

  return (
    <div
      className={cn('flex w-full flex-col overflow-x-scroll', className)}
      ref={ref => {
        containerRef.current = ref
        vc.setScaleDom(ref)
      }}
    >
      <div
        className="flex h-full flex-col gap-2 overflow-hidden text-xs"
        style={{ width: `${displayDuration * pixelPerSecond}px` }}
      >
        <div
          className="relative flex h-5 w-full shrink-0 items-center justify-center bg-white/35 select-none"
          onPointerDown={e => {
            vc.dispatchIndicatorPointerDown(e.clientX)
          }}
        >
          {/* 时间刻度尺 */}
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
                  const isShowFrame = selfWidth > 80

                  return (
                    <Fragment key={dotIndex}>
                      <div
                        key={dotIndex}
                        className={cn(
                          'absolute left-0',
                          !isShowFrame && 'size-[2px] rounded-full bg-gray-800'
                        )}
                        style={{
                          transform: `translateX(-50%) translateX(${pixelPerSecond * dotTime}px)`,
                        }}
                      >
                        {isShowFrame && <span>{Math.floor(dotTime * draftService.fps)}f</span>}
                      </div>

                      {/* 当前时间 前后各绘制一帧的宽度 用于预览 */}
                      {!isPlaying && isShowFrame && (
                        <>
                          {Math.ceil(currentTime * draftService.fps) > 0 && (
                            <FrameBlock
                              style={{
                                width: pixelPerFrame,
                                left:
                                  (Math.ceil(currentTime * draftService.fps) - 1) * pixelPerFrame,
                              }}
                            />
                          )}
                          <FrameBlock
                            style={{
                              width: pixelPerFrame,
                              left: Math.ceil(currentTime * draftService.fps) * pixelPerFrame,
                            }}
                          />
                        </>
                      )}
                    </Fragment>
                  )
                })}
              </Fragment>
            )
          })}

          {/* 当前时间 前后各绘制一帧的宽度 用于预览 */}
          {!isPlaying && pixelPerFrame > 80 && (
            <>
              {Math.ceil(currentTime * draftService.fps) > 0 && (
                <FrameBlock
                  style={{
                    width: pixelPerFrame,
                    left: (Math.ceil(currentTime * draftService.fps) - 1) * pixelPerFrame,
                  }}
                />
              )}
              <FrameBlock
                style={{
                  width: pixelPerFrame,
                  left: Math.ceil(currentTime * draftService.fps) * pixelPerFrame,
                }}
              />
            </>
          )}
        </div>

        {children}
      </div>
    </div>
  )
})
