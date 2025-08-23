import { BasicState } from '@/common/class/basic-state'
import _ from 'lodash'
import type { IDraftService } from '../service/draft-service.type'
import type { IPlayerService } from '../service/player-service.type'
import { RangeManager } from './manager/range-manager'

const initialState = {
  // 1秒在Timeline上占多少像素
  pixelPerSecond: 300,
}

type TimelineViewControllerState = typeof initialState

export class TimelineViewController extends BasicState<TimelineViewControllerState> {
  // 时间刻度尺容器的Dom元素
  private _scaleDom: HTMLDivElement | null = null
  // 时间游标Dom元素
  private _indicatorDom: HTMLDivElement | null = null
  rangeManager: RangeManager

  constructor(
    private readonly _draftService: IDraftService,
    private readonly _playerService: IPlayerService
  ) {
    super(initialState)
    this.rangeManager = new RangeManager(this._draftService, this)
  }

  get scaleDom() {
    return this._scaleDom
  }

  get indicatorDom() {
    return this._indicatorDom
  }

  // 根据当前鼠标的clientX, 计算出对应的帧数偏移量(时间游标移动的帧数时长)
  getFrameOffset(clientX: number) {
    const rect = this._scaleDom?.getBoundingClientRect()
    const scrollLeft = this._scaleDom?.scrollLeft ?? 0
    if (!rect) return
    const offset = Math.max(0, clientX + scrollLeft - rect.left)
    this._autoScrollOnTimelineEdgeHover(clientX)
    const frameOffset = Math.max(
      0,
      Math.round((offset / this.state.pixelPerSecond) * this._draftService.fps)
    )

    return frameOffset
  }

  // 移动时间游标
  moveIndicator(clientX: number) {
    const frameOffset = this.getFrameOffset(clientX)
    if (typeof frameOffset === 'undefined') return
    const pixelPerFrame = this.state.pixelPerSecond / this._draftService.fps
    if (!this._indicatorDom) return
    this._indicatorDom.style.left = `${frameOffset * pixelPerFrame}px`
    this._throttleSeekFrame(frameOffset)
  }

  // 派发时间游标指针按下事件
  dispatchIndicatorPointerDown(clientX: number) {
    this._indicatorDom?.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: false,
        cancelable: true,
        clientX,
      })
    )
  }
  updatePixelPerSecond(newVal: number) {
    this.setState(s => {
      s.pixelPerSecond = newVal
    })
  }

  setScaleDom(dom: HTMLDivElement | null) {
    this._scaleDom = dom
  }

  setIndicatorDom(dom: HTMLDivElement | null) {
    this._indicatorDom = dom
  }

  private _throttleSeekFrame(frameOffset: number) {
    const seekFrame = _.throttle(this._playerService.seekToFrame.bind(this._playerService), 100, {
      leading: true,
      trailing: true,
    })
    seekFrame(frameOffset)
  }

  /**
   * 当鼠标移动到时间轴的边缘时, 如果可以滚动, 则需要自动滚动时间轴
   */
  private _autoScrollOnTimelineEdgeHover(clientX: number) {
    if (!this._scaleDom) return
    const scrollLeft = this._scaleDom?.scrollLeft ?? 0
    const rect = this._scaleDom?.getBoundingClientRect()
    if (!rect) return

    // 如果鼠标在时间轴的左侧, 则需要根据鼠标位置的偏移量, 向左滚动时间轴
    if (clientX <= rect.left) this._scaleDom.scrollLeft = scrollLeft - (rect.left - clientX)
    // 如果鼠标在时间轴的右侧, 由于时间轴右侧贴着屏幕, 而鼠标无法移动到时间轴右侧, 所以自定义每次滚动20px
    if (clientX >= rect.right - 2) {
      const maxScrollLeft = this._scaleDom.scrollWidth - this._scaleDom.clientWidth
      const newScrollLeft = Math.min(scrollLeft + 20, maxScrollLeft)
      if (newScrollLeft < maxScrollLeft) this._scaleDom.scrollLeft = newScrollLeft
    }
  }
}
