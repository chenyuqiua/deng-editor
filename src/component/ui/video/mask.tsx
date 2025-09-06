import { cn } from '@/common/util/css'
import { IconPark } from '@/lib/iconpark'
import { IconButton } from '../button'

export const LoadingMask = () => {
  return (
    <div className="pointer-events-none absolute top-0 left-0 z-[1] flex size-full items-center justify-center bg-white/6">
      <IconPark spin icon="loading" color="#fff" size={16} className="mr-[2px]" />
    </div>
  )
}

export const ErrorMask = (props: { onRetry: () => void }) => {
  const { onRetry } = props
  return (
    <div
      className={cn(
        'absolute top-0 left-0 z-[1] flex size-full cursor-not-allowed items-center justify-center bg-white/6'
      )}
    >
      <IconButton
        icon="rotate-reverse"
        variant="secondary"
        className="relative z-[2] rounded-full"
        onClick={e => {
          e.stopPropagation()
          e.preventDefault()
          onRetry?.()
        }}
      />
    </div>
  )
}
