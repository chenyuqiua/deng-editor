import React, { memo, useRef, type CSSProperties, type PropsWithChildren, useMemo } from 'react'
import type { AllDisplayElement, DisplayElement } from '../schema/element'
import { useRegisterBox } from '../react-context'
import { useCurrentFrame, useVideoConfig } from 'remotion'

type IProps = PropsWithChildren<{
  element: DisplayElement
  style?: CSSProperties
}>

/**
 * 这个组件是用来统一处理元素animation动画, 以及将元素的dom信息进行存储, 方便后续的编辑操作
 * 目前只有dom信息存储的功能, 后续需要实现动画的处理
 */
export const VisualContainer = memo((props: IProps) => {
  const { element, style, children } = props

  const { fps } = useVideoConfig()
  const currentFrame = useCurrentFrame()
  const ref = useRef<HTMLDivElement>(null)

  const elementX = element.x
  const elementY = element.y
  const elementRotate = element.rotate || 0
  const elementScaleX = element.scaleX || 1
  const elementScaleY = element.scaleY || 1
  const elementOpacity = element.opacity || 1
  const anchorX = element.anchor?.x || 0
  const anchorY = element.anchor?.y || 0

  useRegisterBox({
    id: element.id,
    ref,
    parent: element.parent,
    children: element.children,
  })

  const animationData = useMemo(() => {
    return {
      translateX: currentFrame * 1,
      translateY: currentFrame * 1,
    }
  }, [currentFrame, fps])

  return (
    // 外层div是用来展示元素所在的位置, 以及元素的样式
    <div
      ref={ref}
      // 坐标系的原点在画布的中心点, 所以也需要默认将元素的位置设置在画布的中心点
      style={{
        width: element.width || 'max-content',
        height: element.height || 'max-content',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transformOrigin: `${50 + anchorX}% ${50 + anchorY}%`,
        transform: [
          `translate(${-50 - anchorX}%,${-50 - anchorY}%)`,
          `translate(${elementX}px,${elementY}px)`,
          `rotate(${elementRotate}deg)`,
          `scale(${elementScaleX},${elementScaleY})`,
        ].join(' '),
        opacity: elementOpacity,
        mixBlendMode: element.blendMode as CSSProperties['mixBlendMode'],
        ...style,
      }}
    >
      {/* 内层div是用来展示元素的动画所在的位置, 以及元素的样式 */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transformOrigin: 'center',
          position: 'relative',
          transform: [`translate(${animationData.translateX}%,${animationData.translateY}%)`].join(
            ' '
          ),
        }}
      >
        {children}
      </div>
    </div>
  )
})
