import type { AllElement } from '@/lib/remotion/editor-render/schema/element'
import type { IDraftService } from '../service/draft-service.type'
import type { IPlayerService } from '../service/player-service.type'
import type { Track } from '@/lib/remotion/editor-render/schema/track'
import { generateUuid } from '@/common/util/uuid'

export class DraftOperationManager {
  constructor(
    private readonly _draftService: IDraftService,
    private readonly _playerService: IPlayerService
  ) {}

  // TODO: 这里是模拟创建一个元素 逻辑还需完善
  createElement() {
    const element: AllElement = {
      id: generateUuid(),
      type: 'text',
      name: '',
      start: 0,
      length: 0.4,
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      rotate: 0,
      text: 'default text',
      assetId: '',
    }

    return element
  }

  insertElement() {
    const insertElement = this.createElement()
    this._draftService.addElement(insertElement)
    let insertTrack = this.getInsertTrackByElement(insertElement.length)

    console.log(insertTrack, 'insertTrack')
    if (insertTrack) {
      this._draftService.addElementToTrack(insertElement.id, insertTrack.id)
    } else {
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
