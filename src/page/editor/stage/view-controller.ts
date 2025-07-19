import type { IPlayerService } from '../service/player-service.type'
import type { IDraftService } from '../service/draft-service.type'
import { InteractionManager } from './manager/interaction-manager'
import type { IEditorService } from '../service/editor-service.type'

export class StageViewController {
  readonly interactionManager: InteractionManager

  constructor(
    private readonly _draftService: IDraftService,
    private readonly _playerService: IPlayerService,
    private readonly _editorService: IEditorService
  ) {
    this.interactionManager = new InteractionManager(
      this._draftService,
      this._playerService,
      this._editorService
    )
  }
}
