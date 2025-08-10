import { EditorPlayer } from '@/lib/remotion/editor-render/player'
import { memo } from 'react'
import { cn } from '../../../common/util/css'
import { useDraftSelector } from '../hook/draft'
import { getPlayerService } from '../util/service'
import { StageInteraction } from './block/interaction'
import { StageBootstrap } from './bootstrap/bootstrap'

interface IProps {
  className?: string
}

export const Stage = memo((props: IProps) => {
  const { className } = props
  const draft = useDraftSelector(s => s.draft)
  const playerService = getPlayerService()

  return (
    <StageBootstrap>
      <div className={cn('relative flex size-full items-center justify-center', className)}>
        <EditorPlayer
          draft={draft}
          ref={editorPlayerRef => {
            if (!editorPlayerRef) return
            playerService.setPlayer(editorPlayerRef?.player)
            playerService.setContext(editorPlayerRef?.context)
          }}
        />
        <StageInteraction />
      </div>
    </StageBootstrap>
  )
})
