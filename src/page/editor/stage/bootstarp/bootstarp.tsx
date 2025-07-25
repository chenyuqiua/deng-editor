import { getDraftService, getEditorService, getPlayerService } from '../../util/service'
import { StageViewController } from '../view-controller'
import { StageContextProvider } from './react-context'

export function StageBootstrap({ children }: { children: React.ReactNode }) {
  const draftService = getDraftService()
  const playerService = getPlayerService()
  const editorService = getEditorService()
  const vc = new StageViewController(draftService, playerService, editorService)

  return <StageContextProvider vc={vc}>{children}</StageContextProvider>
}
