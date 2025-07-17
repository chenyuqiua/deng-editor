import { useMemo } from 'react'
import { useVideoConfig } from 'remotion'
/**
 * @description 计算开始时间和持续时间秒数对应的帧数范围
 * @param timeRange 时间范围, start开始时间, length持续时间
 * @returns 帧数范围, startFrame开始帧, durationFrame持续帧数
 */
export const useFrameRange = (timeRange: { start: number; length: number }) => {
  const { fps } = useVideoConfig()

  const start = timeRange.start * fps
  const end = start + timeRange.length * fps

  const startFrame = Math.floor(start)
  const durationFrame = Math.round(end) - startFrame + 1

  return useMemo(() => {
    return {
      startFrame,
      durationFrame,
    }
  }, [startFrame, durationFrame])
}
