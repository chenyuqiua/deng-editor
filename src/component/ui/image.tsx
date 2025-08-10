import { memo, useState } from 'react'
import { cn } from '@/common/util/css'
import { Skeleton } from './skeleton'

export type ImageProps = React.ComponentPropsWithoutRef<'img'> & {
  isLoading?: boolean
}

export const Image = memo((props: ImageProps) => {
  const { isLoading = false, alt, className, ...rest } = props
  const [isImageLoading, setIsImageLoading] = useState(true)

  return (
    <div className={cn('overflow-hidden rounded-xl', className)}>
      {(isLoading || isImageLoading) && <Skeleton className="size-full" />}
      <img
        draggable={false}
        className={cn('size-full', isImageLoading ? 'hidden' : '')}
        onLoad={() => setIsImageLoading(false)}
        onError={() => setIsImageLoading(false)}
        {...rest}
        alt={alt}
      />
    </div>
  )
})
