import { BasicState } from '@/common/class/basic-state'
import { ResourcePanelPageEnum } from './type/page'
import { DraftOperationManager } from '../manager/draft-operation-manager'
import type { IDraftService } from '../service/draft-service.type'
import type { IPlayerService } from '../service/player-service.type'

const initialState = {
  currentPage: ResourcePanelPageEnum.ASSETS as ResourcePanelPageEnum,
  panelFold: false,
}

type ResourcePanelViewControllerState = typeof initialState

export class ResourcePanelViewController extends BasicState<ResourcePanelViewControllerState> {
  readonly draftOperationManager: DraftOperationManager
  constructor(
    private readonly _draftService: IDraftService,
    private readonly _playerService: IPlayerService
  ) {
    super(initialState)
    this.draftOperationManager = new DraftOperationManager(_draftService, _playerService)
  }
}
