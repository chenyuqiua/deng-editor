import { useZustand } from 'use-zustand'
import type { PlayerStoreStateType } from '../service/player-service'
import { usePlayerService } from './service'

export function usePlayerSelector<T>(selector: (draft: PlayerStoreStateType) => T) {
  const playerService = usePlayerService()
  return useZustand(playerService.store, selector)
}
