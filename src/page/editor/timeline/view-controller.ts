import { BasicState } from '@/common/class/basic-state'
import type { IDraftService } from '../service/draft-service.type'

const initialState = {}

type TimelineViewControllerState = typeof initialState

export class TimelineViewController extends BasicState<TimelineViewControllerState> {
  constructor(private readonly _draftService: IDraftService) {
    super(initialState)
  }
}
