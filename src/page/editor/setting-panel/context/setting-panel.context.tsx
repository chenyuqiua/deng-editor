import { createContext, useContext } from 'react'
import type { SettingPanelViewController } from '../view-controller'

const BootstrapContext = createContext<{
  vc: SettingPanelViewController
}>({
  vc: {} as SettingPanelViewController,
})

export function SettingPanelContextProvider({
  vc,
  children,
}: {
  vc: SettingPanelViewController
  children: React.ReactNode
}) {
  return <BootstrapContext.Provider value={{ vc }}>{children}</BootstrapContext.Provider>
}

export function useSettingPanelViewController() {
  const { vc } = useContext(BootstrapContext)
  if (!vc) {
    throw new Error(
      'SettingPanelViewController is not found, you should use SettingPanelContextProvider to wrap your component'
    )
  }
  return vc
}
