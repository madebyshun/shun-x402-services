import React from 'react'
import { Composition } from 'remotion'
import { X402Intro } from './X402Intro.js'

export function RemotionRoot() {
  return (
    <Composition
      id="BlueAgentDemo"
      component={X402Intro}
      durationInFrames={900}
      fps={30}
      width={1920}
      height={1080}
    />
  )
}
