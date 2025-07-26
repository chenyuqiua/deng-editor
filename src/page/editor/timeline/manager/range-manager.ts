import _ from 'lodash'
import type { PixelRange, RangeBoundType, TimeRange } from '../../type/timeline'
import type { IDraftService } from '../../service/draft-service.type'
import type { TimelineViewController } from '../view-controller'

export class RangeManager {
  constructor(
    private readonly _draftService: IDraftService,
    private readonly _vc: TimelineViewController
  ) {}

  /**
   * 计算出可以resize的时间范围, undefined表示不允许resize
   */
  calcClipTimeRange(props: {
    offset: { left: number; right: number }
    clipElementId: string
  }): TimeRange | undefined {
    const pixelRange = this.calcResizePixelRange(props)
    if (!pixelRange) return undefined

    return this._transformPixelRangeToTimeRange(pixelRange)
  }

  /**
   * 计算出可以resize的像素范围, undefined表示不允许resize
   */
  calcResizePixelRange(props: {
    offset: { left: number; right: number }
    clipElementId: string
  }): PixelRange | undefined {
    const { offset, clipElementId } = props

    const clipElement = this._draftService.getElementById(clipElementId)
    const pixelPerSecond = this._vc.state.pixelPerSecond
    if (!clipElement) return

    // 计算出当前元素要resize的像素范围, 并将像素范围转换为时间范围
    const pixelRange = this._calcFrameAlignedPixelBounds({ offset, clipElementId })
    if (pixelRange.start < 0) return
    const timeRange = this._transformPixelRangeToTimeRange(pixelRange)

    // 获取当前元素所在的track, 并计算出当前元素在track上可编辑的时间范围
    const track = this._draftService.getTrackByElementId(clipElementId)
    if (!track) return
    const resizeEditableRange = this._calcResizeEditableTimeRange({
      timeRange,
      clipElementId,
      trackId: track.id,
    })
    if (!resizeEditableRange) return
    const { start, end } = resizeEditableRange

    return {
      start: start * pixelPerSecond,
      width: (end - start) * pixelPerSecond,
    }
  }

  /**
   * 计算出可以drop的时间范围, undefined表示不允许drop
   */
  calcDropTimeRange(props: {
    clipElementId: string
    offsetLeft?: number
    trackId: string
  }): TimeRange | undefined {
    const { clipElementId, offsetLeft, trackId } = props
    if (typeof offsetLeft === 'undefined') return

    const draftEl = this._draftService.getElementById(clipElementId)
    if (!draftEl) return

    const alignStart = draftEl.start + offsetLeft / this._vc.state.pixelPerSecond
    const timeLength = draftEl.length
    // drop之后的时间范围
    const timeRange = { start: alignStart, end: alignStart + timeLength }

    const dropEditableRange = this._calcDropEditableTimeRange({
      timeRange,
      clipElementId,
      trackId,
    })
    if (!dropEditableRange) return

    return dropEditableRange
  }

  /*
  计算出在track上允许操作的左右边界, 
  单位为秒 leftBound -> 左边界最小值, rightBound ->右边界最大值
  如果leftBound或rightBound为undefined, 则表示在track上没有左或者右的边界限制
  */
  private _calcBoundInTrack(props: {
    timeRange: TimeRange
    clipElementId: string
    trackId: string
  }): RangeBoundType | undefined {
    const { timeRange, clipElementId, trackId } = props
    if (!timeRange || timeRange.start > timeRange.end) return undefined

    const trackRanges = this._getAllTrackRangesExceptSelf(trackId, clipElementId)
    if (!trackRanges) return undefined

    const leftBound = _.findLast(trackRanges, r => r.start < timeRange.start)?.end
    const rightBound = trackRanges.find(r => r.end > timeRange.end)?.start

    return {
      leftBound,
      rightBound,
    }
  }

