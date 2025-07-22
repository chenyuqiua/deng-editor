import { memo } from 'react'
import { ToolPanel } from './tool-panel'
import { Stage } from './stage'
import { Timeline } from './timeline'

export const EditorMainPage = memo(() => {
  return (
    <div className="flex h-screen min-h-screen gap-2 overflow-hidden bg-[#141414] text-white">
      <ToolPanel className="w-[360px] bg-[#262626]" />
      <div className="flex min-h-0 w-[calc(100%-360px)] flex-col">
        <Stage className="min-h-0 flex-1 bg-[#262626] p-2" />
        <Timeline className="flex-shrink-0 bg-[#262626]" />
      </div>
    </div>
  )
})
