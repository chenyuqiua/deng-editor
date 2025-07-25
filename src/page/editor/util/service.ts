import { getService } from '../bootstrap/context'
import { IDraftService } from '../service/draft-service.type'
import { IEditorService } from '../service/editor-service.type'
import { IPlayerService } from '../service/player-service.type'

export function getDraftService() {
  return getService(IDraftService)
}

export function getPlayerService() {
  return getService(IPlayerService)
}

export function getEditorService() {
  return getService(IEditorService)
}
