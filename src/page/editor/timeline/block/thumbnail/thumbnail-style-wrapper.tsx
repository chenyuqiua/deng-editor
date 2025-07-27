import { cn } from '@/common/util/css'
import { useEditorSelector } from '@/page/editor/hook/editor'
import React, { memo } from 'react'

type IProps = { elementId: string } & React.HTMLAttributes<HTMLDivElement>

export const ThumbnailStyleWrapper = memo((props: IProps) => {
  const { className, elementId, ...rest } = props
  const selectElementId = useEditorSelector(s => s.selectElementId)
  return (
    <div
      className={cn(
        'relative rounded-sm border-2 border-solid border-white/12 hover:border-[#47E7FF]',
        selectElementId === elementId && 'border-[#47E7FF]',
        'flex size-full items-center overflow-hidden px-2 text-nowrap',
        className
      )}
      {...rest}
    ></div>
  )
})
