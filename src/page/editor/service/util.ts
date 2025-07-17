import { DraftService } from '../service/draft-service'
import { IDraftService } from '../service/draft-service.type'
import type { ServiceIdentifier } from '../bootstrap/instantiation'

export const getAllServicesForRegister = (): [ServiceIdentifier<unknown>, unknown][] => {
  return [[IDraftService, new DraftService()]]
}
