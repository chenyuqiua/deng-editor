import { memo } from 'react'
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion'

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
      <Sequence from={0} durationInFrames={21}>
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
            src={staticFile('/image/test2.jpg')}
            style={{
              userSelect: 'none',
              position: 'relative',
            }}
          />
        </div>
      </Sequence>
      <Sequence from={20} durationInFrames={21}>
        <div
          style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <OffthreadVideo
            src={staticFile('/video/test1.mp4')}
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
