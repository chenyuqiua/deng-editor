import type { AllElement } from './element'

export type AllElementTypeAttribute = AllElement['type']
export type ElementOfType<T extends AllElementTypeAttribute> = Extract<AllElement, { type: T }>
