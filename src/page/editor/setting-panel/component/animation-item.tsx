import { memo } from 'react'
import { cn } from '@/common/util/css'

interface IProps {
  iconUrl?: string
  label?: string
  active?: boolean
  onClick?: () => void
}

export const AnimationItem = memo((props: IProps) => {
  const { iconUrl, label, active, onClick } = props
  return (
    <div className={cn('flex w-28 cursor-pointer flex-col items-center gap-2')} onClick={onClick}>
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
