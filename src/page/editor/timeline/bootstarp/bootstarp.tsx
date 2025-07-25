import { useMemo } from 'react'
import { getDraftService } from '../../util/service'
import { TimelineViewController } from '../view-controller'
import { TimelineContextProvider } from './react-context'

export function TimelineBootstrap({ children }: { children: React.ReactNode }) {
  const draftService = getDraftService()
  // 使用useMemo包裹, 避免每次渲染都创建新的实例
  const vc = useMemo(() => new TimelineViewController(draftService), [draftService])

  return <TimelineContextProvider vc={vc}>{children}</TimelineContextProvider>
}
