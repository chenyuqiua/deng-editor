import { VideoPlayer } from '@/component/ui/video/player'
import { memo } from 'react'

export const TransitionPanel = memo(() => {
  return (
    <div>
      TransitionPanel
      <VideoPlayer src="/public/video/test1.mp4" controls />
    </div>
  )
})
