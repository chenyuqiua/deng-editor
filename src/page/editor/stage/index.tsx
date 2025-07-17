import { testDraft } from '@/lib/remotion/editor-render/mock/test-draft'
import { EditorPlayer } from '@/lib/remotion/editor-render/player'
import { memo } from 'react'
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
      <EditorPlayer draft={testDraft} autoPlay loop />
    </div>
  )
})
