import { memo, useState } from 'react'
import { cn } from '@/common/util/css'
import { Skeleton } from './skeleton'

type ImgProps = React.ComponentPropsWithoutRef<'img'> & {
  isLoading?: boolean
  wrapperClassName?: string
}

export const Image = memo((props: ImgProps) => {
  const { isLoading = false, wrapperClassName, className, alt, ...rest } = props
  const [isImageLoading, setIsImageLoading] = useState(true)

  return (
    <div className={cn('overflow-hidden rounded-xl', wrapperClassName)}>
      {(isLoading || isImageLoading) && <Skeleton className="size-full" />}
      <img
        draggable={false}
        className={cn('size-full', isImageLoading ? 'hidden' : '', className)}
        onLoad={() => setIsImageLoading(false)}
        onError={() => setIsImageLoading(false)}
        {...rest}
        alt={alt}
      />
    </div>
  )
})
