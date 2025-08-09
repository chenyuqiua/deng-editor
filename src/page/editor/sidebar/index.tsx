import { cn } from '@/common/util/css'
import { memo } from 'react'
import { VerticalIconButton } from './vertical-icon-button'

interface IProps {
  className?: string
}

export const SideBar = memo((props: IProps) => {
  const { className } = props
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <VerticalIconButton icon="upload-line">assets</VerticalIconButton>
    </div>
  )
})
