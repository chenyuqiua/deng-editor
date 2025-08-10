import { memo } from 'react'
import { getAssetsList } from '../../mock/resource'

export const AssetPanel = memo(() => {
  return (
    <div className="flex flex-col px-6">
      <div className="flex h-[64px] shrink-0 items-center justify-center px-6 text-xl font-semibold">
        Assets
      </div>
      <div className="grid auto-rows-min grid-cols-2 gap-4">
        {getAssetsList().map(i => {
          return <div key={i.id}>{i.name}</div>
        })}
      </div>
    </div>
  )
})
