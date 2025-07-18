import { BasicState } from '@/common/class/basic-state'
import type { IDraftService } from './draft-service.type'

const initialState = {
  draft: {
    timeline: { elements: {}, assets: {}, tracks: [], fonts: [] },
    meta: { fps: 30, width: 1920, height: 1080 },
    name: '',
  },
  duration: 0,
  frameDuration: 0,
}
export type DraftStoreStateType = typeof initialState

export class DraftService extends BasicState<DraftStoreStateType> implements IDraftService {
  constructor() {
    super(initialState)
  }
}
