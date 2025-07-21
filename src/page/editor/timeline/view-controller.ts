import { BasicState } from '@/common/class/basic-state'
import _ from 'lodash'
import type { IDraftService } from '../service/draft-service.type'

const initialState = {
  // 1秒在Timeline上占多少像素
  pixelPerSecond: 300,
}

type TimelineViewControllerState = typeof initialState

export class TimelineViewController extends BasicState<TimelineViewControllerState> {
  constructor(private readonly _draftService: IDraftService) {
    super(initialState)
  }

  getClipPixelRange(props: { offset: { left: number; right: number }; clipElementId: string }) {
    const { offset, clipElementId } = props

    const clipElement = this._draftService.getElementById(clipElementId)
    const pixelPerSecond = this.state.pixelPerSecond
    if (!clipElement) return

    const pixelRange = this._calcFrameAlignedPixelBounds({ offset, clipElementId })
    if (pixelRange.start < 0) return
    const timeRange = this._transformPixelRangeToTimeRange(pixelRange)

    const resizeEditableRange = this._calcResizeEditableRange({
      timeRange,
      clipElementId,
      direction: 'left',
    })
    if (!resizeEditableRange) return
    const { start, end } = resizeEditableRange

    return {
      start: start * pixelPerSecond,
      width: (end - start) * pixelPerSecond,
    }
  }

  // 计算在track上可的编辑范围
  private _calcResizeEditableRange(props: {
    timeRange: { start: number; length: number }
    clipElementId: string
    direction?: 'left' | 'right'
  }) {
    const { timeRange: _range, clipElementId } = props
    if (!_range || _range.start > _range.start + _range.length) return undefined
    const timeRange = {
      start: _range.start,
      end: _range.start + _range.length,
    }

    const trackRanges = this._getAllTrackRangesExceptSelf(clipElementId)
    if (!trackRanges) return undefined

    const leftBound = _.findLast(trackRanges, r => r.start < timeRange.start)?.end
    const rightBound = trackRanges.find(r => r.end > timeRange.end)?.start

    // TODO:
    // const inTargetRangeRanges = trackRanges.filter(
    //   usedRange => usedRange.start >= timeRange.start && usedRange.end <= timeRange.end
    // )
    // if (inTargetRangeRanges.length > 0) {
    //   if (direction === 'left') {
    //     leftBoundRange = inTargetRangeRanges.at(-1)
    //   } else {
    //     rightBoundRange = inTargetRangeRanges[0]
    //   }
    // }

    const ansRange = {
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

  // 获取除自身外所有track上元素的range
  private _getAllTrackRangesExceptSelf(elementId: string, ignoreSelf: boolean = true) {
    const track = this._draftService.getTrackByElementId(elementId)
    if (!track) return undefined

    return track.clips
      .map(clip => {
        const el = this._draftService.getElementById(clip.elementId)
        if (ignoreSelf && el.id === elementId) return undefined

        return {
          start: el.start,
          end: el.start + el.length,
        }
      })
      .filter(Boolean)
      .sort((a, b) => a.start - b.start)
  }

  // 将像素范围的变化转换为时间范围的变化
  private _transformPixelRangeToTimeRange(props: { start: number; width: number }) {
    const { start, width } = props
    const pixelPerSecond = this.state.pixelPerSecond

    return {
      start: start / pixelPerSecond,
      length: width / pixelPerSecond,
    }
  }

  // 根据偏移量, 计算出在Timeline上的像素范围, 帧对齐: 内部保证偏移量都是帧数的整数倍
  private _calcFrameAlignedPixelBounds(props: {
    offset: { left: number; right: number }
    clipElementId: string
  }) {
    const { offset, clipElementId } = props

    const clipElement = this._draftService.getElementById(clipElementId)
    const pixelPerSecond = this.state.pixelPerSecond

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
    const pixelPerSecond = this.state.pixelPerSecond
    const pixelPerFrame = pixelPerSecond / this._draftService.fps

    return Math.round(target / pixelPerFrame) * pixelPerFrame
  }
}
