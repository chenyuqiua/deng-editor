import { createContext, useContext } from 'react'
import type { StageViewController } from '../view-controller'

const BootstrapContext = createContext<{
  vc: StageViewController
}>({
  vc: {} as StageViewController,
})

export function StageContextProvider({
  vc,
  children,
}: {
  vc: StageViewController
  children: React.ReactNode
}) {
  return <BootstrapContext.Provider value={{ vc }}>{children}</BootstrapContext.Provider>
}

export function useStageViewController() {
  const { vc } = useContext(BootstrapContext)

  return vc
}
