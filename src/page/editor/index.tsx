import { memo } from 'react'
import { ToolPanel } from './tool-panel'
import { Stage } from './stage'
import { Timeline } from './timeline'

export const EditorMainPage = memo(() => {
  return (
    <div className="flex h-screen gap-2 bg-[#141414] text-white">
      <ToolPanel className="bg-[#262626]" />
      <div className="flex flex-1 flex-col">
        <Stage className="flex-1 bg-[#262626] p-2" />
        <Timeline className="bg-[#262626]" />
      </div>
    </div>
  )
})
