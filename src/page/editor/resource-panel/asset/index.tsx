import { memo } from 'react'
import { getAssetsList } from '../../mock/resource'
import { AssetCard } from '../../component/asset-card'
import { IconButton } from '@/component/ui/button'
import { cn } from '@/common/util/css'
import { useResourcePanelViewController } from '../context/resource-panel.context'

export const AssetPanel = memo(() => {
  const vc = useResourcePanelViewController()

  return (
    <div className="flex h-full flex-col px-6">
      <div className="flex h-[64px] shrink-0 items-center text-xl font-semibold">Assets</div>
      <div className="grid h-[calc(100%-64px)] auto-rows-min grid-cols-2 gap-4 overflow-y-auto">
        {getAssetsList().map(i => {
          return (
            <AssetCard
              key={i.id}
              type={i.type}
              url={i.url}
              extraElement={
                <IconButton
                  icon="add"
                  variant="primary"
                  className={cn(
                    'absolute right-2 bottom-2',
                    'translate-x-full opacity-0 transition-transform duration-300 group-hover/asset-card:translate-x-0 group-hover/asset-card:opacity-100'
                  )}
                  onClick={e => {
                    e.stopPropagation()
                    vc.draftOperationManager.insertElement({ type: i.type, url: i.url })
                  }}
                />
              }
            />
          )
        })}
      </div>
    </div>
  )
})
