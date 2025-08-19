import { BasicState } from '@/common/class/basic-state'
import type { DraftDataType } from '@/lib/remotion/editor-render/schema/draft'
import type { AllDisplayElement, AllElement } from '@/lib/remotion/editor-render/schema/element'
import type {
  AllAssetTypeAttribute,
  AllElementTypeAttribute,
} from '@/lib/remotion/editor-render/schema/util'
import {
  calcDraftDurationInSeconds,
  isDisplayElement,
} from '@/lib/remotion/editor-render/util/draft'
import { ElementNotFoundError } from '../error/element-not-found-error'
import { ElementTypeError } from '../error/element-type-error'
import { getAssetById, getElementById, getTrackByElementId } from '../util/draft'
import type { IDraftService } from './draft-service.type'
import _ from 'lodash'
import { TrackNotFoundedError } from '../error/track-not-founded-error'
import type { Track } from '@/lib/remotion/editor-render/schema/track'
import type { AllAsset } from '@/lib/remotion/editor-render/schema/asset'

const initialState = {
  draft: {
    background: '#000',
    timeline: { elements: {}, assets: {}, tracks: [], fonts: [] },
    meta: { fps: 30, width: 1920, height: 1080 },
    name: '',
  } as DraftDataType,
  duration: 0,
  frameDuration: 0,
}
export type DraftStoreStateType = typeof initialState

export class DraftService extends BasicState<DraftStoreStateType> implements IDraftService {
  constructor() {
    super(initialState)

    this.onStateChange((state: typeof initialState, preState: typeof initialState) => {
      // TODO: frameDuration 也许也需要更新
      const isTracksChanged = !_.isEqual(
        state.draft.timeline.tracks,
        preState.draft.timeline.tracks
      )
      const isElementsChanged = !_.isEqual(
        state.draft.timeline.elements,
        preState.draft.timeline.elements
      )
      // 监听 tracks 和 elements 变化，自动更新 duration, 过滤掉没有元素的轨道
      if (isTracksChanged || isElementsChanged) {
        const duration = calcDraftDurationInSeconds(state.draft)
        this.setState(s => {
          s.duration = duration
          s.draft.timeline.tracks = isTracksChanged
            ? s.draft.timeline.tracks.filter(i => i.clips.length !== 0)
            : s.draft.timeline.tracks
        })
      }
    })
  }

  get draft() {
    return this.state.draft
  }

  get timeline() {
    return this.state.draft.timeline
  }

  get meta() {
    return this.state.draft.meta
  }

  get fps() {
    return this.state.draft.meta.fps
  }

  get duration() {
    return this.state.duration
  }

  getTrackById = (id: string) => {
    return this.draft.timeline.tracks.find(i => i.id === id)
  }

  getTrackByElementId = (id: string) => {
    return getTrackByElementId(this.draft, id)
  }

  addTrack(track: Track) {
    this.setState(state => {
      state.draft.timeline.tracks.unshift(track)
    })
  }

  getAssetById = <T extends AllAssetTypeAttribute>(id: string, type?: T) => {
    return getAssetById(this.draft, id, type)
  }

  //#region element 相关的操作方法 未来也许会拆分出去
  getElementById = <T extends AllElementTypeAttribute>(id: string, type?: T) => {
    return getElementById(this.draft, id, type)
  }

  addElement(element: AllElement) {
    this.setState(state => {
      state.draft.timeline.elements[element.id] = element
    })
  }

  updateElement<T extends AllElement>(id: string, element: Partial<Omit<T, 'id'>>) {
    this.setState(state => {
      const rawElement = getElementById(state.draft, id)
      if (!rawElement) throw new ElementNotFoundError({ id })
      Object.assign(rawElement, element)
    })
  }

  updateDisplayElement(id: string, element: Partial<AllDisplayElement>) {
    const fullElem = this.getElementById(id)
    if (!isDisplayElement(fullElem)) {
      throw new ElementTypeError(fullElem, 'DisplayElement')
    }
    this.updateElement(id, element)
  }

  moveElementToTrack(elementId: string, trackId: string) {
    const elementTrack = this.getTrackByElementId(elementId)
    if (!elementTrack) throw new TrackNotFoundedError({})
    if (elementTrack.id === trackId) return

    const tracks = this.draft.timeline.tracks
    const originTrackIndex = tracks.findIndex(i => i.id === elementTrack.id)
    const targetTrackIndex = tracks.findIndex(i => i.id === trackId)
    if (originTrackIndex === -1 || targetTrackIndex === -1) return

    const clip = tracks[originTrackIndex].clips.find(i => i.elementId === elementId)
    if (!clip) return

    this.setState(state => {
      const originTrack = state.draft.timeline.tracks[originTrackIndex]
      const targetTrack = state.draft.timeline.tracks[targetTrackIndex]
      if (!originTrack || !targetTrack) return

      originTrack.clips = originTrack.clips.filter(i => i.elementId !== elementId)
      targetTrack.clips.push(clip)
    })
  }

  addElementToTrack(elementId: string, trackId: string) {
    this.setState(state => {
      const track = state.draft.timeline.tracks.find(i => i.id === trackId)
      if (!track) throw new TrackNotFoundedError({ id: trackId })
      track.clips.push({ elementId })
    })
  }

  addAsset(asset: AllAsset) {
    this.setState(state => {
      state.draft.timeline.assets[asset.id] = asset
    })
  }

  //#endregion
}
