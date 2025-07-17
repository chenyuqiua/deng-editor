import type { IDraftService } from './draft-service.type'
import type { DraftDataType } from '@/lib/remotion/editor-render/schema/draft'
import { BasicState } from '@/common/class/basic-state'

const initialDraft: DraftDataType = {
  timeline: { elements: {}, assets: {}, tracks: [], fonts: [] },
  meta: { fps: 30, width: 1920, height: 1080 },
}
const initialState = { draft: initialDraft, duration: 0, frameDuration: 0 }

export type DraftStoreType = typeof initialState

export class DraftService extends BasicState<DraftStoreType> implements IDraftService {
  constructor() {
    super(initialState)
  }
}
