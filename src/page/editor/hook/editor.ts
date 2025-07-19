import { useZustand } from 'use-zustand'
import type { EditorStoreStateType } from '../service/editor-service'
import { useEditorService } from './service'

export function useEditorSelector<T>(selector: (editor: EditorStoreStateType) => T) {
  const editorService = useEditorService()
  return useZustand(editorService.store, selector)
}
