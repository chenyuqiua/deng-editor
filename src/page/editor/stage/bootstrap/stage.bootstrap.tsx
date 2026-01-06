import { useState } from 'react'
import { getDraftService, getEditorService, getPlayerService } from '../../util/service'
import { StageViewController } from '../view-controller'
import { StageContextProvider } from '../context/stage.context'

export function StageBootstrap({ children }: { children: React.ReactNode }) {
  const draftService = getDraftService()
  const playerService = getPlayerService()
  const editorService = getEditorService()
  const [vc] = useState(new StageViewController(draftService, playerService, editorService))

  return <StageContextProvider vc={vc}>{children}</StageContextProvider>
}

