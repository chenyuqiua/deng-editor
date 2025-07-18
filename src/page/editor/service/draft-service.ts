import { BasicState } from '@/common/class/basic-state'
import type { DraftDataType } from '@/lib/remotion/editor-render/schema/draft'
import type { IDraftService } from './draft-service.type'

const initialState = {
  draft: {
    timeline: { elements: {}, assets: {}, tracks: [], fonts: [] },
    meta: { fps: 30, width: 1920, height: 1080 },
    name: '',
  } as DraftDataType,
  duration: 0,
  frameDuration: 0,
}
export type DraftStoreStateType = typeof initialState

export class DraftService extends BasicState<DraftStoreStateType> implements IDraftService {
  constructor() {
    super(initialState)
  }

  get draft() {
    return this.state.draft
  }

  get timeline() {
    return this.state.draft.timeline
  }

  get meta() {
    return this.state.draft.meta
  }

  get fps() {
    return this.state.draft.meta.fps
  }

  get duration() {
    return this.state.duration
  }
}
