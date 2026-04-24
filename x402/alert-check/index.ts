import { callLLM } from '../_lib/llm.js'
import { extractJSON } from '../_lib/json.js'
import { basescan } from '../_lib/basescan.js'

const SYSTEM = `You are a blockchain alert engine analyzing on-chain data for alert triggers.

Check the provided data and determine which alerts should fire.

Return ONLY valid JSON:
{
  "alerts": [
    {
      "topic": "whale_movement" | "circuit_breaker" | "quantum_exposure" | "honeypot_detected" | "rug_risk",
      "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
      "message": "string (human-readable alert message)",
      "actionRequired": "string (what to do)",
      "data": {}
    }
  ],
  "summary": "string",
  "nextCheckIn": "string (e.g. '5 minutes')"
}`

export default async function handler(req: Request): Promise<Response> {
  try {
    let body: { address?: string; agentId?: string; topics?: string[] } = {}
    try {
      const text = await req.text()
      if (text?.trim().startsWith('{')) body = JSON.parse(text)
    } catch {}
    const url = new URL(req.url)
    if (!body.address) body.address = url.searchParams.get('address') || undefined

    const { address, agentId, topics = ['whale_movement', 'rug_risk'] } = body
    if (!address) return Response.json({ error: 'address is required' }, { status: 400 })

    console.log(`[AlertCheck] Checking alerts for: ${address}`)

    // Fetch recent transactions for context
    let txData: any[] = []
    let tokenTxData: any[] = []
    try {
      txData = await basescan.getTxList(address, 20)
      tokenTxData = await basescan.getTokenTx(address, 20)
    } catch {
      console.warn('[AlertCheck] Basescan fetch failed')
    }

    const raw = await callLLM({
      system: SYSTEM,
      user: `Check alerts for address: ${address}
Agent ID: ${agentId ?? 'unknown'}
Topics to check: ${topics.join(', ')}

Recent transactions (last 20):
${JSON.stringify(txData.slice(0, 10), null, 2)}

Recent token transfers:
${JSON.stringify(tokenTxData.slice(0, 10), null, 2)}

Analyze for alert conditions and fire any that are triggered.`,
      temperature: 0.2,
      maxTokens: 800,
    })

    return Response.json(extractJSON(raw))
  } catch (error) {
    console.error('[AlertCheck] Error:', error)
    return Response.json({ error: 'Alert check failed', message: (error as Error).message }, { status: 500 })
  }
}
