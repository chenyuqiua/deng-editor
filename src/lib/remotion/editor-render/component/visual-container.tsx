import React, { memo, useRef, type CSSProperties, type PropsWithChildren } from 'react'
import type { AllDisplayElement } from '../schema/element'
import { useRegisterBox } from '../react-context'

type IProps = PropsWithChildren<{
  element: AllDisplayElement
  style?: CSSProperties
}>

/**
 * 这个组件是用来统一处理元素animation动画, 以及将元素的dom信息进行存储, 方便后续的编辑操作
 * 目前只有dom信息存储的功能, 后续需要实现动画的处理
 */
export const VisualContainer = memo((props: IProps) => {
  const { element, style, children } = props

  const ref = useRef<HTMLDivElement>(null)

  const elementX = element.x || 0
  const elementY = element.y || 0
  const elementRotate = element.rotate || 0
  const elementScaleX = element.scaleX || 1
  const elementScaleY = element.scaleY || 1
  const elementOpacity = element.opacity || 1

  useRegisterBox({
    id: element.id,
    ref,
    parent: element.parent,
    children: element.children,
  })

  return (
    <div
      ref={ref}
      // 坐标系的原点在画布的中心点, 所以也需要默认将元素的位置设置在画布的中心点
      style={{
        width: element.width || 'max-content',
        height: element.height || 'max-content',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transformOrigin: 'center',
        transform: [
          `translate(-50%,-50%)`,
          `translate(${elementX}px,${elementY}px)`,
          `rotate(${elementRotate}deg)`,
          `scale(${elementScaleX},${elementScaleY})`,
        ].join(' '),
        opacity: elementOpacity,
        mixBlendMode: element.blendMode as CSSProperties['mixBlendMode'],
        ...style,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transformOrigin: 'center',
          position: 'relative',
        }}
      >
        {children}
      </div>
    </div>
  )
})
