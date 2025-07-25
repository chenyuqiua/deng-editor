import { useZustand } from 'use-zustand'
import type { PlayerStoreStateType } from '../service/player-service'
import { getPlayerService } from '../util/service'

export function usePlayerSelector<T>(selector: (draft: PlayerStoreStateType) => T) {
  const playerService = getPlayerService()
  return useZustand(playerService.store, selector)
}
