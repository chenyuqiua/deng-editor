import type { RefObject } from 'react'
import Moveable from 'moveable'
import type { IDraftService } from '../../service/draft-service.type'
import type { PlayerStoreStateType } from '../../service/player-service'
import type { IPlayerService } from '../../service/player-service.type'
import { observeElementSize } from '@/common/util/dom'
import type { EditorStoreStateType } from '../../service/editor-service'
import type { IEditorService } from '../../service/editor-service.type'
import { isHitControlBox, refreshClickMoveableListeners } from '../../util/interaction'

type InitOptions = {
  interactionRef: RefObject<HTMLDivElement | null>
}

export class InteractionManager {
  private _disposers: (() => void)[] = []
  private _hoverMoveable: Moveable | null = null
  private _clickMoveable: Moveable | null = null

  private _selectElementId: string | undefined = undefined
  private _isPlaying = false

  constructor(
    private readonly _draftService: IDraftService,
    private readonly _playerService: IPlayerService,
    private readonly _editorService: IEditorService
  ) {}

  init(options: InitOptions) {
    const { interactionRef } = options

    this._disposers.push(this._playerService.onStateChange(this._onPlayerStateChange.bind(this)))
    this._disposers.push(this._editorService.onStateChange(this._onEditorStateChange.bind(this)))

    const interactionDom = interactionRef.current
    const parentDom = interactionDom?.parentElement
    if (!interactionDom || !parentDom) return

    this._hoverMoveable = new Moveable(parentDom, { origin: false })
    this._clickMoveable = new Moveable(parentDom, {
      origin: false,
      renderDirections: ['nw', 'ne', 'sw', 'se'],
      rotatable: true,
      scalable: true,
      rotationPosition: 'bottom',
      draggable: true,
      keepRatio: true,
      useMutationObserver: true,
      useResizeObserver: true,
      snappable: true,
      snapDirections: {
        left: true,
        top: true,
        right: true,
        bottom: true,
        center: true,
        middle: true,
      },
      elementSnapDirections: {
        left: true,
        top: true,
        right: true,
        bottom: true,
        center: true,
        middle: true,
      },
      elementGuidelines: ['.__remotion-player'],
      snapRotationThreshold: 2,
      snapRotationDegrees: [0, 90, 180, 270],
      isDisplaySnapDigit: false,
    })

    const pointerMoveEventListener = this._onPointerMove.bind(this)
    interactionDom.addEventListener('pointermove', pointerMoveEventListener)
    this._disposers.push(() => {
      interactionDom.removeEventListener('pointermove', pointerMoveEventListener)
    })

    const pointerLeaveEventListener = this._onPointerLeave.bind(this)
    interactionDom.addEventListener('pointerleave', pointerLeaveEventListener)
    this._disposers.push(() => {
      interactionDom.removeEventListener('pointerleave', pointerLeaveEventListener)
    })

    const pointerDownEventListener = this._onPointerDown.bind(this)
    interactionDom.addEventListener('pointerdown', pointerDownEventListener)
    this._disposers.push(() => {
      interactionDom.removeEventListener('pointerdown', pointerDownEventListener)
    })

    this._disposers.push(
      observeElementSize(interactionDom, this._updateMoveableOnSizeChange.bind(this))
    )
  }

  destroy() {
    this._disposers.forEach(disposer => disposer())
    this._disposers = []
    this._hoverMoveable?.destroy()
    this._clickMoveable?.destroy()
    this._hoverMoveable = null
    this._clickMoveable = null
  }

  private _onPlayerStateChange(state: PlayerStoreStateType, preState: PlayerStoreStateType) {
    if (state.isPlaying === preState.isPlaying) return
    this._isPlaying = state.isPlaying
    this._updateClickMoveableByState()
  }

  private _onEditorStateChange(state: EditorStoreStateType, preState: EditorStoreStateType) {
    if (state.selectElementId === preState.selectElementId) return

    this._selectElementId = state.selectElementId
    this._updateClickMoveableByState()
    // this._refreshClickMoveableListeners()
    refreshClickMoveableListeners(this._clickMoveable, state.selectElementId)
  }

