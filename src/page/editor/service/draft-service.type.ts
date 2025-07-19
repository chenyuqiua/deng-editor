import type {
  DraftDataType,
  MetaType,
  TimelineType,
} from '@/lib/remotion/editor-render/schema/draft'
import type { StoreApi } from 'zustand'
import { createDecorator } from '../bootstrap/instantiation'
import type { DraftStoreStateType } from './draft-service'
import type {
  AllElementTypeAttribute,
  ElementOfType,
} from '@/lib/remotion/editor-render/schema/util'

export const IDraftService = createDecorator<IDraftService>('DraftService')
export interface IDraftService {
  readonly store: StoreApi<DraftStoreStateType>
  state: DraftStoreStateType
  draft: DraftDataType
  timeline: TimelineType
  meta: MetaType
  fps: number
  duration: number

  setState: (updater: (state: DraftStoreStateType) => void) => void
  onStateChange: (
    listener: (data: DraftStoreStateType, preData: DraftStoreStateType) => void
  ) => () => void
  getElementById: <T extends AllElementTypeAttribute>(id: string, type?: T) => ElementOfType<T>
}
