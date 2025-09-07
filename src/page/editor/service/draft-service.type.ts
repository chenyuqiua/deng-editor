import type { AllAsset } from '@/lib/remotion/editor-render/schema/asset'
import type {
  DraftDataType,
  MetaType,
  TimelineType,
} from '@/lib/remotion/editor-render/schema/draft'
import type { AllDisplayElement, AllElement } from '@/lib/remotion/editor-render/schema/element'
import type { Track } from '@/lib/remotion/editor-render/schema/track'
import type { TransitionType } from '@/lib/remotion/editor-render/schema/transition'
import type {
  AllAssetTypeAttribute,
  AllElementTypeAttribute,
  AssetOfType,
  ElementOfType,
} from '@/lib/remotion/editor-render/schema/util'
import type { StoreApi } from 'zustand'
import { createDecorator } from '../bootstrap/instantiation'
import type { DraftStoreStateType } from './draft-service'

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
  getTrackById: (id: string) => Track | undefined
  getTrackByElementId: (id: string) => Track | undefined
  addTrack: (track: Track) => void
  getAssetById: <T extends AllAssetTypeAttribute>(id: string, type?: T) => AssetOfType<T>
  //#region element 相关的操作方法 未来也许会拆分出去
  getElementById: <T extends AllElementTypeAttribute>(id: string, type?: T) => ElementOfType<T>
  /**
   * @description 获取轨道上所有的元素
   * @param track 目标轨道
   * @returns 轨道上的所有元素
   */
  getTrackAllElements: (track: Track) => AllElement[]
  addElement: (element: AllElement) => void
  updateElement: <T extends AllElement>(id: string, element: Partial<Omit<T, 'id'>>) => void
  updateDisplayElement: (id: string, element: Partial<AllDisplayElement>) => void
  moveElementToTrack: (elementId: string, trackId: string) => void
  addElementToTrack: (elementId: string, trackId: string) => void
  addAsset: (asset: AllAsset) => void
  addTransition: (id: string, transition: TransitionType) => void
  //#endregion
}
