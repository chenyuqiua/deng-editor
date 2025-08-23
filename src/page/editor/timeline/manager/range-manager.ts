import type { AllElement } from '@/lib/remotion/editor-render/schema/element'
import _ from 'lodash'
import type { IDraftService } from '../../service/draft-service.type'
import type { PixelRange, TimeRange } from '../../type/timeline'
import { isOverlap } from '../../util/timeline'
import type { TimelineViewController } from '../view-controller'

export class RangeManager {
  constructor(
    private readonly _draftService: IDraftService,
    private readonly _vc: TimelineViewController
  ) {}

  /**
   * 计算出可以resize的时间范围, undefined表示不允许resize
   * @param props.offset 偏移量, 单位为像素
   * @param props.clipElementId 要操作的元素id
   * @returns 返回可以resize的时间范围, 如果不允许resize, 则返回undefined
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
   * @param props.offset 偏移量, 单位为像素
   * @param props.clipElementId 要操作的元素id
   * @returns 返回可以resize的像素范围, 如果不允许resize, 则返回undefined
   */
  calcResizePixelRange(props: {
    offset: { left: number; right: number }
    clipElementId: string
  }): PixelRange | undefined {
    const { offset, clipElementId } = props

    const clipElement = this._draftService.getElementById(clipElementId)
    const pixelPerSecond = this._vc.state.pixelPerSecond
    if (!clipElement) return
    if (!this._canExtendElementDuration({ offset, clipElement })) return

    // 计算出当前元素要resize的像素范围, 并将像素范围转换为时间范围
    const pixelRange = this._calcFrameAlignedPixelBounds({ offset, clipElementId })

    if (pixelRange.start < 0) return
    const timeRange = this._transformPixelRangeToTimeRange(pixelRange)

    // 获取当前元素所在的track, 并计算出当前元素在track上可编辑的时间范围
    const track = this._draftService.getTrackByElementId(clipElementId)
    if (!track) return
    const resizeEditableRange = this._getResizeEditableTimeRange({
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
   * @param props.clipElementId 要操作的元素id
   * @param props.offsetLeft 偏移量, 单位为像素
   * @param props.trackId 要操作的轨道id
   * @returns 返回可以drop的时间范围, 如果不允许drop, 则返回undefined
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

    const alignStart = Math.max(0, draftEl.start + offsetLeft / this._vc.state.pixelPerSecond)
    const timeLength = draftEl.length
    // drop之后的时间范围
    const timeRange = { start: alignStart, end: alignStart + timeLength }

    const dropEditableRange = this._getDropEditableTimeRange({
      timeRange,
      clipElementId,
      trackId,
    })
    if (!dropEditableRange) return

    return dropEditableRange
  }

  /**
   * 检查元素是否超出原始资源长度, 如果超出, 则不允许继续将元素的时长延长
   * @param props.offset 偏移量, 单位为像素
   * @param props.clipElement 要检查的元素
   * @returns 如果元素可以继续延长, 则返回true; 否则返回false
   */
  private _canExtendElementDuration(props: {
    offset: { left: number; right: number }
    clipElement: AllElement
  }) {
    const { offset, clipElement } = props

    if (clipElement.type !== 'video' && clipElement.type !== 'audio') return true
    const asset = this._draftService.getAssetById(clipElement.assetId)
    if (asset.type !== 'video' && asset.type !== 'audio') return true

    const originalDuration = asset.duration
    const currentDuration = clipElement.length
    if (currentDuration >= originalDuration && (offset.left < 0 || offset.right > 0)) return false

    return true
  }

  /**
   * resize 计算获取在track上允许resize的时间范围, 即校验要resize的时间范围是否是允许的
   * 如果允许resize, 则返回允许resize的时间范围; 如果不允许resize, 则返回undefined
   */
  private _getResizeEditableTimeRange(props: {
    timeRange: TimeRange
    clipElementId: string
    trackId: string
  }): TimeRange | undefined {
    const { timeRange, clipElementId, trackId } = props
    // 如果原始timeRange可用, 则直接返回
    if (this._checkTimeRangeIsAvailableOnTrack({ timeRange, clipElementId, trackId }))
      return timeRange

    const ranges = this._findNeighborRangesOnTrack({ timeRange, clipElementId, trackId })
    if (!ranges) return undefined
    const leftBound = ranges.leftRange?.end
    const rightBound = ranges.rightRange?.start

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

    if (
      !this._checkTimeRangeIsAvailableOnTrack({
        timeRange: ansRange,
        clipElementId,
        trackId,
      })
    )
      return undefined

    return ansRange
  }

  /**
   * drop 计算出在track上允许drop的时间范围, 即校验要drop的时间范围是否是允许的
   * 如果允许drop, 则返回允许drop的时间范围; 如果不允许drop, 则返回undefined
   */
  private _getDropEditableTimeRange(props: {
    timeRange: TimeRange
    clipElementId: string
    trackId: string
  }): TimeRange | undefined {
    const { timeRange, clipElementId, trackId } = props
    // 如果原始 timeRange 就可用，直接返回它
    if (this._checkTimeRangeIsAvailableOnTrack({ timeRange, clipElementId, trackId }))
      return timeRange

    // 如果原始timeRange不可用, 则需要在track上计算出, 就近是否存在可以drop的时间范围
    const ranges = this._findNeighborRangesOnTrack({ timeRange, clipElementId, trackId })
    if (!ranges) return undefined
    const leftBound = ranges.leftRange?.end
    const rightBound = ranges.rightRange?.start
    const needLength = timeRange.end - timeRange.start

    let ansRange: TimeRange | undefined = undefined
    // 同时存在左右邻居：返回二者之间的空隙（若足够容纳）
    if (leftBound && rightBound) {
      if (rightBound - leftBound < needLength) return undefined

      if (timeRange.start <= leftBound) {
        ansRange = { start: leftBound, end: leftBound + needLength }
      } else {
        ansRange = { start: rightBound - needLength, end: rightBound }
      }
    }

    // 仅有右邻居：尝试靠左边界贴到右邻居左侧
    if (!leftBound && rightBound) {
      if (rightBound < needLength) return undefined
      ansRange = { start: rightBound - needLength, end: rightBound }
    }

    // 仅有左邻居：向右侧延伸一个目标长度
    if (leftBound && !rightBound) {
      ansRange = { start: leftBound, end: leftBound + needLength }
    }

    // 没有邻居, 说明timeRange上有重叠的元素, 则不允许操作
    if (!ansRange) return undefined

    // 最后对结果是否可用进行检查, 可能会有有重叠的元素
    if (
      !this._checkTimeRangeIsAvailableOnTrack({
        timeRange: ansRange,
        clipElementId,
        trackId,
      })
    )
      return undefined

    return ansRange
  }

  /**
   * 获取目标元素在track上的左右邻居
   * 在这个Manager中通常使用左右邻居的.end和.start作为边界, 但是这并不代表一个可操作的边界范围, 在这个范围中可能存在重叠的元素
   * @param props.timeRange 想要操作的元素的时间范围
   * @param props.clipElementId 想要操作的元素id
   * @param props.trackId 想要操作的目标轨道id
   * @returns 返回左右邻居的timeRange, 如果左右邻居不存在, 则返回undefined
   */
  private _findNeighborRangesOnTrack(props: {
    timeRange: TimeRange
    clipElementId: string
    trackId: string
  }): { leftRange: TimeRange | undefined; rightRange: TimeRange | undefined } | undefined {
    const { timeRange, clipElementId, trackId } = props

    if (!timeRange || timeRange.start > timeRange.end) return undefined

    const trackRanges = this._getAllTrackRangesExceptSelf(trackId, clipElementId)
    if (!trackRanges) return undefined

    const leftRange = _.findLast(trackRanges, r => r.start <= timeRange.start)
    const rightRange = trackRanges.find(r => r.end > timeRange.end)

    return {
      leftRange,
      rightRange,
    }
  }

  /**
   * 根据trackId获取除目标元素(ignoreElementId)外所有track上元素的range
   * @param trackId 要获取的track id
   * @param ignoreElementId 要忽略的元素 id
   * @returns 返回track上所有元素的range, 如果track上没有元素, 则返回undefined
   */
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

  /**
   * 检查传入的时间范围在目标track上是否可用 -> 通过是否存在重叠的元素判断, 相贴不算重叠,
   * @param props.timeRange 要检查的时间范围
   * @param props.clipElementId 要检查的元素id
   * @param props.trackId 要检查的track id
   * @returns 如果时间范围在track上可用, 则返回true; 否则返回false
   */
  private _checkTimeRangeIsAvailableOnTrack(props: {
    timeRange: TimeRange
    clipElementId: string
    trackId: string
  }): boolean {
    const { timeRange, clipElementId, trackId } = props

    const trackRanges = this._getAllTrackRangesExceptSelf(trackId, clipElementId)
    if (!trackRanges) return false
    if (trackRanges.length === 0) return true

    return trackRanges.findIndex(range => isOverlap(timeRange, range)) === -1
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

  // 根据偏移量, 计算出在Timeline上的像素范围, 内部帧对齐
  private _calcFrameAlignedPixelBounds(props: {
    offset: { left: number; right: number }
    clipElementId: string
  }): PixelRange {
    const { offset, clipElementId } = props

    const clipElement = this._draftService.getElementById(clipElementId)
    const pixelPerSecond = this._vc.state.pixelPerSecond

    const leftNewOffset = this._formatRoundByFrame(offset.left)
    const rightNewOffset = this._formatRoundByFrame(offset.right)

    // 计算出元素的开始和结束时间, 作为边界限制
    const elementStart = clipElement.start * pixelPerSecond
    const elementEnd = (clipElement.start + clipElement.length) * pixelPerSecond

    const start = Math.max(0, Math.min(elementStart + leftNewOffset, elementEnd - 20))
    const end = Math.max(elementEnd + rightNewOffset, start + 20)
    const width = end - start

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
