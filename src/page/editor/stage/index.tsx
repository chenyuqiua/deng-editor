import { memo } from 'react'
import { EditorPlayer } from '../../../lib/remotion/editor-render/player'
import { cn } from '../../../util/css'

interface IProps {
  className?: string
}

export const Stage = memo((props: IProps) => {
  const { className } = props

  const draft = {
    meta: {
      width: 400,
      height: 200,
      fps: 30,
    },
  }

  return (
    <div
      className={cn('flex size-full items-center justify-center', className)}
    >
      <EditorPlayer draft={draft} />
    </div>
  )
})
