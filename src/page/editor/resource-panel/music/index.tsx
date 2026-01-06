import { memo } from 'react'
import { getMusicList } from '../../mock/resource'
import { AudioCard } from '../block/audio-card'
import { useResourcePanelViewController } from '../context/resource-panel.context'

export const MusicPanel = memo(() => {
  const vc = useResourcePanelViewController()

  return (
    <div className="flex h-full flex-col px-6">
      <div className="flex h-[64px] shrink-0 items-center text-xl font-semibold">Music</div>
      <div className="h-[calc(100%-64px)]overflow-y-auto flex flex-col gap-3">
        {getMusicList().map(music => {
          return (
            <AudioCard
              key={music.id}
              onInsert={() => {
                vc.draftOperationManager.insertElement({
                  type: 'audio',
                  url: music.url,
                })
              }}
              src={music.url}
              name={music.name}
              cover={music.cover}
            />
          )
        })}
      </div>
    </div>
  )
})
