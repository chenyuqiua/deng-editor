import { useZustand } from 'use-zustand'
import { useServices } from '../bootstrap/context'
import { IDraftService } from '../service/draft-service.type'
import type { DraftStoreType } from '../service/draft-service'

export function useDraftSelector<T>(selector: (draft: DraftStoreType) => T) {
  const draftService = useServices(IDraftService)
  const store = draftService.store
  return useZustand(store, selector)
}
