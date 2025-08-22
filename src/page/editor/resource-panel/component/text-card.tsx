import { cn } from '@/common/util/css'
import { memo, type HTMLAttributes } from 'react'

export const TextCard = memo((props: HTMLAttributes<HTMLDivElement>) => {
  const { className, ...rest } = props
  return (
    <div
      className={cn(
        'flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-white/10 select-none',
        'border border-solid border-transparent duration-200 hover:border-[#6C6CF5]',
        className
      )}
      {...rest}
    />
  )
})
