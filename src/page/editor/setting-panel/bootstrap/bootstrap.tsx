import { useState } from 'react'
import { getDraftService, getEditorService, getPlayerService } from '../../util/service'
import { SettingPanelViewController } from '../view-controller'
import { SettingPanelContextProvider } from './react-context'

export function SettingPanelBootstrap({ children }: { children: React.ReactNode }) {
  const draftService = getDraftService()
  const editorService = getEditorService()
  const playerService = getPlayerService()
  const [vc] = useState(new SettingPanelViewController(draftService, editorService, playerService))

  return <SettingPanelContextProvider vc={vc}>{children}</SettingPanelContextProvider>
}
