import { cn } from '@/common/util/css'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { useControllableState } from '@radix-ui/react-use-controllable-state'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const segmentVariants = cva('inline-flex items-center justify-center bg-white/8', {
  variants: {
    variant: {
      default: '',
      emphasize: '',
    },
    size: {
      sm: 'h-6 gap-[1px] rounded-md p-[1px]',
      md: 'h-8 gap-[2px] rounded-lg p-[2px]',
      lg: 'h-10 gap-[2px] rounded-xl p-[2px]',
    },
  },
})

const segmentItemVariants = cva(
  [
    'inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-transparent text-sm text-white/70',
    'transition-colors ease-out',
    'focus-visible:shadow-focus focus-visible:outline-none',
    'disabled:cursor-not-allowed data-[state=on]:cursor-default disabled:data-[state=on]:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        default: [
          'data-[state=on]:text-black-abs/90 data-[state=on]:bg-white/8',
          'hover:bg-ux-hover hover:text-black-abs/90',
          'disabled:bg-transparent disabled:text-white/30',
          'disabled:data-[state=on]:bg-white/8 disabled:data-[state=on]:text-white/30',
        ],
        emphasize: [
          'data-[state=on]:text-black-abs/90-reverse data-[state=on]:bg-white',
          'hover:bg-ux-hover hover:text-black-abs/90',
          'disabled:bg-transparent disabled:text-white/30',
          'disabled:data-[state=on]:text-white/30-reverse disabled:data-[state=on]:bg-white',
        ],
      },
      size: {
        sm: 'h-[22px] min-w-8 rounded-[5px] px-3',
        md: 'h-7 min-w-8 rounded-md px-3',
        lg: 'h-9 min-w-8 rounded-lg px-3',
      },
    },
  }
)

const SegmentContext = React.createContext<VariantProps<typeof segmentItemVariants>>({
  size: 'md',
  variant: 'default',
})

type SegmentProps = React.ComponentPropsWithoutRef<
  React.ForwardRefExoticComponent<
    Omit<ToggleGroupPrimitive.ToggleGroupSingleProps, 'type'> & React.RefAttributes<HTMLDivElement>
  >
> &
  VariantProps<typeof segmentItemVariants>

const Segment = React.forwardRef<React.ElementRef<typeof ToggleGroupPrimitive.Root>, SegmentProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      children,
      value: valueProp,
      defaultValue: defaultValueProp,
      onValueChange: onValueChangeProp,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChangeProp,
      defaultProp: defaultValueProp || '',
    })
    return (
      <ToggleGroupPrimitive.Root
        ref={ref}
        type="single"
        className={cn(segmentVariants({ variant, size }), className)}
        value={value}
        onValueChange={value => {
          if (value) {
            setValue(value)
          }
        }}
        asChild={false}
        {...props}
      >
        <SegmentContext.Provider value={{ variant, size }}>{children}</SegmentContext.Provider>
      </ToggleGroupPrimitive.Root>
    )
  }
)
Segment.displayName = 'Segment.Root'

const SegmentItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof segmentItemVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(SegmentContext)

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        segmentItemVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})
SegmentItem.displayName = 'Segment.Item'

export { Segment, SegmentItem }
