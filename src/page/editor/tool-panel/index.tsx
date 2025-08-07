import { cn } from '@/common/util/css'
import { Button } from '@/component/ui/button'
import { IconPark } from '@/lib/iconpark'
import { memo } from 'react'
import { useDraftSelector } from '../hook/draft'
import { getDraftService, getEditorService, getPlayerService } from '../util/service'
import { animationDraft } from '@/lib/remotion/editor-render/mock/animation-draft'

interface IProps {
  className?: string
}

export const ToolPanel = memo((props: IProps) => {
  const { className } = props
  const draftService = getDraftService()
  const playerService = getPlayerService()
  const editorService = getEditorService()
  const draft = useDraftSelector(s => s.draft)

  return (
    <div className={cn('flex flex-col gap-2', className)}>
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
            s.draft = animationDraft
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
    </div>
  )
})
