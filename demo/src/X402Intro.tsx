import React from 'react'
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion'

// ─── design tokens ─────────────────────────────────────────────────────────
const BG     = '#050508'
const BLUE   = '#4FC3F7'
const PURPLE = '#A78BFA'
const GREEN  = '#34D399'
const RED    = '#F87171'
const AMBER  = '#FBBF24'
const WHITE  = '#F9FAFB'
const DIM    = '#6B7280'
const MONO   = '"SF Mono", "Fira Code", "Cascadia Code", monospace'
const SANS   = 'system-ui, -apple-system, sans-serif'

// ─── helpers ───────────────────────────────────────────────────────────────
function glow(color: string, intensity = 1): React.CSSProperties {
  return {
    textShadow: `0 0 ${20 * intensity}px ${color}CC, 0 0 ${50 * intensity}px ${color}55`,
  }
}

function fadeIn(frame: number, start: number, dur = 12) {
  return interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
}

function fadeUp(frame: number, start: number, dur = 15): React.CSSProperties {
  return {
    opacity: interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    transform: `translateY(${interpolate(frame, [start, start + dur], [28, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
  }
}

// ─── scanlines ─────────────────────────────────────────────────────────────
function Scanlines({ frame }: { frame: number }) {
  return (
    <AbsoluteFill style={{
      pointerEvents: 'none',
      zIndex: 100,
      background: `repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0,0,0,0.10) 2px,
        rgba(0,0,0,0.10) 4px
      )`,
      backgroundPositionY: (frame * 2) % 4,
    }} />
  )
}

// ─── vignette ──────────────────────────────────────────────────────────────
function Vignette() {
  return (
    <AbsoluteFill style={{
      pointerEvents: 'none',
      zIndex: 99,
      background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)',
    }} />
  )
}

// ─── glitch flash on scene transitions ────────────────────────────────────
function GlitchOverlay({ frame, peaks }: { frame: number; peaks: number[] }) {
  const nearest = peaks.reduce((a, b) => Math.abs(b - frame) < Math.abs(a - frame) ? b : a)
  const dist = Math.abs(frame - nearest)
  if (dist > 7) return null
  const intensity = interpolate(dist, [0, 7], [1, 0], { extrapolateRight: 'clamp' })
  const jitter = Math.round(Math.sin(frame * 13.7) * 5 * intensity)
  return (
    <AbsoluteFill style={{
      pointerEvents: 'none',
      zIndex: 101,
      transform: `translateX(${jitter}px)`,
      background: `linear-gradient(${(frame * 37) % 360}deg, rgba(79,195,247,${0.04 * intensity}), rgba(167,139,250,${0.04 * intensity}))`,
    }} />
  )
}

// ─── terminal top bar ──────────────────────────────────────────────────────
function TerminalBar({ frame }: { frame: number }) {
  const opacity = fadeIn(frame, 0, 18)
  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0,
      height: 44,
      background: '#0D1117',
      borderBottom: `1px solid ${BLUE}1A`,
      display: 'flex',
      alignItems: 'center',
      padding: '0 28px',
      gap: 8,
      opacity,
      zIndex: 50,
    }}>
      <div style={{ width: 13, height: 13, borderRadius: '50%', background: RED }} />
      <div style={{ width: 13, height: 13, borderRadius: '50%', background: AMBER }} />
      <div style={{ width: 13, height: 13, borderRadius: '50%', background: GREEN }} />
      <span style={{ marginLeft: 20, fontFamily: MONO, fontSize: 14, color: DIM }}>
        blueagent — security os
      </span>
      <span style={{ marginLeft: 'auto', fontFamily: MONO, fontSize: 13, color: BLUE }}>
        v1.0.0
      </span>
    </div>
  )
}

// ─── Scene 1 (0–150f · 0–5s): BLUEAGENT INTRO ─────────────────────────────
function Scene1({ frame }: { frame: number }) {
  const logoScale = spring({ frame, fps: 30, config: { damping: 14, stiffness: 100 } })
  return (
    <AbsoluteFill style={{
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 20,
    }}>
      {/* badge */}
      <div style={{
        opacity: fadeIn(frame, 35),
        padding: '7px 22px',
        borderRadius: 999,
        border: `1px solid ${PURPLE}55`,
        background: `${PURPLE}0E`,
        fontFamily: MONO,
        fontSize: 17,
        color: PURPLE,
        letterSpacing: 2,
      }}>
        ◉ &nbsp; Built on Base · powered by x402
      </div>

      {/* logo */}
      <div style={{
        transform: `scale(${logoScale})`,
        opacity: Math.min(1, logoScale * 2),
        lineHeight: 0.9,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 170, fontWeight: 900, color: BLUE, fontFamily: SANS, letterSpacing: -5, ...glow(BLUE) }}>
          BLUE
        </div>
        <div style={{ fontSize: 170, fontWeight: 900, color: PURPLE, fontFamily: SANS, letterSpacing: -5, ...glow(PURPLE) }}>
          AGENT
        </div>
      </div>

      {/* tagline */}
      <div style={{
        opacity: fadeIn(frame, 55, 18),
        fontFamily: MONO,
        fontSize: 24,
        color: WHITE,
        letterSpacing: 5,
        textAlign: 'center',
      }}>
        SECURITY OS FOR AUTONOMOUS AGENTS
      </div>

      {/* live badge */}
      <div style={{
        opacity: fadeIn(frame, 72, 15),
        fontFamily: MONO,
        fontSize: 16,
        color: GREEN,
        letterSpacing: 3,
        ...glow(GREEN, 0.6),
      }}>
        ▶ &nbsp; v1.0 · NOW LIVE ON BASE
      </div>
    </AbsoluteFill>
  )
}

// ─── Scene 2 (150–360f · 5–12s): PROBLEM ──────────────────────────────────
function Scene2({ frame }: { frame: number }) {
  const f = frame - 150
  const items = [
    'Honeypot tokens drain your funds',
    'MEV bots sandwich every swap',
    'Unlimited approvals = total exposure',
    'No circuit breaker on losses',
  ]
  return (
    <AbsoluteFill style={{
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 36,
      padding: '80px 160px',
    }}>
      <div style={{
        ...fadeUp(f, 0),
        fontFamily: MONO,
        fontSize: 20,
        color: DIM,
        letterSpacing: 4,
        textAlign: 'center',
      }}>
        WITHOUT A SECURITY LAYER:
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', maxWidth: 900 }}>
        {items.map((text, i) => (
          <div key={text} style={{
            ...fadeUp(f, 18 + i * 28),
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            padding: '18px 28px',
            borderLeft: `3px solid ${RED}`,
            background: `${RED}08`,
          }}>
            <span style={{ fontFamily: MONO, fontSize: 20, color: RED, flexShrink: 0 }}>→</span>
            <span style={{ fontFamily: MONO, fontSize: 28, color: RED, ...glow(RED, 0.35) }}>
              {text}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  )
}

// ─── Scene 3 (360–540f · 12–18s): TOOLS LIST ──────────────────────────────
function Scene3({ frame }: { frame: number }) {
  const f = frame - 360
  const tools = [
    { name: 'honeypot_check',    price: '$0.05', color: BLUE },
    { name: 'rug_pull_risk',     price: '$0.10', color: BLUE },
    { name: 'approval_guard',    price: '$0.05', color: PURPLE },
    { name: 'mev_exposure',      price: '$0.10', color: PURPLE },
    { name: 'circuit_breaker',   price: '$0.25', color: GREEN },
    { name: 'wallet_risk_score', price: '$0.15', color: GREEN },
  ]
  return (
    <AbsoluteFill style={{
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 28,
      padding: '80px 160px',
    }}>
      {/* counter */}
      <div style={{ ...fadeUp(f, 0), textAlign: 'center' }}>
        <div style={{ fontFamily: MONO, fontSize: 17, color: DIM, letterSpacing: 4, marginBottom: 4 }}>
          NOW SHIPPING
        </div>
        <div style={{ fontSize: 110, fontWeight: 900, color: BLUE, fontFamily: SANS, lineHeight: 1, ...glow(BLUE) }}>
          31
        </div>
        <div style={{ fontFamily: MONO, fontSize: 22, color: WHITE, letterSpacing: 3 }}>
          SECURITY TOOLS
        </div>
      </div>

      {/* tool list */}
      <div style={{ width: '100%', maxWidth: 800, ...fadeUp(f, 18) }}>
        {tools.map((t, i) => (
          <div key={t.name} style={{
            ...fadeUp(f, 28 + i * 16),
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 4px',
            borderBottom: `1px solid ${t.color}1A`,
          }}>
            <span style={{ fontFamily: MONO, fontSize: 24, color: t.color, ...glow(t.color, 0.25) }}>
              {t.name}
            </span>
            <span style={{ fontFamily: MONO, fontSize: 22, color: GREEN }}>
              {t.price} / call
            </span>
          </div>
        ))}
        <div style={{ ...fadeUp(f, 130), textAlign: 'right', fontFamily: MONO, fontSize: 15, color: DIM, marginTop: 10 }}>
          + 25 more tools across Security · Research · Data · Earn
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ─── Scene 4 (540–690f · 18–23s): x402 / NO API KEY ──────────────────────
function Scene4({ frame }: { frame: number }) {
  const f = frame - 540
  return (
    <AbsoluteFill style={{
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 44,
      padding: '80px 160px',
    }}>
      <div style={{
        ...fadeUp(f, 0),
        textAlign: 'center',
        fontFamily: MONO,
        fontWeight: 900,
        fontSize: 52,
        lineHeight: 1.25,
        letterSpacing: 1,
      }}>
        <span style={{ color: WHITE }}>NO API KEY.<br /></span>
        <span style={{ color: BLUE, ...glow(BLUE) }}>NO SUBSCRIPTION.</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 720 }}>
        {[
          { text: 'Pay USDC per call.', color: GREEN },
          { text: 'Settled on Base via x402.', color: GREEN },
          { text: 'Each call signed by your wallet.', color: DIM },
          { text: 'Nothing to rotate. Nothing to steal.', color: DIM },
        ].map((item, i) => (
          <div key={i} style={{
            ...fadeUp(f, 22 + i * 18),
            fontFamily: MONO,
            fontSize: 26,
            color: item.color,
            textAlign: 'center',
          }}>
            {item.text}
          </div>
        ))}
      </div>

      {/* API key vs x402 */}
      <div style={{ ...fadeUp(f, 105), display: 'flex', gap: 20, alignItems: 'center' }}>
        <div style={{
          padding: '12px 28px',
          borderRadius: 8,
          border: `1px solid ${RED}44`,
          background: `${RED}0A`,
          fontFamily: MONO,
          fontSize: 19,
          color: RED,
        }}>
          API key &nbsp;→ leaked
        </div>
        <div style={{ fontFamily: MONO, fontSize: 20, color: DIM }}>vs</div>
        <div style={{
          padding: '12px 28px',
          borderRadius: 8,
          border: `1px solid ${GREEN}44`,
          background: `${GREEN}0A`,
          fontFamily: MONO,
          fontSize: 19,
          color: GREEN,
        }}>
          x402 &nbsp;→ wallet signature
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ─── Scene 5 (690–810f · 23–27s): STATS ───────────────────────────────────
function Scene5({ frame }: { frame: number }) {
  const f = frame - 690
  const stats = [
    { value: '31',     label: 'TOOLS',     color: BLUE },
    { value: '$0.05',  label: 'MIN / CALL', color: GREEN },
    { value: '<200ms', label: 'LATENCY',   color: PURPLE },
  ]
  const cats = [
    { label: 'Security', color: RED },
    { label: 'Research', color: BLUE },
    { label: 'Data',     color: GREEN },
    { label: 'Earn',     color: AMBER },
  ]
  return (
    <AbsoluteFill style={{
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 56,
      padding: '80px 100px',
    }}>
      <div style={{ ...fadeUp(f, 0), fontFamily: MONO, fontSize: 18, color: DIM, letterSpacing: 4 }}>
        NOW LIVE ON BASE
      </div>

      {/* big stats */}
      <div style={{ display: 'flex', gap: 80, alignItems: 'center' }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{ ...fadeUp(f, 14 + i * 18), textAlign: 'center' }}>
            <div style={{
              fontSize: 88,
              fontWeight: 900,
              color: s.color,
              fontFamily: SANS,
              lineHeight: 1,
              ...glow(s.color),
            }}>
              {s.value}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 16, color: DIM, letterSpacing: 3, marginTop: 10 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* category pills */}
      <div style={{ ...fadeUp(f, 75), display: 'flex', gap: 14 }}>
        {cats.map(c => (
          <div key={c.label} style={{
            padding: '10px 24px',
            borderRadius: 6,
            border: `1px solid ${c.color}44`,
            background: `${c.color}0D`,
            fontFamily: MONO,
            fontSize: 17,
            color: c.color,
          }}>
            {c.label}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  )
}

// ─── Scene 6 (810–900f · 27–30s): INSTALL CTA ─────────────────────────────
function Scene6({ frame }: { frame: number }) {
  const f = frame - 810
  const logoScale = spring({ frame: f, fps: 30, config: { damping: 13, stiffness: 110 } })
  const cursor = frame % 28 < 18 ? '█' : ' '
  return (
    <AbsoluteFill style={{
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 36,
      padding: '80px 160px',
    }}>
      {/* logo */}
      <div style={{
        transform: `scale(${logoScale})`,
        opacity: Math.min(1, logoScale),
        lineHeight: 0.9,
        textAlign: 'center',
      }}>
        <span style={{ fontSize: 90, fontWeight: 900, color: BLUE, fontFamily: SANS, letterSpacing: -3, ...glow(BLUE) }}>BLUE</span>
        <span style={{ fontSize: 90, fontWeight: 900, color: PURPLE, fontFamily: SANS, letterSpacing: -3, ...glow(PURPLE) }}>AGENT</span>
      </div>

      <div style={{ ...fadeUp(f, 14), fontFamily: MONO, fontSize: 26, color: WHITE, textAlign: 'center' }}>
        Your agent. &nbsp;<span style={{ color: BLUE, ...glow(BLUE, 0.5) }}>Protected.</span>
      </div>

      {/* install command */}
      <div style={{
        ...fadeUp(f, 28),
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '22px 44px',
        borderRadius: 12,
        background: '#0D1117',
        border: `1px solid ${PURPLE}44`,
        fontFamily: MONO,
        fontSize: 27,
        color: PURPLE,
        ...glow(PURPLE, 0.3),
      }}>
        <span style={{ color: DIM }}>$</span>
        <span>npx @blueagent/skill install --claude</span>
        <span style={{ color: BLUE, ...glow(BLUE, 0.5) }}>{cursor}</span>
      </div>

      <div style={{ ...fadeUp(f, 50), textAlign: 'center', fontFamily: MONO, fontSize: 15, color: DIM, lineHeight: 2 }}>
        Works with Claude Code · AgentKit · Any MCP host<br />
        <span style={{ color: GREEN }}>github.com/madebyshun/blueagent-x402-services</span>
      </div>
    </AbsoluteFill>
  )
}

// ─── main composition ──────────────────────────────────────────────────────
export function X402Intro() {
  const frame = useCurrentFrame()

  const GLITCH_PEAKS = [150, 360, 540, 690, 810]

  function sceneOpacity(start: number, end: number) {
    return interpolate(
      frame,
      [start, start + 8, end - 8, end],
      [0, 1, 1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    )
  }

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Scanlines frame={frame} />
      <Vignette />
      <GlitchOverlay frame={frame} peaks={GLITCH_PEAKS} />
      <TerminalBar frame={frame} />

      {frame < 155 && (
        <div style={{ opacity: sceneOpacity(0, 150) }}>
          <Scene1 frame={frame} />
        </div>
      )}
      {frame >= 145 && frame < 365 && (
        <div style={{ opacity: sceneOpacity(150, 360) }}>
          <Scene2 frame={frame} />
        </div>
      )}
      {frame >= 355 && frame < 545 && (
        <div style={{ opacity: sceneOpacity(360, 540) }}>
          <Scene3 frame={frame} />
        </div>
      )}
      {frame >= 535 && frame < 695 && (
        <div style={{ opacity: sceneOpacity(540, 690) }}>
          <Scene4 frame={frame} />
        </div>
      )}
      {frame >= 685 && frame < 815 && (
        <div style={{ opacity: sceneOpacity(690, 810) }}>
          <Scene5 frame={frame} />
        </div>
      )}
      {frame >= 805 && (
        <div style={{ opacity: sceneOpacity(810, 900) }}>
          <Scene6 frame={frame} />
        </div>
      )}
    </AbsoluteFill>
  )
}
