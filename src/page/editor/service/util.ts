import type { ServiceIdentifier } from '../bootstrap/instantiation'
import { DraftService } from '../service/draft-service'
import { IDraftService } from '../service/draft-service.type'
import { PlayerService } from './player-service'
import { IPlayerService } from './player-service.type'

export const getAllServicesForRegister = (): [ServiceIdentifier<unknown>, unknown][] => {
  return [
    [IDraftService, new DraftService()],
    [IPlayerService, new PlayerService()],
  ]
}
