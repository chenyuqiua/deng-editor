import { cn } from '@/common/util/css'
import { memo } from 'react'
import { SideBar } from './sidebar'
import { ResourcePanelBootstrap } from './bootstrap/bootstrap'
import { pageConfig } from './constant/page'
import { useResourcePanelViewController } from './bootstrap/react-context'
import { useZustand } from 'use-zustand'

interface IProps {
  className?: string
}

const ResourcePanelContent = memo((props: IProps) => {
  const { className } = props
  const vc = useResourcePanelViewController()
  const [currentPage, panelFold] = useZustand(vc.store, s => [s.currentPage, s.panelFold])

  return (
    <div className={cn('flex overflow-hidden', className)}>
      <SideBar className="w-[88px]" />
      <div className={cn('w-0 flex-1 bg-[#262626] duration-300', !panelFold && 'w-[360px]')}>
        {pageConfig.map(item => {
          return (
            <div
              key={item.value}
              className={cn('hidden h-full', currentPage === item.value && 'block')}
            >
              {item.component}
            </div>
          )
        })}
      </div>
    </div>
  )
})

export const ResourcePanel = memo((props: IProps) => {
  return (
    <ResourcePanelBootstrap>
      <ResourcePanelContent {...props} />
    </ResourcePanelBootstrap>
  )
})
