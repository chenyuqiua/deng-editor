import { BasicState } from '@/common/class/basic-state'
import type { IDraftService } from '../service/draft-service.type'
import { RangeManager } from './manager/range-manager'

const initialState = {
  // 1秒在Timeline上占多少像素
  pixelPerSecond: 300,
}

type TimelineViewControllerState = typeof initialState

export class TimelineViewController extends BasicState<TimelineViewControllerState> {
  // 时间刻度尺容器的Dom元素
  private _scaleDom: HTMLDivElement | null = null
  rangeManager: RangeManager

  constructor(private readonly _draftService: IDraftService) {
    super(initialState)
    this.rangeManager = new RangeManager(this._draftService, this)
  }

  get scaleDom() {
    return this._scaleDom
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

  updatePixelPerSecond(newVal: number) {
    this.setState(s => {
      s.pixelPerSecond = newVal
    })
  }

  setScaleDom(dom: HTMLDivElement | null) {
    this._scaleDom = dom
  }
}
