import { memo } from 'react'
import { useDraftSelector } from '../hook/draft'
import { useDraftService } from '../hook/service'

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
