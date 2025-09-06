import { generateUuid } from '@/common/util/uuid'
import type { Track } from '@/lib/remotion/editor-render/schema/track'
import type { AllElementTypeAttribute } from '@/lib/remotion/editor-render/schema/util'
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
    let insertTrack = this.getInsertTrackByType(insertElement.type, insertElement.length)

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
   * 根据元素类型和长度获取插入的轨道, 会对轨道进行空位检查, 从下层轨道往上层检查, 如果找到空位则返回该轨道, 否则返回 undefined
   * @param insertType 元素类型
   * @param insertLength 元素长度
   * @returns 插入的轨道
   */
  getInsertTrackByType(
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
}
