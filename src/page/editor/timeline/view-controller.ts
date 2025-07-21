import { BasicState } from '@/common/class/basic-state'
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
}
