import React, { memo, useRef, type CSSProperties, type PropsWithChildren } from 'react'
import type { AllElement } from '../schema/element'
import { useRegisterBox } from '../react-context'

type IProps = PropsWithChildren<{
  element: AllElement
  style?: CSSProperties
}>

/**
 * 这个组件是用来统一处理元素animation动画, 以及将元素的dom信息进行存储, 方便后续的编辑操作
 * 目前只有dom信息存储的功能, 后续需要实现动画的处理
 */
export const VisualContainer = memo((props: IProps) => {
  const { element, style, children } = props

  const ref = useRef<HTMLDivElement>(null)

  useRegisterBox({
    id: element.id,
    ref,
    parent: element.parent,
    children: element.children,
  })

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  )
})
