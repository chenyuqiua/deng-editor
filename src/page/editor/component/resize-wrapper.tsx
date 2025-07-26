import { cn } from '@/common/util/css'
import { memo, useEffect, useRef, useState, type PropsWithChildren, forwardRef } from 'react'
import { flushSync } from 'react-dom'
import { ResizeCursorFullScreen } from './resize-cursor-full-screen'

type ResizeListener = (leftOffset: number, rightOffset: number) => void
type IProps = React.HTMLAttributes<HTMLDivElement> &
  PropsWithChildren<{
    leftHandle?: React.ReactNode
    rightHandle?: React.ReactNode
    // onResizing和onResizeComplete的区别是，onResizing是实时回调，onResizeComplete是结束后最终结果的回调
    onResizing?: ResizeListener
    onResizeComplete?: ResizeListener
  }>

const LEFT_HANDLER_ID = '__resize-wrapper-left-handler'
const RIGHT_HANDLER_ID = '__resize-wrapper-right-handler'

export const ResizeWrapper = memo(
  forwardRef<HTMLDivElement, IProps>((props, ref) => {
    const { children, leftHandle, rightHandle, onResizing, onResizeComplete, className, ...rest } =
      props

    const [isResizing, setIsResizing] = useState(false)

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
        flushSync(() => {
          setIsResizing(true)
        })
      }

      const handlePointerMove = (e: MouseEvent) => {
        calcOffset(e, onResizing)
      }

      const handlePointerUp = (e: MouseEvent) => {
        calcOffset(e, onResizeComplete)
        flushSync(() => {
          setIsResizing(false)
        })
      }

      const startResize = () => {
        document.addEventListener('pointermove', handlePointerMove)
        document.addEventListener(
          'pointerup',
          e => {
            handlePointerUp(e)
            document.removeEventListener('pointermove', handlePointerMove)
          },
          { once: true }
        )
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
        <ResizeCursorFullScreen show={isResizing} />
        <div ref={ref} className={cn('relative', className)} {...rest}>
          <div
            ref={leftHandleRef}
            id={LEFT_HANDLER_ID}
            className="absolute top-0 left-0 h-full w-fit cursor-ew-resize"
          >
            {leftHandle}
          </div>
          <div
            ref={rightHandleRef}
            id={RIGHT_HANDLER_ID}
            className="absolute top-0 right-0 h-full w-fit cursor-ew-resize"
          >
            {rightHandle}
          </div>
          {children}
        </div>
      </>
    )
  })
)
