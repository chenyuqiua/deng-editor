import { useServices } from '../bootstrap/context'
import { IDraftService } from '../service/draft-service.type'
import { IEditorService } from '../service/editor-service.type'
import { IPlayerService } from '../service/player-service.type'

export function useDraftService() {
  return useServices(IDraftService)
}

export function usePlayerService() {
  return useServices(IPlayerService)
}

export function useEditorService() {
  return useServices(IEditorService)
}
