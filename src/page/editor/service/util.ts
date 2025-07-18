import type { ServiceIdentifier } from '../bootstrap/instantiation'
import { DraftService } from '../service/draft-service'
import { IDraftService } from '../service/draft-service.type'
import { PlayerService } from './player-service'
import { IPlayerService } from './player-service.type'

export const getAllServicesForRegister = (): [ServiceIdentifier<unknown>, unknown][] => {
  const draftService = new DraftService()
  const playerService = new PlayerService(draftService)

  return [
    [IDraftService, draftService],
    [IPlayerService, playerService],
  ]
}
