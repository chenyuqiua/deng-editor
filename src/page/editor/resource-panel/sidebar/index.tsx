import { cn } from '@/common/util/css'
import { memo } from 'react'
import { VerticalIconButton } from '../component/vertical-icon-button'
import { pageConfig } from '../constant/page'
import { useResourcePanelViewController } from '../bootstrap/react-context'
import { useZustand } from 'use-zustand'

interface IProps {
  className?: string
}

export const SideBar = memo((props: IProps) => {
  const { className } = props
  const vc = useResourcePanelViewController()
  const [currentPage, panelFold] = useZustand(vc.store, s => [s.currentPage, s.panelFold])

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      {pageConfig.map(item => {
        return (
          <VerticalIconButton
            icon={item.icon}
            key={item.value}
            active={currentPage === item.value && !panelFold}
            onClick={() => {
              vc.setState(s => {
                if (s.currentPage === item.value) {
                  s.panelFold = !s.panelFold
                } else {
                  s.currentPage = item.value
                  s.panelFold = false
                }
              })
            }}
          >
            {item.label}
          </VerticalIconButton>
        )
      })}
    </div>
  )
})
