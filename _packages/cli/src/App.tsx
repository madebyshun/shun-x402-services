import React, { useState } from 'react'
import { Box } from 'ink'
import { Logo } from './Logo.js'
import { CategoryMenu, type Category } from './components/CategoryMenu.js'
import { ToolMenu } from './components/ToolMenu.js'
import { ToolRunner } from './components/ToolRunner.js'
import { BlueAgent } from '@blueagent/sdk'

type Screen = 'home' | 'tools' | 'runner'

const WALLET_KEY = process.env.WALLET_PRIVATE_KEY ?? ''

export function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [category, setCategory] = useState<Category>('security')
  const [endpoint, setEndpoint] = useState('')
  const [params, setParams] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<unknown>(null)
  const [error, setError] = useState<string | null>(null)

  async function runTool(ep: string, body: Record<string, string>) {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const ba = new BlueAgent({ privateKey: WALLET_KEY })
      const category_obj = ba[category as keyof typeof ba] as any
      // Find the method that maps to the endpoint
      const res = await fetch(`https://x402.bankr.bot/0xf31f59e7b8b58555f7871f71973a394c8f1bffe5/${ep}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then(r => r.json())
      setResult(res)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Logo />
      {screen === 'home' && (
        <CategoryMenu
          onSelect={(cat) => { setCategory(cat); setScreen('tools') }}
        />
      )}
      {screen === 'tools' && (
        <ToolMenu
          category={category}
          onSelect={(ep, ps) => {
            setEndpoint(ep)
            setParams(ps)
            setResult(null)
            setError(null)
            setScreen('runner')
          }}
          onBack={() => setScreen('home')}
        />
      )}
      {screen === 'runner' && (
        <ToolRunner
          endpoint={endpoint}
          params={params}
          onRun={runTool}
          onBack={() => setScreen('tools')}
          loading={loading}
          result={result}
          error={error}
        />
      )}
    </Box>
  )
}
