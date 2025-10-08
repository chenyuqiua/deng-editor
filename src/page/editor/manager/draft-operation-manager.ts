import { generateUuid } from '@/common/util/uuid'
import type { AllDisplayElement } from '@/lib/remotion/editor-render/schema/element'
import type { Track } from '@/lib/remotion/editor-render/schema/track'
import type { AllElementTypeAttribute } from '@/lib/remotion/editor-render/schema/util'
import { isDisplayTrack } from '@/lib/remotion/editor-render/util/draft'
import { getTransitionId } from '@/lib/remotion/editor-render/util/transition'
import { elementToTrackTypeMap } from '../constant/element'
import type { IDraftService } from '../service/draft-service.type'
import type { IPlayerService } from '../service/player-service.type'
import type { InsertPayload } from '../type/element'
import { createElement } from '../util/element'
import { isOverlap } from '../util/timeline'

export class DraftOperationManager {
  constructor(
    private readonly _draftService: IDraftService,
    private readonly _playerService: IPlayerService
  ) {}

  async insertElement(payload: InsertPayload) {
    const { asset, element: insertElement } = await createElement(
      payload,
      this._playerService.state.currentTime
    )
    if (asset) this._draftService.addAsset(asset)
    this._draftService.addElement(insertElement)
    let insertTrack = this.getInsertElementTrackByType(insertElement.type, insertElement.length)

    if (insertTrack) {
      this._draftService.addElementToTrack(insertElement.id, insertTrack.id)
    } else {
      insertTrack = {
        id: generateUuid(),
        type: elementToTrackTypeMap[insertElement.type],
        clips: [{ elementId: insertElement.id }],
      }
      this._draftService.addTrack(insertTrack)
    }
  }

  /**
   * @description 根据元素类型和长度, 获取可以插入的轨道
   * 会对轨道进行空位检查, 从下层轨道往上层检查, 如果找到空位则返回该轨道, 否则返回 undefined
   * @param insertType 元素类型
   * @param insertLength 元素长度
   * @returns 插入的轨道
   */
  getInsertElementTrackByType(
    insertType: AllElementTypeAttribute,
    insertLength: number
  ): Track | undefined {
    const insertTrack = this._draftService.timeline.tracks.find(i => {
      const currentTrackType = elementToTrackTypeMap[insertType]
      const currentTime = this._playerService.state.currentTime
      const insertTimeRange = { start: currentTime, end: currentTime + insertLength }

      if (i.type === currentTrackType) {
        const isCanInsert = i.clips.every(clip => {
          const clipElement = this._draftService.getElementById(clip.elementId)
          return !isOverlap(
            { start: clipElement.start, end: clipElement.start + clipElement.length },
            insertTimeRange
          )
        })
        return isCanInsert
      }
      return false
    })
    return insertTrack
  }

  /**
   * @description 插入转场动画, 默认根据currentTime找到有连续片段的元素, 插入转场动画(从下层轨道往上层轨道依次检查)
   */
  async insertTransition() {
    const elements = this.getInsertTransitionElements()
    if (!elements) return console.error('当前位置无连续片段, 无法插入转场动画')
    const [fromElement, toElement] = elements
    const transitionId = getTransitionId(fromElement.id, toElement.id)
    this._draftService.addTransition(transitionId, {
      name: 'slide',
      duration: 1000,
      ease: 'easeInOut',
    })
  }

  /**
   * @description 根据当前位置(currentTime), 获取插入转场动画的元素
   * 规则: 从下层轨道往上层轨道依次检查, 查找轨道中是否有在当前时间点上显示的连续片段, 如果有则返回该片段
   * @returns 可以插入转场动画的元素
   */
  getInsertTransitionElements() {
    const currentTime = this._playerService.state.currentTime
    const tracks = this._draftService.timeline.tracks
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i]
      if (!isDisplayTrack(track)) continue
      const allElements = this._draftService.getTrackAllElements(track) as AllDisplayElement[]
      // 获取当前时间点上显示的元素, 以及当前时间点上显示的元素的下一个元素
      let currentElement: AllDisplayElement | undefined
      let nextElement: AllDisplayElement | undefined

      // 根据当前时间点, 获取当前时间点上显示的元素, 以及当前时间点上显示的元素的下一个元素
      allElements.forEach((el, index) => {
        if (el.start <= currentTime && el.start + el.length >= currentTime) {
          currentElement = el
          nextElement = index < allElements.length - 1 ? allElements[index + 1] : undefined
        }
      })

      // 检查当前元素和下一个元素是否连续
      if (
        !currentElement ||
        !nextElement ||
        currentElement.start + currentElement.length !== nextElement.start
      )
        continue

      return [currentElement, nextElement]
    }
  }
}
