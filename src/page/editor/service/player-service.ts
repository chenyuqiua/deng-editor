import { BasicState } from '@/common/class/basic-state'
import type { EditorPlayerRef } from '@/lib/remotion/editor-render/player'
import type { DraftService } from './draft-service'
import type { IPlayerService } from './player-service.type'
import type { AllDisplayElement, AllElement } from '@/lib/remotion/editor-render/schema/element'
import type { Point } from '@/lib/remotion/editor-render/schema/common'
import { isDisplayElement, shallowWalkTracksElement } from '@/lib/remotion/editor-render/util/draft'
import { pointRotate } from '../util/interaction'

const initialState = {
  isPlaying: false,
  isBuffing: false,
  currentTime: 0,
}
export type PlayerStoreStateType = typeof initialState

export class PlayerService extends BasicState<PlayerStoreStateType> implements IPlayerService {
  private _player: EditorPlayerRef['player'] | null = null
  private _context: EditorPlayerRef['context'] | null = null
  private _playerEventListenerDisposers: (() => void)[] = []

  constructor(private readonly _draftService: DraftService) {
    super(initialState)
  }

  get player(): EditorPlayerRef['player'] | null {
    return this._player
  }

  get context(): EditorPlayerRef['context'] | null {
    return this._context
  }

  get isPlaying() {
    return this.state.isPlaying
  }

  play(): void {
    return this._player?.play()
  }

  pause(): void {
    return this._player?.pause()
  }

  toggle(): void {
    return this._player?.isPlaying() ? this.pause() : this.play()
  }

  setPlayer(player: EditorPlayerRef['player'] | null): void {
    if (this._player === player) return

    // 清理之前的事件监听器
    this._playerEventListenerDisposers.forEach(fn => fn())
    this._playerEventListenerDisposers = []

    this._player = player
    this.setState(state => {
      state.isPlaying = false
      state.isBuffing = false
    })

    if (!this._player) return

    // 绑定事件处理器
    const handlePlay = this._onPlay.bind(this)
    const handlePause = this._onPause.bind(this)
    const handleTimeUpdate = this._onTimeUpdate.bind(this)
    const handleWaiting = this._onWaiting.bind(this)
    const handleResume = this._onResume.bind(this)

    // 添加事件监听器并保存清理函数
    this._player.addEventListener('play', handlePlay)
    this._playerEventListenerDisposers.push(() => {
      this._player?.removeEventListener('play', handlePlay)
    })

    this._player.addEventListener('pause', handlePause)
    this._playerEventListenerDisposers.push(() => {
      this._player?.removeEventListener('pause', handlePause)
    })

    this._player.addEventListener('ended', handlePause)
    this._playerEventListenerDisposers.push(() => {
      this._player?.removeEventListener('ended', handlePause)
    })

    this._player.addEventListener('error', handlePause)
    this._playerEventListenerDisposers.push(() => {
      this._player?.removeEventListener('error', handlePause)
    })

    this._player.addEventListener('frameupdate', handleTimeUpdate)
    this._playerEventListenerDisposers.push(() => {
      this._player?.removeEventListener('frameupdate', handleTimeUpdate)
    })

    this._player.addEventListener('waiting', handleWaiting)
    this._playerEventListenerDisposers.push(() => {
      this._player?.removeEventListener('waiting', handleWaiting)
    })

    this._player.addEventListener('resume', handleResume)
    this._playerEventListenerDisposers.push(() => {
      this._player?.removeEventListener('resume', handleResume)
    })
  }

  setContext(context: EditorPlayerRef['context'] | null): void {
    this._context = context
  }

  checkElementDisplayInCurrentTime(element: AllElement) {
    const { start, length } = element
    const time = this.state.currentTime
    return time >= start && time <= start + length
  }

  getElementDomById(elementId?: string) {
    if (!elementId) return undefined
    return this._context?.box[elementId]?.ref?.current || undefined
  }

  clientPointToPlayerPoint(clientPoint: Point) {
    const playerNode = this.player?.getContainerNode()?.children[0] as HTMLElement | undefined
    const scale = this.player?.getScale()
    if (!playerNode || !scale) {
      return
    }
    const rect = playerNode.getBoundingClientRect()

    // 转换为画布坐标
    const point = {
      x: clientPoint.x - rect.left,
      y: clientPoint.y - rect.top,
    }

    // 不在画布范围内直接return
    if (point.x < 0 || point.x > rect.width) {
      return
    }
    if (point.y < 0 || point.y > rect.height) {
      return
    }

    // 将坐标系原点由左上角改为中心点, 并等比缩放
    return {
      x: (point.x - rect.width / 2) / scale,
      y: (point.y - rect.height / 2) / scale,
    }
  }

  findElementsByPoint(point: Point) {
    const scale = this._player?.getScale()
    const time = this.state.currentTime
    if (!scale || time < 0) return []

    const elements: AllDisplayElement[] = []
    const draft = this._draftService.state.draft
    shallowWalkTracksElement(draft, draft.timeline.tracks, el => {
      if (
        !isDisplayElement(el) ||
        !this.checkElementDisplayInCurrentTime(el) ||
        !this.hitTest(point, el, scale)
      ) {
        return
      }

      elements.push(el)
    })

    return elements
  }

  hitTest(point: Point, element: AllDisplayElement, playerScale?: number) {
    const scale = playerScale ?? this.player?.getScale()
    if (!scale) return false

    const elementDom = this.context?.box[element.id]
    if (!elementDom?.ref?.current) return false
    const rect = elementDom?.ref.current?.getBoundingClientRect()
    if (!rect) return false

    const p1 = {
      x: point.x - element.x,
      y: point.y - element.y,
    }

    const style = window.getComputedStyle(elementDom.ref.current)
    const size = {
      width: Math.abs(Number(style.width.replace('px', '')) * element.scaleX),
      height: Math.abs(Number(style.height.replace('px', '')) * element.scaleY),
    }

    const anchorX = (element.anchor?.x || 0) / 100
    const anchorY = (element.anchor?.y || 0) / 100
    const p2 = pointRotate(p1, -((element.rotate / 180) * Math.PI))

    return (
      p2.x >= size.width * (-0.5 - anchorX) &&
      p2.x <= size.width * (0.5 - anchorX) &&
      p2.y >= size.height * (-0.5 - anchorY) &&
      p2.y <= size.height * (0.5 - anchorY)
    )
  }

  private _onPlay(): void {
    this.setState(state => {
      state.isPlaying = true
    })
  }

  private _onPause(): void {
    this.setState(state => {
      state.isPlaying = false
    })
  }

  private _onWaiting(): void {
    this.setState(state => {
      state.isBuffing = true
    })
  }

  private _onResume(): void {
    this.setState(state => {
      state.isBuffing = false
    })
  }

  private _onTimeUpdate(payload: { detail: { frame: number } }): void {
    const time = payload.detail.frame / this._draftService.meta.fps
    this.setState(state => {
      state.currentTime = time
    })
  }
}
