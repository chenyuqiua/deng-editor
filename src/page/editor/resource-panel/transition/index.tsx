import { cn } from '@/common/util/css'
import { IconButton } from '@/component/ui/button'
import { HoverVideoPlayer } from '@/component/ui/video/hover-player'
import { memo } from 'react'
import { getTransitionList } from '../../mock/resource'
import { useResourcePanelViewController } from '../bootstrap/react-context'

export const TransitionPanel = memo(() => {
  const vc = useResourcePanelViewController()

  return (
    <div className="flex h-full flex-col px-6">
      <div className="flex h-[64px] shrink-0 items-center text-xl font-semibold">Transition</div>
      <div className="grid grid-cols-3 gap-2">
        {getTransitionList().map(item => {
          return (
            <div className="flex flex-col gap-2" key={item.id}>
              <div className="group relative overflow-hidden rounded-lg">
                <HoverVideoPlayer poster={item.cover} key={item.id} src={item.url} />
                <IconButton
                  icon="add"
                  variant="primary"
                  size="sm"
                  className={cn(
                    'absolute right-2 bottom-2',
                    'translate-x-full opacity-0 transition-transform duration-300 group-hover:translate-x-0 group-hover:opacity-100'
                  )}
                  onClick={e => {
                    e.stopPropagation()
                    vc.draftOperationManager.insertTransition()
                  }}
                />
              </div>
              <div className="text-sm">{item.name}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
})
