import { EditorPlayer } from '@/lib/remotion/editor-render/player'
import { memo } from 'react'
import { cn } from '../../../common/util/css'
import { useDraftSelector } from '../hook/draft'
import { usePlayerService } from '../hook/service'

interface IProps {
  className?: string
}

export const Stage = memo((props: IProps) => {
  const { className } = props
  const draft = useDraftSelector(s => s.draft)
  const playerService = usePlayerService()

  return (
    <div className={cn('flex size-full items-center justify-center', className)}>
      <EditorPlayer
        draft={draft}
        ref={editorPlayerRef => {
          if (!editorPlayerRef) return
          playerService.setPlayer(editorPlayerRef?.player)
        }}
      />
    </div>
  )
})
