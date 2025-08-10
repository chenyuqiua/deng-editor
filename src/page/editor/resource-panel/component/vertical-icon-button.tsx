import { cn } from '@/common/util/css'
import { IconPark } from '@/lib/iconpark'
import { type VariantProps, cva } from 'class-variance-authority'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

const verticalButtonVariants = cva(
  [
    'flex size-16 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-medium duration-100',
    'disabled:cursor-not-allowed disabled:text-white/30',
  ],
  {
    variants: {
      variant: {
        standard: [
          'text-text-white/70 bg-transparent',
          'hover:bg-white/16 hover:text-white/90 active:bg-white/24',
        ],
        secondary: ['bg-white/5 text-white/90', 'hover:bg-white/16 active:bg-white/24'],
        highlight: ['text-white/90-reverse bg-white', 'hover:bg-[#BCC1CC] active:bg-[#878D99]'],
      },
      active: {
        on: '',
        off: '',
      },
    },
    compoundVariants: [
      {
        active: 'on',
        variant: 'standard',
        className: ['bg-white/16 text-white/90'],
      },
      {
        active: 'on',
        variant: 'secondary',
        className: ['bg-white/16 text-white/90'],
      },
      {
        active: 'on',
        variant: 'highlight',
        className: ['bg-white'],
      },
    ],
  }
)

type VerticalIconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  Omit<VariantProps<typeof verticalButtonVariants>, 'active'> & {
    className?: string
    active?: boolean
    icon: string
  }
export const VerticalIconButton = forwardRef<HTMLButtonElement, VerticalIconButtonProps>(
  (props, ref) => {
    const {
      className,
      variant = 'standard',
      active = false,
      onClick,
      icon,
      children,
      ...rest
    } = props

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          verticalButtonVariants({ className, variant, active: active ? 'on' : 'off' })
        )}
        onClick={onClick}
        {...rest}
      >
        <div className="flex size-full flex-col items-center justify-center gap-1">
          <IconPark icon={icon} size={24} color="#fff" />
          {children}
        </div>
      </button>
    )
  }
)
