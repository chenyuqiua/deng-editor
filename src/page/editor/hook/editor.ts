import { useZustand } from 'use-zustand'
import type { EditorStoreStateType } from '../service/editor-service'
import { getEditorService } from '../util/service'

export function useEditorSelector<T>(selector: (editor: EditorStoreStateType) => T) {
  const editorService = getEditorService()
  return useZustand(editorService.store, selector)
}
