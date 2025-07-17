import { memo } from 'react'
import { useDraftService } from '../hook/service'
import { useDraftSelector } from '../hook/draft-state'

export const ToolPanel = memo(() => {
  const draftService = useDraftService()
  const draft = useDraftSelector(s => s.draft)
  return (
    <div>
      ToolPanel
      {`${JSON.stringify(draft.name)}`}
      <button
        onClick={() => {
          draftService.setState(s => {
            s.draft.name = '123321'
          })
        }}
      >
        btn
      </button>
    </div>
  )
})
