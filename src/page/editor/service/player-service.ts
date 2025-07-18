import { BasicState } from '@/common/class/basic-state'
import type { IPlayerService } from './player-service.type'

const initialState = {
  isPlaying: false,
  isBuffing: false,
  currentTime: 0,
}
export type PlayerStoreStateType = typeof initialState

export class PlayerService extends BasicState<PlayerStoreStateType> implements IPlayerService {
  constructor() {
    super(initialState)
  }
}
