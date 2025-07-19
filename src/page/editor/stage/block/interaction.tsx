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

  return <div ref={interactionRef} className="absolute top-0 left-0 size-full"></div>
})
