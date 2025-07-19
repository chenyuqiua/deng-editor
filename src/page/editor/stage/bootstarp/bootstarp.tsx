import { useDraftService, useEditorService, usePlayerService } from '../../hook/service'
import { StageViewController } from '../view-controller'
import { StageContextProvider } from './react-context'

export function StageBootstrap({ children }: { children: React.ReactNode }) {
  const draftService = useDraftService()
  const playerService = usePlayerService()
  const editorService = useEditorService()
  const vc = new StageViewController(draftService, playerService, editorService)

  return <StageContextProvider vc={vc}>{children}</StageContextProvider>
}
