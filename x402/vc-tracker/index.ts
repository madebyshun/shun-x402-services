import { callLLM } from '../_lib/llm.js'
import { extractJSON } from '../_lib/json.js'

const SYSTEM = `You are a crypto VC intelligence analyst tracking venture capital activity in the Base ecosystem and broader crypto market (as of April 2026).

You have knowledge of: a16z crypto, Paradigm, Coinbase Ventures, Multicoin, Sequoia, Pantera, Framework Ventures, Dragonfly, Electric Capital, and other major crypto funds.

Provide actionable investment intelligence: what themes are being funded, which sectors are hot, and what signals smart money is sending.

Return ONLY valid JSON:

{
  "query": "string",
  "investmentThesis": "string (2-3 sentences on current VC thinking)",
  "hotSectors": [
    {
      "sector": "string",
      "momentum": "EXPLODING" | "HOT" | "RISING" | "COOLING",
      "recentDeals": ["deal1", "deal2"],
      "leadingFirms": ["firm1", "firm2"]
    }
  ],
  "notableFirms": [
    {
      "firm": "string",
      "currentFocus": "string",
      "recentActivity": "string"
    }
  ],
  "baseEcosystemActivity": "string (VC activity specific to Base/Coinbase ecosystem)",
  "signalForBuilders": "string (what builders should know)",
  "signalForTraders": "string (what traders should know)",
  "recommendation": "string"
}`

export default async function handler(req: Request): Promise<Response> {
  try {
    let body: { query?: string } = {}
    try {
      const text = await req.text()
      if (text?.trim().startsWith('{')) body = JSON.parse(text)
    } catch {}
    const url = new URL(req.url)
    if (!body.query) body.query = url.searchParams.get('query') || undefined

    const { query } = body
    if (!query) return Response.json({ error: 'Provide query (VC firm name, sector, or theme)' }, { status: 400 })

    console.log(`[VCTracker] Tracking: ${query}`)

    const raw = await callLLM({
      system: SYSTEM,
      user: `VC investment intelligence for: "${query}"\n\nProvide current investment activity, thesis, and signals as of April 2026. Focus on Base ecosystem where relevant.`,
      temperature: 0.5,
      maxTokens: 900,
    })
    return Response.json(extractJSON(raw))
  } catch (error) {
    console.error('[VCTracker] Error:', error)
    return Response.json({ error: 'VC tracking failed', message: (error as Error).message }, { status: 500 })
  }
}
