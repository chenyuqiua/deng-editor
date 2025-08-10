import { memo } from 'react'
import { getAssetsList } from '../../mock/resource'
import { AssetCard } from '../../component/asset-card'
import { IconButton } from '@/component/ui/button'
import { cn } from '@/common/util/css'
import { getDraftService } from '../../util/service'

export const AssetPanel = memo(() => {
  const draftService = getDraftService()

  return (
    <div className="flex flex-col px-6">
      <div className="flex h-[64px] shrink-0 items-center text-xl font-semibold">Assets</div>
      <div className="grid auto-rows-min grid-cols-2 gap-4">
        {getAssetsList().map(i => {
          return (
            <AssetCard
              key={i.id}
              src={i.url}
              alt={i.name}
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
                    draftService.insertElement()
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
