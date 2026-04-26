import React from 'react'
import { AbsoluteFill, Sequence, useCurrentFrame, spring, useVideoConfig } from 'remotion'
import { Typewriter, useVisible, useFadeIn } from './Typewriter'

const FONT = '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace'

const BLUE = '#4FC3F7'
const PURPLE = '#C084FC'
const RED = '#F87171'
const GREEN = '#34D399'
const DIM = '#4B5563'
const BG = '#0D1117'
const TERMINAL_BG = '#161B22'
const BORDER = '#21262D'

const BLUE_ART = [
  ' ██████╗ ██╗     ██╗   ██╗███████╗',
  ' ██╔══██╗██║     ██║   ██║██╔════╝',
  ' ██████╔╝██║     ██║   ██║█████╗  ',
  ' ██╔══██╗██║     ██║   ██║██╔══╝  ',
  ' ██████╔╝███████╗╚██████╔╝███████╗',
  ' ╚═════╝ ╚══════╝ ╚═════╝ ╚══════╝',
]

const AGENT_ART = [
  ' █████╗  ██████╗ ███████╗███╗   ██╗████████╗',
  '██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝',
  '███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   ',
  '██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   ',
  '██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   ',
  '╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝  ╚═╝   ',
]

function Logo({ startFrame }: { startFrame: number }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <div style={{ fontFamily: FONT, fontSize: 13, lineHeight: 1.4 }}>
      {BLUE_ART.map((line, i) => {
        const opacity = useFadeIn(startFrame + i * 4)
        return (
          <div key={i} style={{ color: BLUE, opacity, fontWeight: 'bold' }}>{line}</div>
        )
      })}
      {AGENT_ART.map((line, i) => {
        const opacity = useFadeIn(startFrame + 24 + i * 4)
        return (
          <div key={i} style={{ color: PURPLE, opacity, fontWeight: 'bold' }}>{line}</div>
        )
      })}
      {(() => {
        const opacity = useFadeIn(startFrame + 50)
        return (
          <div style={{ color: DIM, opacity, marginTop: 8 }}>
            {'  Security OS for Autonomous Agents  ·  Base  ·  x402'}
          </div>
        )
      })()}
    </div>
  )
}

function Separator({ startFrame, color = BORDER }: { startFrame: number; color?: string }) {
  const opacity = useFadeIn(startFrame)
  return (
    <div style={{ opacity, color, fontFamily: FONT, fontSize: 13, margin: '8px 0' }}>
      {'─'.repeat(52)}
    </div>
  )
}

function CategoryMenu({ startFrame }: { startFrame: number }) {
  const items = [
    { label: 'Security', tools: '12 tools', desc: 'agent safety, quantum, AML', color: RED, selected: true },
    { label: 'Research', tools: ' 9 tools', desc: 'due diligence, grants, x402', color: '#60A5FA', selected: false },
    { label: 'Data    ', tools: ' 4 tools', desc: 'PnL, whale flow, DEX pressure', color: GREEN, selected: false },
    { label: 'Earn    ', tools: ' 4 tools', desc: 'yield, airdrop, LP, tax', color: '#FBBF24', selected: false },
  ]

  return (
    <div style={{ fontFamily: FONT, fontSize: 13 }}>
      <Separator startFrame={startFrame} />
      {items.map((item, i) => {
        const opacity = useFadeIn(startFrame + i * 6)
        return (
          <div key={i} style={{ opacity, display: 'flex', gap: 8, marginBottom: 4 }}>
            <span style={{ color: item.selected ? item.color : DIM, fontWeight: 'bold' }}>
              {item.selected ? '▶ ' : '  '}
            </span>
            <span style={{ color: item.selected ? item.color : '#9CA3AF', fontWeight: item.selected ? 'bold' : 'normal', width: 80 }}>
              {item.label}
            </span>
            <span style={{ color: item.selected ? item.color : DIM, width: 70 }}>
              {item.tools}
            </span>
            <span style={{ color: item.selected ? '#9CA3AF' : DIM }}>
              {item.desc}
            </span>
          </div>
        )
      })}
      <Separator startFrame={startFrame + 30} />
      {(() => {
        const opacity = useFadeIn(startFrame + 35)
        return (
          <div style={{ color: DIM, opacity, fontFamily: FONT, fontSize: 12 }}>
            {'  ctrl+c quit  ·  ↑↓ navigate  ·  enter select'}
          </div>
        )
      })()}
    </div>
  )
}

