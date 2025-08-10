import { cn } from '@/common/util/css'
import React from 'react'

export const VirtualDiv = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('min-w-0', className)}
      {...props}
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: 'auto 286px auto 200px',
      }}
    />
  )
)
