import { cn } from '@/common/util/css'
import { useAudio } from 'react-use'
import { memo, type HTMLAttributes } from 'react'
import { IconButton } from '@/component/ui/button'
import { IconPark } from '@/lib/iconpark'
import { format } from 'date-fns'
import { VirtualDiv } from '@/component/ui/virtual-div'
import { useResourcePanelViewController } from '../context/resource-panel.context'

interface AudioCardProps extends HTMLAttributes<HTMLDivElement> {
  src: string
  name: string
  cover: string
  onInsert?: () => void
}

export const AudioCard = memo((props: AudioCardProps) => {
  const { className, src, name, cover, onInsert, ...rest } = props
  const [audio, state, _, ref] = useAudio({ src })
  const vc = useResourcePanelViewController()

  return (
    <VirtualDiv
      className={cn(
        'group/audio-card relative flex w-full cursor-pointer items-center gap-3 rounded-xl bg-white/10 p-3 select-none',
        'border border-solid border-transparent duration-200 hover:border-[#6C6CF5]',
        className
      )}
      {...rest}
    >
      {audio}
      <div
        className={cn(
          'relative size-12 overflow-hidden rounded-sm bg-white/10',
          state.playing && 'rounded-full'
        )}
      >
        <img
          src={cover}
          className={cn('size-full', state.playing && 'animate-[spin_15s_linear_infinite]')}
        />
        <IconPark
          icon={state.paused ? 'play' : 'pause'}
          color="#fff"
          className="absolute top-0 left-0 size-full"
          onClick={e => {
            e.stopPropagation()
            if (state.paused) vc.mediaPlayerManager.play(ref.current)
            else vc.mediaPlayerManager.pause()
          }}
        />
      </div>
      <div className="flex h-full flex-1 flex-col gap-2">
        <span className="max-w-[150px] truncate text-sm font-semibold">{name}</span>
        <span className="text-xs text-white/50">{format(state.duration * 1000, 'mm:ss')}</span>
      </div>
      <div className="relative size-8 shrink-0">
        <IconButton
          icon="add"
          variant="primary"
          className={cn(
            'absolute right-0 bottom-0',
            'translate-x-full opacity-0 transition-transform duration-300 group-hover/audio-card:translate-x-0 group-hover/audio-card:opacity-100'
          )}
          onClick={onInsert}
        />
      </div>
    </VirtualDiv>
  )
})
