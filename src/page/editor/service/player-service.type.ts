import type { EditorPlayerRef } from '@/lib/remotion/editor-render/player'
import type { StoreApi } from 'zustand'
import { createDecorator } from '../bootstrap/instantiation'
import type { PlayerStoreStateType } from './player-service'
import type { AllElement } from '@/lib/remotion/editor-render/schema/element'

export const IPlayerService = createDecorator<IPlayerService>('PlayerService')
export interface IPlayerService {
  readonly store: StoreApi<PlayerStoreStateType>
  state: PlayerStoreStateType
  player: EditorPlayerRef['player']
  isPlaying: boolean

  setState: (updater: (state: PlayerStoreStateType) => void) => void
  onStateChange: (
    listener: (data: PlayerStoreStateType, preData: PlayerStoreStateType) => void
  ) => () => void
  setPlayer: (player: EditorPlayerRef['player'] | null) => void
  play: () => void
  pause: () => void
  toggle: () => void
  /**
   * @description 检查元素是否在当前播放时间中显示
   * @param element 元素
   * @returns 是否在当前时间显示
   */
  checkElementDisplayInCurrentTime: (element: AllElement) => boolean
}
