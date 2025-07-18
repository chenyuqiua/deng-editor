import { useZustand } from 'use-zustand'
import type { DraftStoreStateType } from '../service/draft-service'
import { useDraftService } from './service'

export function useDraftSelector<T>(selector: (draft: DraftStoreStateType) => T) {
  const draftService = useDraftService()
  return useZustand(draftService.store, selector)
}
