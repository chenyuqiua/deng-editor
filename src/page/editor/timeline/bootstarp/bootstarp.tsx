import { useDraftService } from '../../hook/service'
import { TimelineViewController } from '../view-controller'
import { TimelineContextProvider } from './react-context'

export function TimelineBootstrap({ children }: { children: React.ReactNode }) {
  const draftService = useDraftService()
  const vc = new TimelineViewController(draftService)

  return <TimelineContextProvider vc={vc}>{children}</TimelineContextProvider>
}
