import React from 'react'
import { Composition } from 'remotion'
import { testDraft } from './editor-render/mock/test-draft'
import { Renderer } from './editor-render/renderer'
import { TestComponent } from './test-component'

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Test"
        component={TestComponent}
        durationInFrames={5 * 30}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="Player"
        component={() => <Renderer draft={testDraft} />}
        durationInFrames={5 * 30}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  )
}
