import type { TrackFeature } from '../type/error'

export class TrackNotFoundedError extends Error {
  public track: TrackFeature

  constructor(track: TrackFeature) {
    super(`Track with ID ${track.id}(${track.type ?? ''}) is not founded.`)
    this.name = 'TrackNotFoundedError'
    this.track = track
  }
}
