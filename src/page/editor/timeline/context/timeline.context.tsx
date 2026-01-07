import { createContext, useContext } from 'react'
import type { TimelineViewController } from '../view-controller'

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
  if (!vc) {
    throw new Error(
      'TimelineViewController is not found, you should use TimelineContextProvider to wrap your component'
    )
  }

  return vc
}
