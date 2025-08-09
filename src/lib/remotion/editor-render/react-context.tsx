import {
  createContext,
  useContext,
  type PropsWithChildren,
  type RefObject,
  useLayoutEffect,
} from 'react'

export type BoxRegisterParams = {
  parent?: string
  children?: string[]
  ref?: RefObject<HTMLElement | null>
}

/**
 * @description 渲染器上下文
 * @property {Partial<Record<string, BoxRegisterParams>>} box 盒子注册参数
 * @property {Partial<Record<string, Record<string, (...args: any[]) => void>>>} handler 事件注册参数
 */
export type RendererContextValue = {
  /** { [elementId]: {parent: ParentElementId, children: ChildElementId[], ref: ElementDomRef} } */
  box: Partial<Record<string, BoxRegisterParams>>
  /** { [elementId]: { [eventName]: (...args: any[]) => void } } */
  handler: Partial<Record<string, Record<string, (...args: any[]) => void>>>
}

const RendererContext = createContext<RendererContextValue | null>(null)

export function getContextValue(): RendererContextValue {
  return { box: {}, handler: {} }
}

export function RendererContextProvider(
  props: PropsWithChildren<{ value?: RendererContextValue }>
) {
  const { value, children } = props

  return (
    <RendererContext.Provider value={value ?? getContextValue()}>
      {children}
    </RendererContext.Provider>
  )
}

export function useRendererContext() {
  const context = useContext(RendererContext)
  if (!context) {
    throw new Error('useEditorRenderContext must be used within a EditorRenderContextProvider')
  }
  return context
}

export function useRegisterBox(params: BoxRegisterParams & { id: string }) {
  const { id, ref, parent, children } = params
  const context = useRendererContext()

  useLayoutEffect(() => {
    if (!context) return

    if (context.box[id]) {
      console.warn(`box already registered: ${id}`)
    }

    context.box[id] = {
      ref,
      parent,
      children,
    }
    return () => {
      delete context.box[id]
    }
  }, [])
}

export function useRegisterHandler(params: {
  id: string
  eventName: string
  handler: (...args: any[]) => void
}) {
  const { id, eventName, handler } = params
  const context = useRendererContext()

  useLayoutEffect(() => {
    if (!context) return
    const { handler: handlerContext } = context
    handlerContext[id] = handlerContext[id] ?? {}
    handlerContext[id]![eventName] = handler

    // 清理函数：组件卸载时执行
    return () => {
      if (handlerContext[id]?.[eventName]) {
        delete handlerContext[id]?.[eventName]
      }
    }
  }, [])
}
