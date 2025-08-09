import { memo } from 'react'
import { ResourcePanel } from './resource-panel'
import { Stage } from './stage'
import { Timeline } from './timeline'
import { SettingPanel } from './setting-panel'
import { SideBar } from './sidebar'

export const EditorMainPage = memo(() => {
  return (
    <div className="flex h-screen min-h-screen gap-2 overflow-hidden bg-[#141414] text-white">
      <SideBar className="w-[88px]" />
      <ResourcePanel className="w-[360px] bg-[#262626]" />
      <div className="flex min-h-0 w-[calc(100%-360px-88px)] flex-col">
        <div className="flex min-h-0 flex-1 gap-2">
          <Stage className="flex-1 bg-[#262626] p-2" />
          <SettingPanel className="bg-[#262626]" />
        </div>
        <Timeline className="flex-shrink-0 bg-[#262626]" />
      </div>
    </div>
  )
})
