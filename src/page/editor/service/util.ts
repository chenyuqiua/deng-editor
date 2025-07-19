import type { ServiceIdentifier } from '../bootstrap/instantiation'
import { DraftService } from '../service/draft-service'
import { IDraftService } from '../service/draft-service.type'
import { EditorService } from './editor-service'
import { IEditorService } from './editor-service.type'
import { PlayerService } from './player-service'
import { IPlayerService } from './player-service.type'

export const getAllServicesForRegister = (): [ServiceIdentifier<unknown>, unknown][] => {
  const draftService = new DraftService()
  const playerService = new PlayerService(draftService)
  const editorService = new EditorService()

  return [
    [IDraftService, draftService],
    [IPlayerService, playerService],
    [IEditorService, editorService],
  ]
}
