import { memo } from 'react'

interface IProps {
  show?: boolean
}

export const ResizeCursorFullScreen = memo((props: IProps) => {
  const { show } = props

  if (!show) return null
  return <div className="fixed top-0 left-0 z-[1900] h-screen w-screen cursor-ew-resize" />
})
