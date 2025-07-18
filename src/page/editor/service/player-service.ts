import { BasicState } from '@/common/class/basic-state'
import type { EditorPlayerRef } from '@/lib/remotion/editor-render/player'
import type { DraftService } from './draft-service'
import type { IPlayerService } from './player-service.type'

const initialState = {
  isPlaying: false,
  isBuffing: false,
  currentTime: 0,
}
export type PlayerStoreStateType = typeof initialState

export class PlayerService extends BasicState<PlayerStoreStateType> implements IPlayerService {
  private _player: EditorPlayerRef['player'] | null = null
  private _playerEventListenerDisposers: (() => void)[] = []

  constructor(private readonly _draftService: DraftService) {
    super(initialState)
  }

  get player(): EditorPlayerRef['player'] | null {
    return this._player
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
