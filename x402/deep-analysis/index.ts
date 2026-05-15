// ── inline helpers (bankr x402 deploy requires self-contained files) ──────

async function callLLM(opts) {
  const res = await fetch('https://llm.bankr.bot/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.LLM_KEY ?? process.env.BANKR_API_KEY ?? process.env.BANKR_LLM_KEY ?? '',
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      system: opts.system,
      messages: [{ role: 'user', content: opts.user }],
      temperature: opts.temperature ?? 0.5,
      max_tokens: opts.maxTokens ?? 800,
    }),
  })
  if (!res.ok) throw new Error(`LLM error: ${res.status}`)
  const data = await res.json()
  if (data.content?.[0]?.text) return data.content[0].text
  throw new Error('Invalid LLM response')
}

function extractJSON(raw) {
  const s = raw.indexOf('{'), e = raw.lastIndexOf('}')
  if (s === -1 || e === -1) throw new Error('No JSON found in LLM response')
  return JSON.parse(raw.slice(s, e + 1))
}

function extractArray(raw) {
  const s = raw.indexOf('['), e = raw.lastIndexOf(']')
  if (s === -1 || e === -1) return []
  return JSON.parse(raw.slice(s, e + 1))
}

const basescan = {
  async getABI(address) {
    const key = process.env.BASESCAN_API_KEY ?? ''
    const res = await fetch(`https://api.etherscan.io/v2/api?chainid=8453&module=contract&action=getabi&address=${address}&apikey=${key}`, { signal: AbortSignal.timeout(5000) })
    const data = await res.json()
    return { verified: data.status === '1', abi: data.result }
  },
  async getTokenTx(address, limit = 50) {
    const key = process.env.BASESCAN_API_KEY ?? ''
    const res = await fetch(`https://api.etherscan.io/v2/api?chainid=8453&module=account&action=tokentx&address=${address}&sort=desc&offset=${limit}&apikey=${key}`, { signal: AbortSignal.timeout(8000) })
    const data = await res.json()
    return data.status === '1' ? data.result : []
  },
  async getTxList(address, limit = 100) {
    const key = process.env.BASESCAN_API_KEY ?? ''
    const res = await fetch(`https://api.etherscan.io/v2/api?chainid=8453&module=account&action=txlist&address=${address}&sort=desc&offset=${limit}&apikey=${key}`, { signal: AbortSignal.timeout(8000) })
    const data = await res.json()
    return data.status === '1' ? data.result : []
  },
}

// ─────────────────────────────────────────────────────────────────────────────

// ── Real data fetchers ────────────────────────────────────────────────────────

async function fetchDexScreener(address: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${address}`,
      { signal: AbortSignal.timeout(6000) }
    )
    const data: any = await res.json()
    const pairs = (data.pairs ?? []).filter((p: any) => p.chainId === 'base')
    if (!pairs.length) return 'No trading pairs found on Base via DexScreener.'
    const pair = pairs.sort((a: any, b: any) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))[0]
    const token = pair.baseToken ?? {}
    const txns = pair.txns?.h24 ?? {}
    const ageDays = pair.pairCreatedAt
      ? Math.round((Date.now() - pair.pairCreatedAt) / 86400000)
      : null
    return JSON.stringify({
      name: token.name,
      symbol: token.symbol,
      priceUsd: pair.priceUsd,
      volume24h: pair.volume?.h24,
      liquidityUsd: pair.liquidity?.usd,
      priceChange24h: pair.priceChange?.h24,
      buys24h: txns.buys,
      sells24h: txns.sells,
      fdv: pair.fdv,
      marketCap: pair.marketCap,
      pairAgeDays: ageDays,
      dex: pair.dexId,
      totalPairsOnBase: pairs.length,
    }, null, 2)
  } catch {
    return 'DexScreener data unavailable.'
  }
}

async function fetchGeckoTerminal(address: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.geckoterminal.com/api/v2/networks/base/tokens/${address}`,
      {
        headers: { Accept: 'application/json;version=20230302' },
        signal: AbortSignal.timeout(6000),
      }
    )
    if (!res.ok) return 'GeckoTerminal data unavailable.'
    const data: any = await res.json()
    const attr = data.data?.attributes
    if (!attr) return 'GeckoTerminal: no data.'
    return JSON.stringify({
      name: attr.name,
      symbol: attr.symbol,
      decimals: attr.decimals,
      priceUsd: attr.price_usd,
      fdvUsd: attr.fdv_usd,
      marketCap: attr.market_cap_usd,
      volume24h: attr.volume_usd?.h24,
    }, null, 2)
  } catch {
    return 'GeckoTerminal data unavailable.'
  }
}

