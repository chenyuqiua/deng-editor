import { BasicState } from '@/common/class/basic-state'
import type { IEditorService } from './editor-service.type'

const initialState = {
  selectElementId: undefined as string | undefined,
}
export type EditorStoreStateType = typeof initialState

export class EditorService extends BasicState<EditorStoreStateType> implements IEditorService {
  constructor() {
    super(initialState)
  }

  setSelectElementId(id?: string) {
    this.setState(s => {
      s.selectElementId = id
    })
  }
}
