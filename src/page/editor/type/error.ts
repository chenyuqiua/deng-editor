import type { AllAsset } from '@/lib/remotion/editor-render/schema/asset'
import type { AllElement } from '@/lib/remotion/editor-render/schema/element'
import type { Track } from '@/lib/remotion/editor-render/schema/track'

export type ElementFeature = Partial<AllElement>
export type TrackFeature = Partial<Track>
export type AssetFeature = Partial<AllAsset>