async function fetchBasescanVerification(address: string): Promise<string> {
  const apiKey = process.env.BASESCAN_API_KEY ?? ''
  if (!apiKey) return 'Contract verification: unknown (no BASESCAN_API_KEY configured).'
  try {
    const res = await fetch(
      `https://api.etherscan.io/v2/api?chainid=8453&module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`,
      { signal: AbortSignal.timeout(5000) }
    )
    const data: any = await res.json()
    if (data.status === '1' && data.result?.[0]?.ContractName) {
      return `Contract verified: ${data.result[0].ContractName} (compiler: ${data.result[0].CompilerVersion})`
    }
    return 'Contract NOT verified on Basescan.'
  } catch {
    return 'Contract verification check failed.'
  }
}

const SYSTEM = `You are a senior crypto due diligence analyst on Base chain, powered by Blue Agent.

Use the real market data provided. Do NOT speculate or invent information.
If data shows active trading, liquidity, and a real project, reflect that honestly.

CRITICAL: Return ONLY raw JSON. No markdown. No backticks. Start with { and end with }.

{
  "projectName": "string",
  "ticker": "string or null",
  "contractAddress": "string or null",
  "riskScore": number (0-100, higher = riskier),
  "overallScore": number (0-100),
  "rugProbability": number (0-100),
  "categories": {
    "Tokenomics": number,
    "Liquidity": number,
    "CodeQuality": number,
    "TeamActivity": number,
    "Community": number,
    "Transparency": number
  },
  "keyRisks": ["risk1", "risk2"],
  "keyStrengths": ["strength1", "strength2"],
  "summary": "Professional 3-4 sentence summary grounded in the actual data",
  "recommendation": "Strong Buy | Buy | Caution | Avoid | High Risk",
  "suggestedActions": ["action1", "action2"]
}`

export default async function handler(req: Request): Promise<Response> {
  try {
    let body: { contractAddress?: string; projectName?: string; ticker?: string } = {}
    try {
      const text = await req.text()
      if (text?.trim().startsWith('{')) body = JSON.parse(text)
    } catch {}
    const url = new URL(req.url)
    if (!body.contractAddress && !body.projectName) {
      body.contractAddress = url.searchParams.get('contractAddress') || undefined
      body.projectName = url.searchParams.get('projectName') || undefined
      body.ticker = url.searchParams.get('ticker') || undefined
    }
    const { contractAddress, projectName, ticker } = body
    if (!contractAddress && !projectName) {
      return Response.json({ error: 'Provide contractAddress or projectName' }, { status: 400 })
    }
    const input = contractAddress ?? `${projectName}${ticker ? ` (${ticker})` : ''}`
    console.log(`[DeepAnalysis] Analyzing: ${input}`)

    // Fetch real data in parallel if contract address provided
    let dexData = 'No contract address — name-based analysis only.'
    let geckoData = 'No contract address.'
    let contractStr = 'No contract address.'

    if (contractAddress) {
      ;[dexData, geckoData, contractStr] = await Promise.all([
        fetchDexScreener(contractAddress),
        fetchGeckoTerminal(contractAddress),
        fetchBasescanVerification(contractAddress),
      ])
    }

    const userPrompt = `Perform deep due diligence on: ${input}
Project name hint: ${projectName ?? 'unknown'}
Ticker hint: ${ticker ?? 'unknown'}
Contract: ${contractAddress ?? 'not provided'}

=== DexScreener (live market data) ===
${dexData}

=== GeckoTerminal ===
${geckoData}

=== Contract Verification ===
${contractStr}`

    const raw = await callLLM({ system: SYSTEM, user: userPrompt, temperature: 0.3, maxTokens: 900 })
    return Response.json(extractJSON(raw))
  } catch (error) {
    console.error('[DeepAnalysis] Error:', error)
    return Response.json({ error: 'Analysis failed', message: (error as Error).message }, { status: 500 })
  }
}
