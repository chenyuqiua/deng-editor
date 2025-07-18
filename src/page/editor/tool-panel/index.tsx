import { testDraft } from '@/lib/remotion/editor-render/mock/test-draft'
import { memo } from 'react'
import { useDraftSelector } from '../hook/draft'
import { useDraftService, usePlayerService } from '../hook/service'
import { IconPark } from '@/lib/iconpark'
import { Button } from '@/component/ui/button'

export const ToolPanel = memo(() => {
  const draftService = useDraftService()
  const playerService = usePlayerService()
  const draft = useDraftSelector(s => s.draft)

  return (
    <div className="flex flex-col gap-2">
      <IconPark icon="all-application" />
      ToolPanel
      <Button>{`${JSON.stringify(draft.name)}`}</Button>
      <Button
        onClick={() => {
          draftService.setState(s => {
            s.draft.name = '123321'
          })
        }}
      >
        btn
      </Button>
      <Button
        onClick={() => {
          draftService.setState(s => {
            s.draft = testDraft
          })
        }}
      >
        set mock draft
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          playerService.toggle()
        }}
      >
        play
      </Button>
    </div>
  )
})
