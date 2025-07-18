import type { StoreApi } from 'zustand'
import { createDecorator } from '../bootstrap/instantiation'
import type { DraftStoreStateType } from './draft-service'

export const IDraftService = createDecorator<IDraftService>('DraftService')
export interface IDraftService {
  readonly store: StoreApi<DraftStoreStateType>
  state: DraftStoreStateType
  setState: (updater: (state: DraftStoreStateType) => void) => void
}
