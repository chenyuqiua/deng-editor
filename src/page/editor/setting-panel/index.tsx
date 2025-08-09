import { cn } from '@/common/util/css'
import { memo } from 'react'
import { AnimationPanel } from './animation'
import { SettingPanelBootstrap } from './bootstrap/bootstrap'
import { useEditorSelector } from '../hook/editor'

interface IProps {
  className?: string
}

export const SettingPanel = memo((props: IProps) => {
  const { className } = props
  const open = useEditorSelector(s => s.selectElementId)

  return (
    <SettingPanelBootstrap>
      <div
        className={cn(
          'relative h-full w-0 flex-shrink-0 overflow-hidden duration-300',
          open && 'w-[360px]',
          className
        )}
      >
        <AnimationPanel />
      </div>
    </SettingPanelBootstrap>
  )
})
