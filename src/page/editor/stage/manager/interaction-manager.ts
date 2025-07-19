import type { RefObject } from 'react'
import Moveable from 'moveable'
import type { IDraftService } from '../../service/draft-service.type'
import type { PlayerStoreStateType } from '../../service/player-service'
import type { IPlayerService } from '../../service/player-service.type'
import { observeElementSize } from '@/common/util/dom'
import type { EditorStoreStateType } from '../../service/editor-service'
import type { IEditorService } from '../../service/editor-service.type'

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
    this._refreshMoveableListeners()
  }

  private _onPointerMove(e: PointerEvent) {
    console.log(e, 'pointermove')
  }

  private _onPointerLeave(e: PointerEvent) {
    console.log(e, 'pointerleave')
  }

  private _onPointerDown(e: PointerEvent) {
    // TODO: 功能还不完善
    const playerPoint = this._playerService.clientPointToPlayerPoint({
      x: e.clientX,
      y: e.clientY,
    })

    if (!playerPoint) return
    const draftElement = this._playerService.findElementsByPoint(playerPoint).at(0)
    if (!draftElement) return

    this._updateClickMoveableTarget(draftElement.id)
  }

  private _updateMoveableOnSizeChange() {
    console.log('updateMoveableOnSizeChange')
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

  private _refreshMoveableListeners() {
    console.log('refreshMoveableListeners')
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
