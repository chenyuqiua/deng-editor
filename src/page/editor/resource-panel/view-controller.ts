import { BasicState } from '@/common/class/basic-state'
import { ResourcePanelPageEnum } from './type/page'
import { DraftOperationManager } from '../manager/draft-operation-manager'
import type { IDraftService } from '../service/draft-service.type'
import type { IPlayerService } from '../service/player-service.type'
import { MediaPlayerManager } from '../manager/media-player-service'

const initialState = {
  currentPage: ResourcePanelPageEnum.ASSETS as ResourcePanelPageEnum,
  panelFold: false,
}

type ResourcePanelViewControllerState = typeof initialState

export class ResourcePanelViewController extends BasicState<ResourcePanelViewControllerState> {
  readonly draftOperationManager: DraftOperationManager
  readonly mediaPlayerManager: MediaPlayerManager
  constructor(
    private readonly _draftService: IDraftService,
    private readonly _playerService: IPlayerService
  ) {
    super(initialState)
    this.draftOperationManager = new DraftOperationManager(_draftService, _playerService)
    this.mediaPlayerManager = new MediaPlayerManager()
  }
}
