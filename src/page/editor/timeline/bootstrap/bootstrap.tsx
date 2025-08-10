import { useState } from 'react'
import { getDraftService } from '../../util/service'
import { TimelineViewController } from '../view-controller'
import { TimelineContextProvider } from './react-context'

export function TimelineBootstrap({ children }: { children: React.ReactNode }) {
  const draftService = getDraftService()
  const [vc] = useState(new TimelineViewController(draftService))

  return <TimelineContextProvider vc={vc}>{children}</TimelineContextProvider>
}
