import { useState } from 'react'
import { ResourcePanelViewController } from '../view-controller'
import { ResourcePanelContextProvider } from './react-context'

export function ResourcePanelBootstrap({ children }: { children: React.ReactNode }) {
  const [vc] = useState(() => new ResourcePanelViewController())

  return <ResourcePanelContextProvider vc={vc}>{children}</ResourcePanelContextProvider>
}
