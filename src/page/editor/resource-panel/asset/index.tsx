import { memo } from 'react'
import { getAssetsList } from '../../mock/resource'
import { AssetCard } from '../../component/asset-card'

export const AssetPanel = memo(() => {
  return (
    <div className="flex flex-col px-6">
      <div className="flex h-[64px] shrink-0 items-center text-xl font-semibold">Assets</div>
      <div className="grid auto-rows-min grid-cols-2 gap-4">
        {getAssetsList().map(i => {
          return <AssetCard key={i.id} src={i.url} alt={i.name} />
        })}
      </div>
    </div>
  )
})
