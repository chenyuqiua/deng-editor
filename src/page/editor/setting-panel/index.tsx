import { cn } from '@/common/util/css'
import { memo } from 'react'
import { AnimationPanel } from './animation'
import { SettingPanelBootstrap } from './bootstrap/setting-panel.bootstrap'
import { useEditorSelector } from '../hook/editor'

interface IProps {
  className?: string
}

export const SettingPanel = memo((props: IProps) => {
  const { className } = props
  const open = true // TODO: 目前先固定打开
  const selectElementId = useEditorSelector(s => s.selectElementId)
  const hasSelectElement = !!selectElementId

  return (
    <SettingPanelBootstrap>
      <div
        className={cn(
          'relative h-full w-0 flex-shrink-0 overflow-hidden duration-300',
          open && 'w-[360px]',
          className
        )}
      >
        {hasSelectElement && <AnimationPanel />}
        {!hasSelectElement && (
          <div className="flex size-full flex-col items-center justify-center gap-4">
            <img src="/empty/empty.png" className="size-[200px]" />
            Please select an element
          </div>
        )}
      </div>
    </SettingPanelBootstrap>
  )
})
