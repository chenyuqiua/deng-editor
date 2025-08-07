import { BasicState } from '@/common/class/basic-state'
import type { IDraftService } from '../service/draft-service.type'
import type { IEditorService } from '../service/editor-service.type'
import { getElementById } from '../util/draft'
import { assert } from '@/common/util/assert'
import type { AnimationCategory } from '../type/animation'
import type {
  AnimationDataType,
  AnimationType,
} from '@/lib/remotion/editor-render/schema/animation'

const initialState = {
  currentElementAnimation: undefined as AnimationDataType | undefined,
}

type SettingPanelViewControllerState = typeof initialState

export class SettingPanelViewController extends BasicState<SettingPanelViewControllerState> {
  constructor(
    private readonly _draftService: IDraftService,
    private readonly _editorService: IEditorService
  ) {
    super(initialState)
    this._editorService.onStateChange((data, preData) => {
      if (data.selectElementId !== preData.selectElementId) {
        this._syncCurrentElementAnimation(data.selectElementId)
      }
    })
  }

  private _syncCurrentElementAnimation(selectElementId?: string) {
    const animation = selectElementId
      ? getElementById(this._draftService.state.draft, selectElementId).animation
      : undefined
    this.setState(s => {
      s.currentElementAnimation = animation
    })
  }

  // animation相关的暂时放在vc中, 未来也许会拆分到manager中
  updateAnimationByType(animationType: AnimationCategory, animation: AnimationType) {
    const selectElementId = this._editorService.state.selectElementId
    assert(!!selectElementId, 'selectElementId is required')

    const newAnimation = { ...this.state.currentElementAnimation }
    newAnimation[animationType] = animation
    this._draftService.updateElement(selectElementId, { animation: newAnimation })
    this._syncCurrentElementAnimation(selectElementId)
  }
}
