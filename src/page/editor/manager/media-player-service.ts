export interface Playable {
  play(): void
  pause(): void
}

/**
 * @description 媒体播放器管理器, 解决多个媒体播放器同时播放的问题
 */
export class MediaPlayerManager {
  _serviceBrand: undefined

  private _currentPlayer: Playable | null = null
  private _onPause: (() => void) | null = null

  play(player?: Playable | null, onPause?: () => void) {
    if (player && player !== this._currentPlayer) {
      try {
        this.pause()
      } catch {
        // ignore pause error
      }
    }
    if (player) {
      this._currentPlayer = player
      this._onPause = onPause || null
    }
    return this._currentPlayer?.play()
  }

  pause() {
    this._currentPlayer?.pause()
    this._onPause?.()
  }
}
