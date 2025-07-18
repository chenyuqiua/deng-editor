import { EditorPlayer } from '@/lib/remotion/editor-render/player'
import { memo } from 'react'
import { cn } from '../../../common/util/css'
import { useDraftSelector } from '../hook/draft'

interface IProps {
  className?: string
}

export const Stage = memo((props: IProps) => {
  const { className } = props
  const draft = useDraftSelector(s => s.draft)

  return (
    <div className={cn('flex size-full items-center justify-center', className)}>
      <EditorPlayer draft={draft} autoPlay />
    </div>
  )
})
