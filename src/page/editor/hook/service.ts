import { useServices } from '../bootstrap/context'
import { IDraftService } from '../service/draft-service.type'
import { IPlayerService } from '../service/player-service.type'

export function useDraftService() {
  return useServices(IDraftService)
}

export function usePlayerService() {
  return useServices(IPlayerService)
}
