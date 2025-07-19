import { memo, useEffect, useRef } from 'react'
import { useStageViewController } from '../bootstarp/react-context'

export const StageInteraction = memo(() => {
  const interactionRef = useRef<HTMLDivElement>(null)
  const vc = useStageViewController()

  useEffect(() => {
    vc.interactionManager.init({ interactionRef })

    return () => {
      vc.interactionManager.destroy()
    }
  }, [])

  return (
    <div className="absolute inset-0" ref={interactionRef}>
      <div className="test_moveable_target">StageInteraction</div>
    </div>
  )
})
