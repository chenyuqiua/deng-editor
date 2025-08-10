import { memo } from 'react'
import { ResourcePanel } from './resource-panel'
import { Stage } from './stage'
import { Timeline } from './timeline'
import { SettingPanel } from './setting-panel'

export const EditorMainPage = memo(() => {
  return (
    <div className="flex h-screen min-h-screen gap-2 overflow-hidden bg-[#141414] text-white">
      <ResourcePanel className="" />
      <div className="flex min-h-0 min-w-[calc(100%-448px)] flex-1 flex-col">
        <div className="flex min-h-0 flex-1 gap-2">
          <Stage className="flex-1 bg-[#262626] p-2" />
          <SettingPanel className="bg-[#262626]" />
        </div>
        <Timeline className="flex-shrink-0 bg-[#262626]" />
      </div>
    </div>
  )
})
