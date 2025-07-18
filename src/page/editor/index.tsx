import { memo } from 'react'
import { ToolPanel } from './tool-panel'
import { Stage } from './stage'
import { Timeline } from './timeline'

export const EditorMainPage = memo(() => {
  return (
    <div className="flex h-screen gap-2 bg-[#707580] text-white">
      <ToolPanel />
      <div className="flex flex-1 flex-col gap-2">
        <Stage className="flex-1 bg-[#212936] p-2" />
        <Timeline />
      </div>
    </div>
  )
})
