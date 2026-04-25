import React from 'react'
import { Composition } from 'remotion'
import { BlueAgentDemo } from './BlueAgentDemo.js'

export function RemotionRoot() {
  return (
    <Composition
      id="BlueAgentDemo"
      component={BlueAgentDemo}
      durationInFrames={450}
      fps={30}
      width={1200}
      height={675}
    />
  )
}
