import { useZustand } from 'use-zustand'
import type { DraftStoreStateType } from '../service/draft-service'
import { getDraftService } from '../util/service'

export function useDraftSelector<T>(selector: (draft: DraftStoreStateType) => T) {
  const draftService = getDraftService()
  return useZustand(draftService.store, selector)
}
