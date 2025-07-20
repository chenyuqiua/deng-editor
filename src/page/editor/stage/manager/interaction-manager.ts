import type { RefObject } from 'react'
import Moveable from 'moveable'
import type { IDraftService } from '../../service/draft-service.type'
import type { PlayerStoreStateType } from '../../service/player-service'
import type { IPlayerService } from '../../service/player-service.type'
import { observeElementSize } from '@/common/util/dom'
import type { EditorStoreStateType } from '../../service/editor-service'
import type { IEditorService } from '../../service/editor-service.type'
import { isHitControlBox } from '../../util/interaction'
import _ from 'lodash'
import { isDisplayElement } from '@/lib/remotion/editor-render/util/draft'

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
    this._refreshClickMoveableListeners()
  }

  private _onPointerMove(e: PointerEvent) {
    console.log(e, 'pointermove')
  }

  private _onPointerLeave(e: PointerEvent) {
    console.log(e, 'pointerleave')
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

    // 如果选中了当前元素, 激活拖拽
    if ((!playerPoint && isHitControlBox(moveable, e)) || (domEl && domEl === moveable?.target)) {
      startDrag()
      return
    }

    /*
     更新selectElementId调用_updateClickMoveableByState来更新 click_moveable
     这里无需再对click_moveable进行更新
    */
    this._editorService.setSelectElementId(draftItem?.id)

    // TODO: 也许需要对hover_moveable进行处理
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

  private _refreshClickMoveableListeners() {
    const moveable = this._clickMoveable
    const selectedElementId = this._selectElementId
    if (!moveable || !selectedElementId) return
    moveable.off()
    console.log('refreshMoveableListeners', moveable.draggable)

    const getInitialDiff = () => {
      return {
        x: 0,
        y: 0,
        rotate: 0,
        scaleX: 1,
        scaleY: 1,
        width: 0,
        height: 0,
      }
    }

    const startData = { transform: '', width: 0, height: 0 }
    let diff = getInitialDiff()

    const handleStart = () => {
      console.log('handleStart')
      const targetEl = moveable.target as HTMLElement
      if (!targetEl) return

      // 保存初始数据
      const rect = moveable.getRect()
      startData.width = rect.offsetWidth
      startData.height = rect.offsetHeight
      startData.transform = targetEl.style.transform

      // 初始化差值
      diff = getInitialDiff()
    }
    // 这里只将变动更新到视图上, 对draft的更新需要等待dragEnd事件
    const handleUpdate = () => {
      const targetEl = moveable.target as HTMLElement
      if (!targetEl) return

      console.log(startData.transform, 'startData.transform')
      const [t1, t2] = startData.transform.split(' scale')

      // 保留原有的 translate 和 rotate, 但是会用新的对其覆盖
      targetEl.style.transform = `translate(${diff.x}px, ${diff.y}px) ${t1} rotate(${diff.rotate}deg) scale${t2} scale(${diff.scaleX},${diff.scaleY})`

      // 对resize的宽高进行处理
      if (moveable.resizable && Array.isArray(moveable.renderDirections)) {
        const renderDirections = moveable.renderDirections
        if (renderDirections.includes('w') || renderDirections.includes('e')) {
          targetEl.style.width = `${startData.width + diff.width}px`
        }

        if (renderDirections.includes('n') || renderDirections.includes('s')) {
          targetEl.style.height = `${startData.height + diff.height}px`
        }
      }
    }
    const handleEnd = () => {
      if (_.isEqual(diff, getInitialDiff())) return

      const draftEl = this._draftService.getElementById(selectedElementId)
      if (!draftEl || !isDisplayElement(draftEl)) return

      const data = {
        x: draftEl.x,
        y: draftEl.y,
        width: draftEl.width,
        height: draftEl.height,
        rotate: draftEl.rotate,
        scaleX: draftEl.scaleX,
        scaleY: draftEl.scaleY,
      }

      if (moveable.resizable && Array.isArray(moveable.renderDirections)) {
        const renderDirections = moveable.renderDirections
        if (renderDirections.includes('w') || renderDirections.includes('e')) {
          data.width = (data.width || startData.width) + diff.width
        }

        if (renderDirections.includes('n') || renderDirections.includes('s')) {
          data.height = (data.height || startData.height) + diff.height
        }
      }

      data.x += diff.x
      data.y += diff.y
      data.rotate += diff.rotate
      data.scaleX *= diff.scaleX
      data.scaleY *= diff.scaleY

      this._draftService.updateDisplayElement(selectedElementId, data)
    }

    moveable
      .on('dragStart', handleStart)
      .on('rotateStart', handleStart)
      .on('resizeStart', handleStart)
      .on('scaleStart', handleStart)
      .on('dragEnd', handleEnd)
      .on('rotateEnd', handleEnd)
      .on('resizeEnd', handleEnd)
      .on('scaleEnd', handleEnd)

    /*
      rotate -> data.delta -> 旋转角度的增量
      scale -> data.delta[0] -> x轴上缩放的增量
      scale -> data.delta[1] -> y轴上缩放的增量
      resize -> data.delta[0] -> 宽度增量
      resize -> data.delta[1] -> 高度增量
      data.drag.delta[0] -> 元素的中心点x的增量
      data.drag.delta[1] -> 元素的中心点y的增量
    */
    moveable.on('drag', data => {
      diff.x += data.delta[0]
      diff.y += data.delta[1]
      console.log(data.delta[0], data.delta[1], 'drag')
      handleUpdate()
    })
    moveable.on('rotate', data => {
      diff.rotate += data.delta
      handleUpdate()
    })
    moveable.on('scale', data => {
      diff.scaleX *= data.delta[0]
      diff.scaleY *= data.delta[1]
      diff.x += data.drag.delta[0]
      diff.y += data.drag.delta[1]
      handleUpdate()
    })
    moveable.on('resize', data => {
      diff.width += data.delta[0]
      diff.height += data.delta[1]
      diff.x += data.drag.delta[0]
      diff.y += data.drag.delta[1]
      handleUpdate()
    })
  }
}