  private _onPointerMove(e: PointerEvent) {
    let currentDomEl: HTMLElement | null | undefined = null

    if (!this._isPlaying) {
      const playerPoint = this._playerService.clientPointToPlayerPoint({
        x: e.clientX,
        y: e.clientY,
      })
      if (playerPoint) {
        const draftItem = this._playerService.findElementsByPoint(playerPoint).at(0)
        if (draftItem) {
          currentDomEl = this._playerService.getElementDomById(draftItem.id)
        }
      }
    }

    if (this._clickMoveable?.target === currentDomEl || this._clickMoveable?.isDragging()) {
      currentDomEl = null
    }

    if (this._hoverMoveable && this._hoverMoveable?.target !== currentDomEl) {
      this._hoverMoveable.target = currentDomEl
    }
  }

  private _onPointerLeave() {
    if (!this._hoverMoveable) return
    this._hoverMoveable.target = null
    this._hoverMoveable.updateRect()
  }

  private _onPointerDown(e: PointerEvent) {
    const moveable = this._clickMoveable
    // 只处理左键点击
    if (this._isPlaying || e.button !== 0 || !moveable) return

    let domEl: HTMLElement | undefined | null = undefined
    let draftItem: { id: string } | undefined = undefined
    const playerPoint = this._playerService.clientPointToPlayerPoint({
      x: e.clientX,
      y: e.clientY,
    })

    // Moveable需要调用dragStart方法来激活拖拽
    const startDrag = () => {
      let stop = false
      window.addEventListener(
        'pointerup',
        () => {
          stop = true
        },
        { once: true }
      )

      setTimeout(() => {
        if (stop) return
        if (!moveable?.target) return
        moveable.dragStart(e)
      }, 10)
    }

    if (playerPoint) {
      draftItem = this._playerService.findElementsByPoint(playerPoint).at(0)
      if (draftItem) {
        domEl = this._playerService.getElementDomById(draftItem.id)
      }
    }

    // 如果点击的元素是已经被选中的元素, 那么直接激活拖拽并return
    if ((!playerPoint && isHitControlBox(moveable, e)) || (domEl && domEl === moveable?.target)) {
      startDrag()
      return
    }

    /*
     更新selectElementId调用_updateClickMoveableByState来更新 click_moveable
     这里无需再对click_moveable进行更新
    */
    this._editorService.setSelectElementId(draftItem?.id)

    // 激活拖拽, 实现点拖
    startDrag()
  }

  private _updateMoveableOnSizeChange() {
    // wait for the dom update
    setTimeout(() => {
      this._hoverMoveable?.updateRect()
      this._clickMoveable?.updateRect()
    }, 50)
  }

  private _updateClickMoveableByState() {
    if (!this._clickMoveable) return

    const selectElement = this._selectElementId
      ? this._draftService.getElementById(this._selectElementId)
      : undefined

    if (
      !selectElement ||
      this._isPlaying ||
      !this._playerService.checkElementDisplayInCurrentTime(selectElement)
    ) {
      this._clickMoveable.target = null
      this._clickMoveable.updateRect()
      return
    }

    this._updateClickMoveableTarget(selectElement.id)
  }

  private _updateClickMoveableTarget(elementId: string) {
    if (!this._clickMoveable) return
    const moveable = this._clickMoveable
    const domEl = this._playerService.getElementDomById(elementId)
    const draftEl = this._draftService.getElementById(elementId)
    if (!domEl) return
    moveable.target = domEl
    if (draftEl.type === 'text') {
      moveable.keepRatio = false
      moveable.resizable = true
      moveable.scalable = false
      moveable.renderDirections = ['w', 'e']
    } else {
      moveable.scalable = true
      moveable.keepRatio = true
      moveable.resizable = false
      moveable.renderDirections = ['nw', 'ne', 'sw', 'se']
    }
    moveable.updateRect()
  }
}
