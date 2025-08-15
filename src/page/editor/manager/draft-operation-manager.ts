import type { IDraftService } from '../service/draft-service.type'
import type { IPlayerService } from '../service/player-service.type'
import type { Track } from '@/lib/remotion/editor-render/schema/track'
import { generateUuid } from '@/common/util/uuid'
import { createElement } from '../util/element'
import type { InsertPayload } from '../type/element'

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
    let insertTrack = this.getInsertTrackByElement(insertElement.length)

    console.log(insertTrack, 'insertTrack')
    if (insertTrack) {
      this._draftService.addElementToTrack(insertElement.id, insertTrack.id)
    } else {
      // TODO: 逻辑需要修改
      insertTrack = {
        id: generateUuid(),
        type: 'text',
        clips: [{ elementId: insertElement.id }],
      }
      this._draftService.addTrack(insertTrack)
    }
  }

  getInsertTrackByElement(insertLength: number): Track | undefined {
    console.log(this._draftService.state.draft.timeline.tracks)
    const textTrack = [...this._draftService.state.draft.timeline.tracks].reverse().find(i => {
      if (i.type === 'text') {
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
