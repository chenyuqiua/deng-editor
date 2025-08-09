import { cn } from '@/common/util/css'
import { Slider } from '@/component/ui/slider'
import { memo } from 'react'

interface IProps {
  defaultValue?: number
  value?: number
  onChange?: (value: number) => void
  className?: string
}

export const DurationSetBar = memo((props: IProps) => {
  const { defaultValue, value, onChange, className } = props

  return (
    <div className={cn('flex h-10 w-full items-center gap-2 bg-[#484848] px-4', className)}>
      <span className="text-sm text-white">Duration</span>
      <div className="flex h-6 w-12 shrink-0 items-center justify-center rounded-lg bg-[#282828] px-2 py-1 text-xs text-white select-none">
        {value ?? defaultValue ?? 0}
      </div>
      <Slider
        min={0.3}
        max={5}
        step={0.1}
        defaultValue={[defaultValue ?? 0]}
        value={value ? [value] : undefined}
        onValueChange={value => {
          onChange?.(value[0])
        }}
      />
    </div>
  )
})
