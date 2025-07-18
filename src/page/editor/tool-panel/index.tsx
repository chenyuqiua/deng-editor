import { testDraft } from '@/lib/remotion/editor-render/mock/test-draft'
import { memo } from 'react'
import { useDraftSelector } from '../hook/draft'
import { useDraftService, usePlayerService } from '../hook/service'

export const ToolPanel = memo(() => {
  const draftService = useDraftService()
  const playerService = usePlayerService()
  const draft = useDraftSelector(s => s.draft)

  return (
    <div className="flex flex-col gap-2">
      ToolPanel
      <div>{`${JSON.stringify(draft.name)}`}</div>
      <button
        onClick={() => {
          draftService.setState(s => {
            s.draft.name = '123321'
          })
        }}
      >
        btn
      </button>
      <button
        onClick={() => {
          draftService.setState(s => {
            s.draft = testDraft
          })
        }}
      >
        set mock draft
      </button>
      <button
        onClick={() => {
          playerService.toggle()
        }}
      >
        play
      </button>
    </div>
  )
})
