import { useState } from 'react'
import { getDraftService, getPlayerService } from '../../util/service'
import { TimelineViewController } from '../view-controller'
import { TimelineContextProvider } from './react-context'

export function TimelineBootstrap({ children }: { children: React.ReactNode }) {
  const draftService = getDraftService()
  const playerService = getPlayerService()
  const [vc] = useState(new TimelineViewController(draftService, playerService))

  return <TimelineContextProvider vc={vc}>{children}</TimelineContextProvider>
}
