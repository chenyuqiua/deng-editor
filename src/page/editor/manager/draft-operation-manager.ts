import type { IDraftService } from '../service/draft-service.type'
import type { IPlayerService } from '../service/player-service.type'
import type { Track } from '@/lib/remotion/editor-render/schema/track'
import { generateUuid } from '@/common/util/uuid'
import { createElement } from '../util/element'
import type { InsertPayload } from '../type/element'
import type { AllElementTypeAttribute } from '@/lib/remotion/editor-render/schema/util'
import { elementToTrackTypeMap } from '../constant/element'

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
    const textTrack = [...this._draftService.state.draft.timeline.tracks].reverse().find(i => {
      if (i.type === insertType) {
        const isCanInsert = i.clips.some((clip, index) => {
          const currentTime = this._playerService.state.currentTime
          const clipElement = this._draftService.getElementById(clip.elementId)

          const nextClip = i.clips.at(index + 1)
          if (!nextClip)
            return (
              clipElement.start + clipElement.length <= currentTime ||
              clipElement.start >= currentTime + insertLength
            )
          const nextClipElement = this._draftService.getElementById(nextClip.elementId)

          return (
            clipElement.start + clipElement.length <= currentTime &&
            nextClipElement.start >= currentTime + insertLength
          )
        })
        return isCanInsert
      }
      return false
    })
    return textTrack
  }
}
