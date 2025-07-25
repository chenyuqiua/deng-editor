import type { EditorPlayerRef } from '@/lib/remotion/editor-render/player'
import type { StoreApi } from 'zustand'
import { createDecorator } from '../bootstrap/instantiation'
import type { PlayerStoreStateType } from './player-service'
import type { AllDisplayElement, AllElement } from '@/lib/remotion/editor-render/schema/element'
import type { Point } from '@/lib/remotion/editor-render/schema/common'

export const IPlayerService = createDecorator<IPlayerService>('PlayerService')
export interface IPlayerService {
  readonly store: StoreApi<PlayerStoreStateType>
  state: PlayerStoreStateType
  player: EditorPlayerRef['player']
  context: EditorPlayerRef['context'] | null
  isPlaying: boolean

  setState: (updater: (state: PlayerStoreStateType) => void) => void
  onStateChange: (
    listener: (data: PlayerStoreStateType, preData: PlayerStoreStateType) => void
  ) => () => void
  setPlayer: (player: EditorPlayerRef['player'] | null) => void
  setContext: (context: EditorPlayerRef['context'] | null) => void
  play: () => void
  pause: () => void
  toggle: () => void
  /**
   * @description 检查元素是否在当前播放时间中显示
   * @param element 元素
   * @returns 是否在当前时间显示
   */
  checkElementDisplayInCurrentTime: (element: AllElement) => boolean
  /**
   * @description 将客户端坐标转换为画布坐标, 也就是remotion的中心点坐标
   * @param point 客户端坐标
   * @returns 在画布中的坐标, 如果不在画布中则返回undefined
   */
  clientPointToPlayerPoint: (point: Point) => Point | undefined
  /**
   * @description 判断当前点击的坐标是否在元素的范围内
   * @param point 当前点击的坐标, 需要传入播放器坐标
   * @param element 判断的元素
   * @param playerScale 播放器缩放比例, 默认使用当前播放器的缩放比例
   * @returns 是否在元素的范围内
   */
  hitTest: (point: Point, element: AllDisplayElement, playerScale?: number) => boolean
  /**
   * @description 获取当前点击的元素, 只能获取到当前时间显示的元素
   * @param point 当前点击的坐标, 需要传入播放器坐标
   * @returns 当前点击的元素数组
   */
  findElementsByPoint: (point: Point) => AllDisplayElement[]
  getElementDomById: (elementId: string) => HTMLElement | undefined
  seekToFrame: (frame: number) => void
}
