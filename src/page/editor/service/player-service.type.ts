import type { StoreApi } from 'zustand'
import { createDecorator } from '../bootstrap/instantiation'
import type { PlayerStoreStateType } from './player-service'

export const IPlayerService = createDecorator<IPlayerService>('PlayerService')
export interface IPlayerService {
  readonly store: StoreApi<PlayerStoreStateType>
  state: PlayerStoreStateType
  setState: (updater: (state: PlayerStoreStateType) => void) => void
}
