import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { useState, useCallback } from 'react'
import { IconPark } from '@/lib/iconpark'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2.5 whitespace-nowrap select-none',
    'text-label-md text-color-title cursor-pointer rounded-lg',
    'transition-colors transition-opacity ease-out',
    'disabled:text-color-disable disabled:cursor-not-allowed data-[loading=true]:cursor-progress',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-[#6C6CF5]',
          'hover:bg-[#5252E5] active:bg-[#3939CC]',
          'disabled:bg-[#1C1C4D] data-[loading=true]:bg-[#1C1C4D]',
        ],
        secondary: [
          'bg-white/8',
          'hover:bg-white/16 active:bg-white/24',
          'disabled:white/6 data-[loading=true]:bg-white/6',
        ],
      },
      size: {
        sm: 'text-label-sm h-6 gap-[4px] rounded-[6px] px-3',
        md: 'text-label-md h-8 gap-[6px] rounded-[8px] px-4',
        lg: 'text-label-md h-10 gap-[8px] rounded-[10px] px-5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)
const buttonIconSizes: { [K in NonNullable<ButtonProps['size']>]: number } = {
  sm: 16,
  md: 20,
  lg: 24,
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  icon?: string | React.ReactNode
  iconSize?: number
  trailingIcon?: string | React.ReactNode
  /**
   * if loading not given, will auto set loading when click handling
   */
  autoLoading?: boolean
  disableOnLoading?: boolean
  asChild?: boolean
  childrenClassName?: string
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      iconSize: _iconSize,
      asChild = false,
      loading: _loading,
      icon,
      trailingIcon,
      disableOnLoading = true,
      children,
      onClick,
      autoLoading = true,
      childrenClassName,
      ...props
    },
    ref
  ) => {
    const { disabled } = props

    const [innerLoading, setInnerLoading] = useState(false)
    const loading = _loading ?? innerLoading

    // click
    const handleClick = useCallback(
      async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!onClick) {
          return
        }
        if (disableOnLoading && loading) {
          return
        }
        if (disabled) {
          return
        }
        if (autoLoading) {
          try {
            setInnerLoading(true)
            return await onClick(e)
          } finally {
            setInnerLoading(false)
          }
        } else {
          return onClick(e)
        }
      },
      [onClick, disableOnLoading, loading, disabled, autoLoading]
    )

    // icon
    const iconSize = _iconSize ?? (size ? buttonIconSizes[size] : undefined)
    function getIconComponent(iconName: string | React.ReactNode | undefined) {
      return typeof iconName === 'string' ? (
        <IconPark icon={iconName} size={iconSize} />
      ) : (
        iconName || null
      )
    }
    const iconComp = loading ? (
      <IconPark icon="loading" size={iconSize} spin />
    ) : (
      getIconComponent(icon)
    )
    const trailingIconComp = getIconComponent(trailingIcon)

    // slot
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        data-loading={loading}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      >
        {iconComp}
        {children && <div className={childrenClassName}>{children}</div>}
        {trailingIconComp}
      </Comp>
    )
  }
)
Button.displayName = 'Button'
export { Button, buttonVariants }
