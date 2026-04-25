import React from 'react'
import { useCurrentFrame, interpolate } from 'remotion'

interface Props {
  text: string
  startFrame: number
  charsPerFrame?: number
  style?: React.CSSProperties
}

export function Typewriter({ text, startFrame, charsPerFrame = 0.5, style }: Props) {
  const frame = useCurrentFrame()
  const elapsed = Math.max(0, frame - startFrame)
  const charsToShow = Math.min(text.length, Math.floor(elapsed * charsPerFrame))
  const cursor = frame % 30 < 20 ? '█' : ' '

  return (
    <span style={style}>
      {text.slice(0, charsToShow)}
      {charsToShow < text.length && cursor}
    </span>
  )
}

export function useVisible(startFrame: number, endFrame?: number) {
  const frame = useCurrentFrame()
  return frame >= startFrame && (endFrame === undefined || frame < endFrame)
}

export function useFadeIn(startFrame: number, durationFrames = 8) {
  const frame = useCurrentFrame()
  return interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
}
