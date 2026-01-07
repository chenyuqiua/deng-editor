import { cn } from '@/common/util/css'
import { Image } from '@/component/ui/image'
import { VirtualDiv } from '@/component/ui/virtual-div'
import { memo } from 'react'

type IProps = {
  type: 'image' | 'video'
  url: string
  className?: string
  extraElement?: React.ReactNode
}

export const AssetCard = memo((props: IProps) => {
  const { className, extraElement, type, url } = props
  return (
    <VirtualDiv
      className={cn(
        'group/asset-card relative flex aspect-square w-full items-center overflow-hidden rounded-2xl',
        'border border-solid border-white/8 bg-[#595959] hover:border-[#6C6CF5]',
        'transition-colors duration-300',
        className
      )}
    >
      {type === 'image' ? (
        <Image className="rounded-none" src={url} />
      ) : (
        // TODO: 增加视频播放器并替换
        <video className="rounded-none" src={url} />
      )}
      {extraElement}
    </VirtualDiv>
  )
})