  // resize 计算在track上允许resize的时间范围, 即校验要resize的时间范围是否是允许的
  private _calcResizeEditableTimeRange(props: {
    timeRange: TimeRange
    clipElementId: string
    trackId: string
  }): TimeRange | undefined {
    const { timeRange, clipElementId, trackId } = props

    const rangeBound = this._calcBoundInTrack({ timeRange, clipElementId, trackId })
    if (!rangeBound) return undefined
    const { leftBound, rightBound } = rangeBound

    const ansRange: TimeRange = {
      start: Math.max(0, timeRange.start),
      end: timeRange.end,
    }

    if (rightBound) {
      ansRange.end = Math.min(rightBound, timeRange.end)
    }
    if (leftBound) {
      ansRange.start = Math.max(leftBound, timeRange.start)
    }

    return ansRange
  }

  // drop 计算出在track上允许drop的时间范围, 即校验要drop的时间范围是否是允许的
  private _calcDropEditableTimeRange(props: {
    timeRange: TimeRange
    clipElementId: string
    trackId: string
  }): TimeRange | undefined {
    const { timeRange, clipElementId, trackId } = props

    const rangeBound = this._calcBoundInTrack({ timeRange, clipElementId, trackId })
    if (!rangeBound) return
    const { leftBound, rightBound } = rangeBound

    let ansRange: TimeRange | undefined = {
      start: Math.max(0, timeRange.start),
      end: timeRange.end,
    }
    const timeLength = timeRange.end - timeRange.start
    if (!leftBound && rightBound) {
      if (rightBound < timeLength) return undefined
      const end = Math.min(rightBound, timeRange.end)
      const start = end - timeLength
      if (start < 0) {
        ansRange = {
          start: 0,
          end: timeLength,
        }
      } else {
        ansRange = {
          start,
          end,
        }
      }
    }
    if (leftBound && !rightBound) {
      const start = Math.max(leftBound, timeRange.start)
      ansRange = {
        start,
        end: start + timeLength,
      }
    }
    if (leftBound && rightBound) {
      if (rightBound - leftBound < timeLength) return undefined
      const start = Math.min(rightBound - timeLength, Math.max(leftBound, timeRange.start))

      ansRange = {
        start,
        end: start + timeLength,
      }
    }

    return ansRange
  }

  // 根据trackId获取除目标元素(ignoreElementId)外所有track上元素的range
  private _getAllTrackRangesExceptSelf(trackId: string, ignoreElementId: string) {
    const track = this._draftService.getTrackById(trackId)
    if (!track) return undefined

    return track.clips
      .map(clip => {
        const el = this._draftService.getElementById(clip.elementId)
        if (el.id === ignoreElementId) return undefined

        return {
          start: el.start,
          end: el.start + el.length,
        }
      })
      .filter(Boolean)
      .sort((a, b) => a.start - b.start)
  }

  // 将像素范围的变化转换为时间范围的变化
  private _transformPixelRangeToTimeRange(props: PixelRange): TimeRange {
    const { start, width } = props
    const pixelPerSecond = this._vc.state.pixelPerSecond

    return {
      start: start / pixelPerSecond,
      end: (start + width) / pixelPerSecond,
    }
  }

  // 根据偏移量, 计算出在Timeline上的像素范围, 帧对齐: 内部保证偏移量都是帧数的整数倍
  private _calcFrameAlignedPixelBounds(props: {
    offset: { left: number; right: number }
    clipElementId: string
  }): PixelRange {
    const { offset, clipElementId } = props

    const clipElement = this._draftService.getElementById(clipElementId)
    const pixelPerSecond = this._vc.state.pixelPerSecond

    const leftNewOffset = this._formatRoundByFrame(offset.left)
    const start = clipElement.start * pixelPerSecond + leftNewOffset
    const width = this._formatRoundByFrame(
      clipElement.length * pixelPerSecond - leftNewOffset + offset.right
    )

    return {
      start,
      width,
    }
  }

  // 帧对齐边界: 按照帧数对target四舍五入, 保证每一次的偏移量都是帧数的整数倍
  private _formatRoundByFrame(target: number) {
    const pixelPerSecond = this._vc.state.pixelPerSecond
    const pixelPerFrame = pixelPerSecond / this._draftService.fps

    return Math.round(target / pixelPerFrame) * pixelPerFrame
  }
}