function ToolResult({ startFrame }: { startFrame: number }) {
  const opacity = useFadeIn(startFrame)
  const frame = useCurrentFrame()

  return (
    <div style={{ fontFamily: FONT, fontSize: 13, opacity }}>
      <div style={{ color: GREEN, fontWeight: 'bold', marginBottom: 8 }}>✓ honeypot-check result</div>
      <div style={{ color: BORDER }}>{'─'.repeat(52)}</div>
      <div style={{ marginTop: 8, color: '#D1FAE5' }}>
        <div><span style={{ color: DIM }}>verdict:       </span><span style={{ color: GREEN, fontWeight: 'bold' }}>SAFE ✓</span></div>
        <div><span style={{ color: DIM }}>isHoneypot:    </span><span style={{ color: GREEN }}>false</span></div>
        <div><span style={{ color: DIM }}>riskScore:     </span><span style={{ color: GREEN }}>12/100</span></div>
        <div><span style={{ color: DIM }}>liquidity:     </span><span style={{ color: '#9CA3AF' }}>$4.2M locked</span></div>
        <div><span style={{ color: DIM }}>holders:       </span><span style={{ color: '#9CA3AF' }}>18,420</span></div>
        <div><span style={{ color: DIM }}>cost:          </span><span style={{ color: BLUE }}>$0.05 USDC paid via x402</span></div>
      </div>
      <div style={{ color: BORDER, marginTop: 8 }}>{'─'.repeat(52)}</div>
    </div>
  )
}

export function BlueAgentDemo() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Timeline (at 30fps):
  // 0-20:    prompt appears
  // 20-90:   npx command types
  // 90-180:  BLUE AGENT logo fades in line by line
  // 180-240: category menu appears
  // 240-290: transition to honeypot-check input
  // 290-350: token address types
  // 350-380: "calling..." spinner
  // 380-450: result appears

  const showPrompt = frame >= 10
  const showLogo = frame >= 90
  const showMenu = frame >= 185
  const showToolInput = frame >= 245
  const showSpinner = frame >= 310 && frame < 355
  const showResult = frame >= 355

  const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  const spinnerChar = spinnerFrames[Math.floor(frame / 3) % spinnerFrames.length]

  return (
    <AbsoluteFill style={{ background: BG, padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        background: TERMINAL_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        width: '100%',
        maxWidth: 860,
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
      }}>
        {/* Title bar */}
        <div style={{
          background: '#1C2128',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderBottom: `1px solid ${BORDER}`,
        }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FEBC2E' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840' }} />
          <span style={{ color: DIM, fontFamily: FONT, fontSize: 12, marginLeft: 8 }}>blueagent — terminal</span>
        </div>

        {/* Terminal content */}
        <div style={{ padding: 24, fontFamily: FONT, fontSize: 13, lineHeight: 1.7, minHeight: 480 }}>

          {/* Prompt + command */}
          {showPrompt && (
            <div style={{ marginBottom: 16, opacity: useFadeIn(10) }}>
              <span style={{ color: GREEN }}>❯ </span>
              <Typewriter
                text="npx @blueagent/cli@latest"
                startFrame={15}
                charsPerFrame={0.8}
                style={{ color: '#F9FAFB' }}
              />
            </div>
          )}

          {/* Logo */}
          {showLogo && <Logo startFrame={90} />}

          {/* Category menu */}
          {showMenu && !showToolInput && <CategoryMenu startFrame={185} />}

          {/* Tool runner */}
          {showToolInput && !showResult && (
            <div style={{ fontFamily: FONT, fontSize: 13 }}>
              <div style={{ color: BLUE, fontWeight: 'bold', marginBottom: 8 }}>◆ honeypot-check</div>
              <div style={{ color: BORDER }}>{'─'.repeat(52)}</div>
              <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                <span style={{ color: PURPLE }}>▶ </span>
                <span style={{ color: '#F9FAFB' }}>token</span>
                <span style={{ color: DIM }}> *: </span>
                <Typewriter
                  text="0x4200000000000000000000000000000000000006"
                  startFrame={260}
                  charsPerFrame={0.9}
                  style={{ color: '#F9FAFB' }}
                />
              </div>
              {showSpinner && (
                <div style={{ marginTop: 12, color: BLUE }}>
                  {spinnerChar} Calling <span style={{ color: PURPLE }}>honeypot-check</span> via x402...
                  <div style={{ color: DIM, fontSize: 12 }}>  paying USDC on Base</div>
                </div>
              )}
            </div>
          )}

          {/* Result */}
          {showResult && <ToolResult startFrame={355} />}
        </div>
      </div>

      {/* Bottom badge */}
      {frame > 60 && (
        <div style={{
          position: 'absolute',
          bottom: 24,
          right: 40,
          color: DIM,
          fontFamily: FONT,
          fontSize: 11,
          opacity: useFadeIn(60),
        }}>
          github.com/madebyshun/blueagent-x402-services
        </div>
      )}
    </AbsoluteFill>
  )
}
