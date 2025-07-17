import { createDecorator } from '../bootstrap/instantiation'

export const IDraftService = createDecorator<IDraftService>('DraftService')
export interface IDraftService {
  readonly store: unknown
}
