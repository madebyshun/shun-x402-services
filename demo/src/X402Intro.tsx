import React from 'react'
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from 'remotion'

// ─── helpers ────────────────────────────────────────────────────────────────

function fadeUp(frame: number, start: number, dur = 18) {
  const f = Math.max(0, frame - start)
  const opacity = interpolate(f, [0, dur], [0, 1], { extrapolateRight: 'clamp' })
  const y = interpolate(f, [0, dur], [40, 0], { extrapolateRight: 'clamp' })
  return { opacity, transform: `translateY(${y}px)` }
}

function fadeIn(frame: number, start: number, dur = 15) {
  const f = Math.max(0, frame - start)
  return interpolate(f, [0, dur], [0, 1], { extrapolateRight: 'clamp' })
}

function scaleIn(frame: number, start: number, fps: number) {
  return spring({ frame: frame - start, fps, config: { damping: 14, stiffness: 120 } })
}

// ─── design tokens ──────────────────────────────────────────────────────────

const BG = '#050508'
const BLUE = '#4FC3F7'
const PURPLE = '#A78BFA'
const WHITE = '#F9FAFB'
const DIM = '#6B7280'
const GREEN = '#34D399'
const RED = '#F87171'
const FONT = 'system-ui, -apple-system, sans-serif'
const MONO = '"SF Mono", "Fira Code", monospace'

// ─── reusable components ────────────────────────────────────────────────────

function Pill({ text, color, frame, start }: { text: string; color: string; frame: number; start: number }) {
  const opacity = fadeIn(frame, start)
  return (
    <span style={{
      opacity,
      display: 'inline-block',
      padding: '6px 18px',
      borderRadius: 999,
      border: `1px solid ${color}`,
      color,
      fontSize: 22,
      fontFamily: MONO,
      letterSpacing: 2,
    }}>
      {text}
    </span>
  )
}

function BigStat({ value, label, color, frame, start }: { value: string; label: string; color: string; frame: number; start: number }) {
  const style = fadeUp(frame, start)
  return (
    <div style={{ ...style, textAlign: 'center' }}>
      <div style={{ fontSize: 96, fontWeight: 900, color, lineHeight: 1, fontFamily: FONT }}>{value}</div>
      <div style={{ fontSize: 24, color: DIM, marginTop: 8, fontFamily: FONT }}>{label}</div>
    </div>
  )
}

// ─── scenes ─────────────────────────────────────────────────────────────────

// Scene 1 (0–120): "AI agents are moving money."
function Scene1({ frame }: { frame: number }) {
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24, padding: 80 }}>
      <div style={{ ...fadeUp(frame, 10), textAlign: 'center', fontSize: 72, fontWeight: 900, color: WHITE, fontFamily: FONT, lineHeight: 1.1 }}>
        AI agents are<br />moving money.
      </div>
      <div style={{ ...fadeUp(frame, 35), textAlign: 'center', fontSize: 32, color: DIM, fontFamily: FONT }}>
        But who's watching?
      </div>
    </AbsoluteFill>
  )
}

// Scene 2 (120–240): Problem stats
function Scene2({ frame }: { frame: number }) {
  const f = frame - 120
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 60, padding: 80 }}>
      <div style={{ ...fadeUp(f, 0), textAlign: 'center', fontSize: 36, color: DIM, fontFamily: FONT }}>
        Without a security layer:
      </div>
      {[
        { icon: '🪤', text: 'Honeypot tokens drain funds', delay: 15 },
        { icon: '🥪', text: 'MEV bots sandwich swaps', delay: 30 },
        { icon: '♾️', text: 'Unlimited approvals = exposure', delay: 45 },
        { icon: '📉', text: 'No circuit breaker on losses', delay: 60 },
      ].map(({ icon, text, delay }) => (
        <div key={text} style={{
          ...fadeUp(f, delay),
          display: 'flex', alignItems: 'center', gap: 24,
          fontSize: 40, color: RED, fontFamily: FONT, fontWeight: 700,
        }}>
          <span style={{ fontSize: 48 }}>{icon}</span>
          <span>{text}</span>
        </div>
      ))}
    </AbsoluteFill>
  )
}

