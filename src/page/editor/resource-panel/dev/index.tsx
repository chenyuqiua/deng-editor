import { Button } from '@/component/ui/button'
import { IconPark } from '@/lib/iconpark'
import { transitionDraft } from '@/lib/remotion/editor-render/mock/transition-draft'
import { memo } from 'react'
import { useDraftSelector } from '../../hook/draft'
import { getDraftService, getEditorService, getPlayerService } from '../../util/service'

export const DevPanel = memo(() => {
  const draftService = getDraftService()
  const playerService = getPlayerService()
  const editorService = getEditorService()
  const draft = useDraftSelector(s => s.draft)
  console.log(draft, 'draft')

  return (
    <div className="flex flex-1 flex-col gap-2 bg-[#262626]">
      <IconPark icon="align-top" color="#fff" className="text-white" />
      ToolPanel
      <Button className="w-fit">{`${JSON.stringify(draft.name)}`}</Button>
      <Button
        className="w-fit"
        onClick={() => {
          draftService.setState(s => {
            s.draft.name = '123321'
          })
        }}
      >
        btn
      </Button>
      <Button
        className="w-fit"
        onClick={() => {
          draftService.setState(s => {
            s.draft = transitionDraft
          })
        }}
      >
        set mock draft
      </Button>
      <Button
        className="w-fit"
        onClick={() => {
          editorService.setSelectElementId('test_image_1')
        }}
      >
        set select element id
      </Button>
      <Button
        className="w-fit"
        variant="secondary"
        onClick={() => {
          playerService.toggle()
        }}
      >
        play
      </Button>
      <Button
        onClick={() => {
          const id = `${draft.timeline.tracks[0].clips[0].elementId}&${draft.timeline.tracks[0].clips[1].elementId}`
          draftService.setState(s => {
            s.draft.timeline.transitions = {
              [id]: {
                name: 'slide',
                duration: 1,
              },
            }
          })
        }}
      >
        add transition
      </Button>
    </div>
  )
})
