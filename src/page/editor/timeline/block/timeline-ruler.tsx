import { memo, type PropsWithChildren } from 'react'

export const TimelineRuler = memo((props: PropsWithChildren) => {
  const { children } = props
  return <div className="flex w-full flex-col gap-2">{children}</div>
})
