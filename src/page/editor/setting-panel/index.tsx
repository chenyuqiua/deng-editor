import { cn } from '@/common/util/css'
import { memo, useState } from 'react'
import { AnimationPanel } from './animation'

interface IProps {
  className?: string
}

export const SettingPanel = memo((props: IProps) => {
  const { className } = props
  const [open] = useState(true)

  return (
    <div
      className={cn(
        'relative h-full w-0 flex-shrink-0 duration-300',
        open && 'w-[360px]',
        className
      )}
    >
      <AnimationPanel />
    </div>
  )
})
