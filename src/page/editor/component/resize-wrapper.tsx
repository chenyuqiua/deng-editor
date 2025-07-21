import { memo, useEffect, useRef, type PropsWithChildren } from 'react'

type ResizeListener = (leftOffset: number, rightOffset: number) => void
type IProps = PropsWithChildren<{
  leftHandle?: React.ReactNode
  rightHandle?: React.ReactNode
  // onResizing和onResizeComplete的区别是，onResizing是实时回调，onResizeComplete是结束后最终结果的回调
  onResizing?: ResizeListener
  onResizeComplete?: ResizeListener
}>

const LEFT_HANDLER_ID = '__resize-wrapper-left-handler'
const RIGHT_HANDLER_ID = '__resize-wrapper-right-handler'

export const ResizeWrapper = memo((props: IProps) => {
  const { children, leftHandle, rightHandle, onResizing, onResizeComplete } = props

  const leftHandleRef = useRef<HTMLDivElement>(null)
  const rightHandleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const leftHandleEl = leftHandleRef.current
    const rightHandleEl = rightHandleRef.current
    if (!leftHandleEl || !rightHandleEl) return

    let startOffset: number | undefined
    let currentHandlerId: string | undefined

    const calcOffset = (e: MouseEvent, callback?: ResizeListener) => {
      if (typeof startOffset === 'undefined' || !currentHandlerId) return

      const offset = e.clientX - startOffset

      if (currentHandlerId === LEFT_HANDLER_ID) {
        callback?.(offset, 0)
      } else {
        callback?.(0, offset)
      }
    }

    const handlePointerDown = (e: MouseEvent) => {
      startOffset = e.clientX
      currentHandlerId = (e.currentTarget as HTMLDivElement | null)?.id
      startResize()
    }

    const handlePointerMove = (e: MouseEvent) => {
      calcOffset(e, onResizing)
    }

    const handlePointerUp = (e: MouseEvent) => {
      calcOffset(e, onResizeComplete)
    }

    const startResize = () => {
      document.addEventListener('pointermove', handlePointerMove)
      document.addEventListener('pointerup', e => {
        handlePointerUp(e)
        document.removeEventListener('pointermove', handlePointerMove)
      })
    }

    leftHandleEl.addEventListener('pointerdown', handlePointerDown)
    rightHandleEl.addEventListener('pointerdown', handlePointerDown)

    return () => {
      leftHandleEl.removeEventListener('pointerdown', handlePointerDown)
      rightHandleEl.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  return (
    <>
      {/* <div className="fixed top-0 left-0 z-[9999] h-screen w-screen cursor-ew-resize"></div> */}
      <div className="relative">
        <div
          ref={leftHandleRef}
          id={LEFT_HANDLER_ID}
          className="absolute top-0 left-0 h-full w-fit cursor-ew-resize"
        >
          {leftHandle || <div className="h-full w-1 bg-red-500" />}
        </div>
        <div
          ref={rightHandleRef}
          id={RIGHT_HANDLER_ID}
          className="absolute top-0 right-0 h-full w-fit cursor-ew-resize"
        >
          {rightHandle || <div className="h-full w-1 bg-red-500" />}
        </div>
        {children}
      </div>
    </>
  )
})
