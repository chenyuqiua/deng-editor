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

export type RendererContextValue = {
  /** { [elementId]: {parent: ParentElementId, children: ChildElementId[], ref: ElementDomRef} } */
  box: Partial<Record<string, BoxRegisterParams>>
}

const RendererContext = createContext<RendererContextValue | null>(null)

export function getContextValue(): RendererContextValue {
  return { box: {} }
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
