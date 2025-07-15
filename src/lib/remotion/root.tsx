import React from 'react'
import { Composition } from 'remotion'

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Empty"
        component={() => <div>123321</div>}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  )
}
