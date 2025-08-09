import type { IDraftService } from '../service/draft-service.type'
import type { IEditorService } from '../service/editor-service.type'
import type { IPlayerService } from '../service/player-service.type'
import { AnimationManager } from './manager/animation-manager'

export class SettingPanelViewController {
  animationManager: AnimationManager
  constructor(
    private readonly _draftService: IDraftService,
    private readonly _editorService: IEditorService,
    private readonly _playerService: IPlayerService
  ) {
    this.animationManager = new AnimationManager(
      this._draftService,
      this._editorService,
      this._playerService
    )
  }
}
