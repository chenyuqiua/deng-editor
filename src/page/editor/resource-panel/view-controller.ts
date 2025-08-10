import { BasicState } from '@/common/class/basic-state'
import { ResourcePanelPageEnum } from './type/page'

const initialState = {
  currentPage: ResourcePanelPageEnum.ASSETS as ResourcePanelPageEnum,
  panelFold: false,
}

type ResourcePanelViewControllerState = typeof initialState

export class ResourcePanelViewController extends BasicState<ResourcePanelViewControllerState> {
  constructor() {
    super(initialState)
  }
}
