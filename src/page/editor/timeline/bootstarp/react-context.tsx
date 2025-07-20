import { createContext, useContext } from 'react'
import { TimelineViewController } from '../view-controller'

const BootstrapContext = createContext<{
  vc: TimelineViewController
}>({
  vc: {} as TimelineViewController,
})

export function TimelineContextProvider({
  vc,
  children,
}: {
  vc: TimelineViewController
  children: React.ReactNode
}) {
  return <BootstrapContext.Provider value={{ vc }}>{children}</BootstrapContext.Provider>
}

export function useTimelineViewController() {
  const { vc } = useContext(BootstrapContext)

  return vc
}
