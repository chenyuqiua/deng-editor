import { BasicState } from '@/common/class/basic-state'
import type { IDraftService } from '../service/draft-service.type'
import { RangeManager } from './manager/range-manager'
import _ from 'lodash'
import type { IPlayerService } from '../service/player-service.type'

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
    if (!rect) return
    const offset = Math.min(Math.max(0, clientX - rect.left), rect.width)
    const frameOffset = Math.max(
      0,
      Math.round((offset / this.state.pixelPerSecond) * this._draftService.fps)
    )

    return frameOffset
  }

  // 移动时间游标
  moveIndicator(clientX: number) {
    const frameOffset = this.getFrameOffset(clientX)
    if (!frameOffset) return
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
}
