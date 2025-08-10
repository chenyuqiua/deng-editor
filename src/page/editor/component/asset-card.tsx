import { cn } from '@/common/util/css'
import { Image, type ImageProps } from '@/component/ui/image'
import { VirtualDiv } from '@/component/ui/virtual-div'
import { memo } from 'react'

type IProps = ImageProps & {
  extraElement?: React.ReactNode
}

export const AssetCard = memo((props: IProps) => {
  const { className, extraElement, ...rest } = props
  return (
    <VirtualDiv
      className={cn(
        'group/asset-card relative flex aspect-square w-full items-center overflow-hidden rounded-2xl',
        'border border-solid border-white/8 bg-[#595959] hover:border-[#6C6CF5]',
        'transition-colors duration-300',
        className
      )}
    >
      <Image className="rounded-none" {...rest} />
      {extraElement}
    </VirtualDiv>
  )
})
