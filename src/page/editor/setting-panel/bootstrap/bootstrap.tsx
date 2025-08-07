import { useState } from 'react'
import { getDraftService, getEditorService } from '../../util/service'
import { SettingPanelViewController } from '../view-controller'
import { SettingPanelContextProvider } from './react-context'

export function SettingPanelBootstrap({ children }: { children: React.ReactNode }) {
  const draftService = getDraftService()
  const editorService = getEditorService()
  const [vc] = useState(new SettingPanelViewController(draftService, editorService))

  return <SettingPanelContextProvider vc={vc}>{children}</SettingPanelContextProvider>
}
