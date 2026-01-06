import { createContext, useContext } from 'react'
import { ResourcePanelViewController } from '../view-controller'

const BootstrapContext = createContext<{
  vc: ResourcePanelViewController
}>({
  vc: {} as ResourcePanelViewController,
})

export function ResourcePanelContextProvider({
  vc,
  children,
}: {
  vc: ResourcePanelViewController
  children: React.ReactNode
}) {
  return <BootstrapContext.Provider value={{ vc }}>{children}</BootstrapContext.Provider>
}

export function useResourcePanelViewController() {
  const { vc } = useContext(BootstrapContext)
  if (!vc) {
    throw new Error(
      'ResourcePanelViewController is not found, you should use ResourcePanelContextProvider to wrap your component'
    )
  }

  return vc
}