// Scene 3 (240–360): BlueAgent intro
function Scene3({ frame, fps }: { frame: number; fps: number }) {
  const f = frame - 240
  const logoScale = scaleIn(f, 0, fps)
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 40, padding: 80 }}>
      <div style={{
        transform: `scale(${logoScale})`,
        opacity: Math.min(1, logoScale),
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 100, fontWeight: 900, color: BLUE, fontFamily: FONT, letterSpacing: -2, lineHeight: 1 }}>
          BLUE
        </div>
        <div style={{ fontSize: 100, fontWeight: 900, color: PURPLE, fontFamily: FONT, letterSpacing: -2, lineHeight: 1 }}>
          AGENT
        </div>
      </div>
      <div style={{ ...fadeUp(f, 25), textAlign: 'center', fontSize: 34, color: WHITE, fontFamily: FONT }}>
        Security OS for Autonomous Agents
      </div>
      <div style={{ ...fadeUp(f, 35), display: 'flex', gap: 16 }}>
        <Pill text="Base" color={BLUE} frame={f} start={35} />
        <Pill text="x402" color={PURPLE} frame={f} start={45} />
        <Pill text="USDC" color={GREEN} frame={f} start={55} />
      </div>
    </AbsoluteFill>
  )
}

// Scene 4 (360–480): 31 tools, pay per use
function Scene4({ frame }: { frame: number }) {
  const f = frame - 360
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 64, padding: 80 }}>
      <BigStat value="31" label="pay-per-use tools" color={BLUE} frame={f} start={0} />
      <div style={{ ...fadeUp(f, 20), textAlign: 'center', fontSize: 28, color: DIM, fontFamily: FONT, lineHeight: 1.6 }}>
        No subscription.<br />No API key.<br />Pay USDC per call.
      </div>
      <div style={{ ...fadeUp(f, 40), display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {[
          { label: '🔴 Security', sub: 'honeypot · MEV · AML', color: RED },
          { label: '🔬 Research', sub: 'analysis · grants · audit', color: '#60A5FA' },
          { label: '📊 Data', sub: 'PnL · whale · DEX flow', color: GREEN },
          { label: '💰 Earn', sub: 'yield · airdrop · LP · tax', color: '#FBBF24' },
        ].map(({ label, sub, color }) => (
          <div key={label} style={{
            padding: '20px 28px',
            borderRadius: 16,
            border: `1px solid ${color}22`,
            background: `${color}0D`,
          }}>
            <div style={{ fontSize: 26, fontWeight: 700, color, fontFamily: FONT }}>{label}</div>
            <div style={{ fontSize: 18, color: DIM, marginTop: 6, fontFamily: MONO }}>{sub}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  )
}

// Scene 5 (480–540): CTA
function Scene5({ frame }: { frame: number }) {
  const f = frame - 480
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 40, padding: 80 }}>
      <div style={{ ...fadeUp(f, 0), textAlign: 'center', fontSize: 52, fontWeight: 900, color: WHITE, fontFamily: FONT, lineHeight: 1.1 }}>
        Your agent.<br />
        <span style={{ color: BLUE }}>Protected.</span>
      </div>
      <div style={{ ...fadeUp(f, 20) }}>
        <div style={{
          padding: '20px 40px',
          borderRadius: 12,
          background: '#1C1C2E',
          border: `1px solid ${PURPLE}44`,
          fontFamily: MONO,
          fontSize: 28,
          color: PURPLE,
        }}>
          npx @blueagent/skill install --claude
        </div>
      </div>
      <div style={{ ...fadeUp(f, 35), textAlign: 'center', fontSize: 24, color: DIM, fontFamily: FONT }}>
        github.com/madebyshun/blueagent-x402-services
      </div>
    </AbsoluteFill>
  )
}

// ─── gradient bg ─────────────────────────────────────────────────────────────

function GradientBG({ frame }: { frame: number }) {
  const hue = interpolate(frame, [0, 540], [220, 280])
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 50% 20%, hsl(${hue},60%,8%) 0%, ${BG} 70%)`,
    }} />
  )
}

// ─── main ────────────────────────────────────────────────────────────────────

export function X402Intro() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: FONT }}>
      <GradientBG frame={frame} />

      {frame < 125 && <Scene1 frame={frame} />}
      {frame >= 115 && frame < 245 && (
        <div style={{ opacity: interpolate(frame, [115, 125], [0, 1], { extrapolateRight: 'clamp' }) }}>
          <Scene2 frame={frame} />
        </div>
      )}
      {frame >= 235 && frame < 365 && (
        <div style={{ opacity: interpolate(frame, [235, 245], [0, 1], { extrapolateRight: 'clamp' }) }}>
          <Scene3 frame={frame} fps={fps} />
        </div>
      )}
      {frame >= 355 && frame < 485 && (
        <div style={{ opacity: interpolate(frame, [355, 365], [0, 1], { extrapolateRight: 'clamp' }) }}>
          <Scene4 frame={frame} />
        </div>
      )}
      {frame >= 475 && (
        <div style={{ opacity: interpolate(frame, [475, 485], [0, 1], { extrapolateRight: 'clamp' }) }}>
          <Scene5 frame={frame} />
        </div>
      )}
    </AbsoluteFill>
  )
}
