import { callLLM } from '../_lib/llm.js'
import { extractJSON } from '../_lib/json.js'

const SYSTEM = `You are a tokenomics analyst specializing in token supply dynamics, inflation, and long-term sustainability for Base ecosystem projects.

Analyze: total supply, circulating supply, emission schedule, unlock cliffs, inflation rate, token utility, and value accrual mechanisms.

Red flags: excessive team allocation, short vesting, hyperinflationary emission, no buyback/burn, zero utility.

Return ONLY valid JSON:

{
  "token": "string",
  "sustainabilityScore": number (0-100, higher = more sustainable),
  "supplyHealth": "HEALTHY" | "MODERATE" | "CONCERNING" | "CRITICAL",
  "totalSupply": "string",
  "circulatingSupply": "string (estimated %)",
  "inflationRate": "string (annual %)",
  "distribution": {
    "team": "string (%)",
    "investors": "string (%)",
    "community": "string (%)",
    "treasury": "string (%)",
    "liquidity": "string (%)"
  },
  "unlockSchedule": "string (key upcoming unlocks)",
  "vestingRisk": "LOW" | "MEDIUM" | "HIGH",
  "utilityScore": number (0-100),
  "keyRisks": ["risk1", "risk2"],
  "strengths": ["strength1", "strength2"],
  "sellPressureOutlook": "LOW" | "MEDIUM" | "HIGH" | "EXTREME",
  "recommendation": "string"
}`

export default async function handler(req: Request): Promise<Response> {
  try {
    let body: { token?: string } = {}
    try {
      const text = await req.text()
      if (text?.trim().startsWith('{')) body = JSON.parse(text)
    } catch {}
    const url = new URL(req.url)
    if (!body.token) body.token = url.searchParams.get('token') || url.searchParams.get('projectName') || undefined

    const { token } = body
    if (!token) return Response.json({ error: 'Provide token name, ticker, or contract address' }, { status: 400 })

    console.log(`[TokenomicsScore] Analyzing: ${token}`)

    const raw = await callLLM({
      system: SYSTEM,
      user: `Deep tokenomics analysis for: ${token}\n\nAnalyze supply structure, emission schedule, vesting, inflation, and long-term sustainability. Be specific about distribution percentages and sell pressure timeline.`,
      temperature: 0.4,
      maxTokens: 1000,
    })
    return Response.json(extractJSON(raw))
  } catch (error) {
    console.error('[TokenomicsScore] Error:', error)
    return Response.json({ error: 'Tokenomics analysis failed', message: (error as Error).message }, { status: 500 })
  }
}
