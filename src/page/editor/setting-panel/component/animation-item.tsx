import { memo, type HTMLAttributes } from 'react'
import { cn } from '@/common/util/css'

type IProps = HTMLAttributes<HTMLDivElement> & {
  iconUrl?: string
  label?: string
  active?: boolean
  onClick?: () => void
}

export const AnimationItem = memo((props: IProps) => {
  const { iconUrl, label, active, className, onClick, ...rest } = props
  return (
    <div
      className={cn(
        'flex h-fit w-full cursor-pointer flex-col items-center gap-2 select-none',
        className
      )}
      onClick={onClick}
      {...rest}
    >
      <img
        src={iconUrl}
        alt={label}
        className={cn(
          'aspect-square w-full rounded-xl transition-colors duration-300',
          'border border-solid border-transparent object-contain hover:border-[#6C6CF5]',
          active && 'border-[#6C6CF5]'
        )}
      />
      <span>{label}</span>
    </div>
  )
})
