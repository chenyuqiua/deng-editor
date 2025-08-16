import { memo } from 'react'
import { getTextList } from '../../mock/resource'
import { useResourcePanelViewController } from '../bootstrap/react-context'
import { TextCard } from '../component/text-card'

export const TextPanel = memo(() => {
  const vc = useResourcePanelViewController()

  return (
    <div className="flex h-full flex-col px-6">
      <div className="flex h-[64px] shrink-0 items-center text-xl font-semibold">Text</div>
      <div className="h-[calc(100%-64px)]overflow-y-auto flex flex-col gap-3">
        {getTextList().map(i => {
          return (
            <TextCard
              key={i.id}
              style={i.styles.display}
              onClick={() => {
                vc.draftOperationManager.insertElement({
                  type: 'text',
                  text: i.name,
                  data: {
                    style: { ...i.styles.common, ...i.styles.element },
                  },
                })
              }}
            >
              {i.name}
            </TextCard>
          )
        })}
      </div>
    </div>
  )
})
