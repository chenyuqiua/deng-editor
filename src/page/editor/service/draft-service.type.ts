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
import type { AllDisplayElement, AllElement } from '@/lib/remotion/editor-render/schema/element'
import type { Track } from '@/lib/remotion/editor-render/schema/track'

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
  getTrackById: (id: string) => Track | undefined
  getTrackByElementId: (id: string) => Track | undefined
  updateElement: <T extends AllElement>(id: string, element: Partial<Omit<T, 'id'>>) => void
  updateDisplayElement: (id: string, element: Partial<AllDisplayElement>) => void
  moveElementToTrack: (elementId: string, trackId: string) => void
}
