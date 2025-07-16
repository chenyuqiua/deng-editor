import { memo } from 'react'
import { cn } from '../../../util/css'
import type { DraftDataType } from '@/lib/remotion/editor-render/schema/draft'
import { EditorPlayer } from '@/lib/remotion/editor-render/player'

interface IProps {
  className?: string
}

export const Stage = memo((props: IProps) => {
  const { className } = props

  const draft: DraftDataType = {
    name: 'test',
    meta: {
      width: 400,
      height: 200,
      fps: 30,
    },
    timeline: {
      assets: {
        test_image_1: {
          type: 'image',
          width: 200,
          height: 300,
          id: 'test_image_1',
          src: 'https://picsum.photos/200/300',
        },
        test_audio_1: {
          id: 'test_audio_1',
          type: 'audio',
          src: 'https://www.soundjay.com/Human/human-laugh-1.wav',
          duration: 2,
        },
      },
      elements: {
        test_audio_1: {
          type: 'audio',
          id: 'test_audio_1',
          assetId: 'test_image_1',
          start: 0,
          length: 2,
        },
        test_image_1: {
          type: 'image',
          id: 'test_image_1',
          assetId: 'test_image_1',
          start: 0,
          length: 2,
          width: 200,
          height: 300,
          crop: {
            x: 0,
            y: 0,
            width: 200,
            height: 300,
          },
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          rotate: 0,
        },
      },
      tracks: [
        {
          id: 'track-1',
          type: 'audio',
          clips: [{ elementId: 'test_audio_1' }, { elementId: 'test_image_1' }],
        },
      ],
      fonts: [],
    },
  }

  return (
    <div
      className={cn('flex size-full items-center justify-center', className)}
    >
      <EditorPlayer draft={draft} />
    </div>
  )
})
