import { useServices } from '../bootstrap/context'
import { IDraftService } from '../service/draft-service.type'

export function useDraftService() {
  return useServices(IDraftService)
}
