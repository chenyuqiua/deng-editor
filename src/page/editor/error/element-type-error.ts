import type { AllElementTypeAttribute } from '@/lib/remotion/editor-render/schema/util'
import type { ElementFeature } from '../type/error'

export class ElementTypeError extends Error {
  public element: ElementFeature

  constructor(element: ElementFeature, require: string | AllElementTypeAttribute) {
    super(`Element with ID ${element.id}(${element.type ?? ''}) is not of type ${require}.`)
    this.name = 'ElementTypeError'
    this.element = element
  }
}
