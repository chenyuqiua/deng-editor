import { BasicState } from '@/common/class/basic-state'
import type { DraftDataType } from '@/lib/remotion/editor-render/schema/draft'
import type { IDraftService } from './draft-service.type'
import type { AllElementTypeAttribute } from '@/lib/remotion/editor-render/schema/util'
import { getElementById } from '../util/draft'
import { isDisplayElement } from '@/lib/remotion/editor-render/util/draft'
import type { AllDisplayElement, AllElement } from '@/lib/remotion/editor-render/schema/element'
import { ElementTypeError } from '../error/element-type-error'
import { ElementNotFoundError } from '../error/element-not-found-error'

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

  getElementById = <T extends AllElementTypeAttribute>(id: string, type?: T) => {
    return getElementById(this.draft, id, type)
  }

  updateElement<T extends AllElement>(id: string, element: Partial<Omit<T, 'id'>>) {
    this.setState(state => {
      const rawElement = getElementById(state.draft, id)
      if (!rawElement) throw new ElementNotFoundError({ id })
      Object.assign(rawElement, element)
    })
  }

  updateDisplayElement(id: string, element: Partial<AllDisplayElement>) {
    const fullElem = this.getElementById(id)
    if (!isDisplayElement(fullElem)) {
      throw new ElementTypeError(fullElem, 'DisplayElement')
    }
    this.updateElement(id, element)
  }
}
