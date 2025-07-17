import type { StoreApi } from 'zustand'
import { createDecorator } from '../bootstrap/instantiation'
import type { DraftStoreType } from './draft-service'

export const IDraftService = createDecorator<IDraftService>('DraftService')
export interface IDraftService {
  readonly store: StoreApi<DraftStoreType>
  state: DraftStoreType
  setState: (updater: (state: DraftStoreType) => void) => void
}
