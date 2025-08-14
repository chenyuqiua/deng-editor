import type { AllElement } from '@/lib/remotion/editor-render/schema/element'
import type { IDraftService } from '../service/draft-service.type'
import type { IPlayerService } from '../service/player-service.type'
import type { Track } from '@/lib/remotion/editor-render/schema/track'
import { generateUuid } from '@/common/util/uuid'
import type {
  AllAssetTypeAttribute,
  AllElementTypeAttribute,
} from '@/lib/remotion/editor-render/schema/util'
import { createImageAssetByUrl, createImageElementByAsset, createTextElement } from '../util/asset'
import type { AllAsset } from '@/lib/remotion/editor-render/schema/asset'
import { assert } from '@/common/util/assert'

export class DraftOperationManager {
  constructor(
    private readonly _draftService: IDraftService,
    private readonly _playerService: IPlayerService
  ) {}

  // TODO: 这里是模拟创建一个元素 逻辑还需完善
  async createElement({ type, url }: { type: AllElementTypeAttribute; url: string }) {
    const currentTime = this._playerService.state.currentTime
    let asset: AllAsset
    let element: AllElement

    switch (type) {
      case 'image':
        asset = await createImageAssetByUrl(url)
        this._draftService.addAsset(asset)
        element = await createImageElementByAsset(asset, { start: currentTime })
        break
      case 'text':
        element = createTextElement('default text', { start: currentTime })
        break
      default:
        assert(false, `Unsupported element type: ${type}`)
    }

    return element
  }

  async insertElement({ type, url }: { type: AllAssetTypeAttribute; url: string }) {
    const insertElement = await this.createElement({ type, url })
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
