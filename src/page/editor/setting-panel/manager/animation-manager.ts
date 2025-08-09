import { BasicState } from '@/common/class/basic-state'
import type {
  AnimationCategory,
  AnimationDataType,
  AnimationType,
} from '@/lib/remotion/editor-render/schema/animation'
import type { IDraftService } from '../../service/draft-service.type'
import type { IEditorService } from '../../service/editor-service.type'
import { getElementById } from '../../util/draft'
import { assert } from '@/common/util/assert'
import type { AllElement } from '@/lib/remotion/editor-render/schema/element'
import type { IPlayerService } from '../../service/player-service.type'
import { animations as registeredRenderAnimation } from '@/lib/remotion/editor-render/animation/conllection'
import { noop } from 'lodash'

const initialState = {
  /* 当前选中的元素*/
  selectElement: undefined as AllElement | undefined,
}

type AnimationManagerState = typeof initialState

export class AnimationManager extends BasicState<AnimationManagerState> {
  private _animationPreviewCleaner: (() => void) | null = noop

  constructor(
    private readonly _draftService: IDraftService,
    private readonly _editorService: IEditorService,
    private readonly _playerService: IPlayerService
  ) {
    super(initialState)
    this._editorService.onStateChange((data, preData) => {
      if (data.selectElementId !== preData.selectElementId) {
        this._syncCurrentElementAnimation(data.selectElementId)
      }
    })
  }

  private _syncCurrentElementAnimation(selectElementId?: string) {
    const selectElement = selectElementId
      ? getElementById(this._draftService.state.draft, selectElementId)
      : undefined
    this.setState(s => {
      s.selectElement = selectElement
    })
  }

  // animation相关的暂时放在vc中, 未来也许会拆分到manager中
  updateByType(animationType: AnimationCategory, animation: AnimationType) {
    const selectElementId = this._editorService.state.selectElementId
    assert(!!selectElementId, 'selectElementId is required')

    const newAnimation = { ...this.state.selectElement?.animation }
    newAnimation[animationType] = animation
    this._draftService.updateElement(selectElementId, { animation: newAnimation })
    this._syncCurrentElementAnimation(selectElementId)
  }

  preview(animationType: AnimationCategory, animation: AnimationType) {
    const selectElement = this.state.selectElement
    if (!selectElement || !animation.name) return

    this._setAnimationTemplateData({ [animationType]: animation })

    if (animationType === 'loop') {
      const start = selectElement.start
      const cleaner = this._playerService.playerTemplateData(
        [start, start + selectElement.length],
        0
      )
      this._animationPreviewCleaner = cleaner
    }
    const animationDuration = registeredRenderAnimation.getAnimationDuration(animation, {
      type: animationType,
    })
    if (animationType === 'in') {
      const start = selectElement.start
      const cleaner = this._playerService.playerTemplateData([start, start + animationDuration], 1)
      this._animationPreviewCleaner = cleaner
    }

    if (animationType === 'out') {
      const start = Math.max(selectElement.start, selectElement.length - animationDuration)
      const cleaner = this._playerService.playerTemplateData([start, start + animationDuration], 0)
      this._animationPreviewCleaner = cleaner
    }
  }

  previewEnd() {
    this._animationPreviewCleaner?.()
    this._animationPreviewCleaner = noop
    if (this.state.selectElement) {
      this._setAnimationTemplateData(null)
    }
  }

  private _setAnimationTemplateData(animationData: AnimationDataType | null) {
    const selectElementId = this._editorService.state.selectElementId
    assert(!!selectElementId, 'selectElementId is required')
    this._playerService.context?.handler[selectElementId]?.['setTemplateData' as const]?.({
      animation: animationData,
    })
  }
}
