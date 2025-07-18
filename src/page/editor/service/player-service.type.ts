import type { EditorPlayerRef } from '@/lib/remotion/editor-render/player'
import type { StoreApi } from 'zustand'
import { createDecorator } from '../bootstrap/instantiation'
import type { PlayerStoreStateType } from './player-service'

export const IPlayerService = createDecorator<IPlayerService>('PlayerService')
export interface IPlayerService {
  readonly store: StoreApi<PlayerStoreStateType>
  state: PlayerStoreStateType
  player: EditorPlayerRef['player']
  isPlaying: boolean

  setState: (updater: (state: PlayerStoreStateType) => void) => void
  setPlayer: (player: EditorPlayerRef['player'] | null) => void
  play: () => void
  pause: () => void
  toggle: () => void
}
