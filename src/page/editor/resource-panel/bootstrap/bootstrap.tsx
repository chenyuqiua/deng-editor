import { useState } from 'react'
import { ResourcePanelViewController } from '../view-controller'
import { ResourcePanelContextProvider } from './react-context'
import { getDraftService } from '../../util/service'
import { getPlayerService } from '../../util/service'

export function ResourcePanelBootstrap({ children }: { children: React.ReactNode }) {
  const draftService = getDraftService()
  const playerService = getPlayerService()
  const [vc] = useState(() => new ResourcePanelViewController(draftService, playerService))

  return <ResourcePanelContextProvider vc={vc}>{children}</ResourcePanelContextProvider>
}
