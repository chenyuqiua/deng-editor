import { memo } from 'react'
import { AbsoluteFill, Img, Sequence, useCurrentFrame } from 'remotion'

export const TestComponent = memo(() => {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 100,
        backgroundColor: 'white',
      }}
    >
      <Sequence from={20} durationInFrames={21}>
        The current frame is {frame}.
        <div
          style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Img
            draggable={false}
            src={
              'https://cdn.pixabay.com/photo/2025/06/10/11/21/view-9651981_640.jpg'
            }
            style={{
              userSelect: 'none',
              position: 'relative',
            }}
          />
        </div>
      </Sequence>
    </AbsoluteFill>
  )
})
