import type { StoreApi } from 'zustand'
import { createDecorator } from '../bootstrap/instantiation'
import type { EditorStoreStateType } from './editor-service'

export const IEditorService = createDecorator<IEditorService>('EditorService')
export interface IEditorService {
  readonly store: StoreApi<EditorStoreStateType>
  state: EditorStoreStateType

  setState: (updater: (state: EditorStoreStateType) => void) => void
  onStateChange: (
    listener: (data: EditorStoreStateType, preData: EditorStoreStateType) => void
  ) => () => void
  setSelectElementId: (id?: string) => void
}
