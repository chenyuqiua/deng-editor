export type SupportMediaType = 'image' | 'video' | 'audio'

export type ImageMeta = {
  type: 'image'
  width: number
  height: number
}

export type AudioMeta = {
  type: 'audio'
  duration: number
  playBackRate: number
  title: string | null
}

export type VideoMeta = {
  type: 'video'
  width: number
  height: number
  duration: number
}

type MetaMap = {
  image: ImageMeta
  audio: AudioMeta
  video: VideoMeta
}

type MediaMetaData = Record<SupportMediaType, MetaMap[SupportMediaType]>[SupportMediaType]

export type MediaMetaDataOfType<T extends SupportMediaType> = Extract<MediaMetaData, { type: T }>
