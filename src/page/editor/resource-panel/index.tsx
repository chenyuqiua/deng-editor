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
  const currentPage = useZustand(vc.store, s => s.currentPage)

  return (
    <div className={cn('flex', className)}>
      <SideBar className="w-[88px]" />
      <div className="flex-1 bg-[#262626]">
        {pageConfig.map(item => {
          return (
            <div key={item.value} className={cn('hidden', currentPage === item.value && 'block')}>
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
