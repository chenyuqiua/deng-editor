import { memo } from 'react'
import { EditorPlayer } from '../../../lib/remotion/editor-render/player'
import { cn } from '../../../util/css'

interface IProps {
  className?: string
}

export const Stage = memo((props: IProps) => {
  const { className } = props

  return (
    <div
      className={cn('flex size-full items-center justify-center', className)}
    >
      <EditorPlayer />
    </div>
  )
})
