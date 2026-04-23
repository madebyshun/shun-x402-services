import { callLLM } from '../_lib/llm.js'
import { extractJSON } from '../_lib/json.js'

const DEXSCREENER_URL = 'https://api.dexscreener.com/latest/dex'

async function getDexData(token: string): Promise<any> {
  const isAddress = /^0x[a-fA-F0-9]{40}$/.test(token)
  const url = isAddress
    ? `${DEXSCREENER_URL}/tokens/${token}`
    : `${DEXSCREENER_URL}/search?q=${encodeURIComponent(token)}`

  const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`DexScreener error: ${res.status}`)
  const data = await res.json()

  const pairs = (data.pairs ?? []) as any[]
  return pairs
    .filter((p: any) => p.chainId === 'base')
    .sort((a: any, b: any) => (b.volume?.h24 ?? 0) - (a.volume?.h24 ?? 0))
    .slice(0, 5)
    .map((p: any) => ({
      dex: p.dexId,
      pair: p.baseToken?.symbol + '/' + p.quoteToken?.symbol,
      price: p.priceUsd,
      priceChange1h: p.priceChange?.h1,
      priceChange24h: p.priceChange?.h24,
      volume24h: p.volume?.h24,
      liquidity: p.liquidity?.usd,
      txns24h: (p.txns?.h24?.buys ?? 0) + (p.txns?.h24?.sells ?? 0),
      buys24h: p.txns?.h24?.buys,
      sells24h: p.txns?.h24?.sells,
    }))
}

const SYSTEM = `You are a DEX flow analyst interpreting on-chain trading data for Base chain tokens.

Analyze volume, buy/sell pressure, liquidity, and price action to assess market sentiment and flow direction.

Return ONLY valid JSON:

{
  "token": "string",
  "chain": "base",
  "pressure": "STRONG_BUY" | "BUY" | "NEUTRAL" | "SELL" | "STRONG_SELL",
  "pressureScore": number (0-100, 50=neutral, 100=max buy pressure),
  "volume24h": "string",
  "buySellRatio": "string (e.g. '65% buys / 35% sells')",
  "liquidityHealth": "DEEP" | "MODERATE" | "THIN" | "CRITICAL",
  "priceAction": "string (brief summary of recent price movement)",
  "topPairs": [
    {
      "dex": "string",
      "pair": "string",
      "volume24h": "string",
      "buySellRatio": "string"
    }
  ],
  "signals": ["signal1", "signal2"],
  "recommendation": "string (what does this flow data suggest?)"
}`

export default async function handler(req: Request): Promise<Response> {
  try {
    let body: { token?: string; chain?: string } = {}
    try {
      const text = await req.text()
      if (text?.trim().startsWith('{')) body = JSON.parse(text)
    } catch {}
    const url = new URL(req.url)
    if (!body.token) body.token = url.searchParams.get('token') || url.searchParams.get('address') || undefined

    const { token } = body
    if (!token) return Response.json({ error: 'Provide token address or ticker' }, { status: 400 })

    console.log(`[DexFlow] Analyzing flow for: ${token}`)

    let dexData: any[] = []
    try {
      dexData = await getDexData(token)
    } catch (e) {
      console.warn('[DexFlow] DexScreener fetch failed, using LLM only')
    }

    const context = dexData.length > 0
      ? `Live DexScreener data (Base chain):\n${JSON.stringify(dexData, null, 2)}`
      : `No live data available — provide general DEX flow analysis for ${token} on Base.`

    const raw = await callLLM({
      system: SYSTEM,
      user: `Analyze DEX flow for ${token} on Base chain.\n\n${context}\n\nAssess buy/sell pressure, volume trends, and liquidity health.`,
      temperature: 0.3,
      maxTokens: 800,
    })
    return Response.json(extractJSON(raw))
  } catch (error) {
    console.error('[DexFlow] Error:', error)
    return Response.json({ error: 'DEX flow analysis failed', message: (error as Error).message }, { status: 500 })
  }
}
