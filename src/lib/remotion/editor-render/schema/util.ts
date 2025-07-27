import type { AllAsset } from './asset'
import type { AllElement } from './element'

export type AllElementTypeAttribute = AllElement['type']
export type ElementOfType<T extends AllElementTypeAttribute> = Extract<AllElement, { type: T }>
export type AllAssetTypeAttribute = AllAsset['type']
export type AssetOfType<T extends AllAssetTypeAttribute> = Extract<AllAsset, { type: T }>
