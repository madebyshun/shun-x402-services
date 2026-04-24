import { callLLM } from '../_lib/llm.js'
import { extractJSON } from '../_lib/json.js'

// In-memory store (replace with DB in production)
const subscriptions = new Map<string, Subscription>()

interface Subscription {
  id: string
  webhookUrl: string
  topics: AlertTopic[]
  addresses: string[]
  createdAt: string
}

type AlertTopic =
  | 'whale_movement'      // large token transfers
  | 'circuit_breaker'     // agent loss/halt triggers
  | 'quantum_exposure'    // new wallet exposure events
  | 'honeypot_detected'   // new honeypot tokens flagged
  | 'rug_risk'            // rug pull risk spikes

const VALID_TOPICS: AlertTopic[] = [
  'whale_movement', 'circuit_breaker', 'quantum_exposure', 'honeypot_detected', 'rug_risk',
]

const SYSTEM = `You are a blockchain alert advisor. Given subscription details, generate a confirmation summary and setup tips.

Return ONLY valid JSON:
{
  "message": "string (confirmation message)",
  "activeTopics": ["topic1", "topic2"],
  "estimatedAlertsPerDay": "string (e.g. '3-5 alerts/day')",
  "tips": ["tip1", "tip2"],
  "webhookFormat": {
    "topic": "whale_movement",
    "severity": "HIGH",
    "message": "example alert message",
    "data": {},
    "timestamp": "ISO string"
  }
}`

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'GET') {
    return Response.json({
      service: 'alert-subscribe',
      description: 'Subscribe to real-time BlueAgent alerts via webhook',
      availableTopics: VALID_TOPICS,
      pricing: '$0.50/month per topic',
    })
  }

  try {
    let body: {
      webhookUrl?: string
      topics?: AlertTopic[]
      addresses?: string[]
    } = {}
    try {
      const text = await req.text()
      if (text?.trim().startsWith('{')) body = JSON.parse(text)
    } catch {}

    const { webhookUrl, topics = [], addresses = [] } = body

    if (!webhookUrl) return Response.json({ error: 'webhookUrl is required' }, { status: 400 })
    if (topics.length === 0) return Response.json({ error: 'At least one topic required' }, { status: 400 })

    const invalidTopics = topics.filter(t => !VALID_TOPICS.includes(t))
    if (invalidTopics.length > 0) {
      return Response.json({ error: `Invalid topics: ${invalidTopics.join(', ')}`, validTopics: VALID_TOPICS }, { status: 400 })
    }

    const id = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const sub: Subscription = {
      id,
      webhookUrl,
      topics,
      addresses,
      createdAt: new Date().toISOString(),
    }
    subscriptions.set(id, sub)

    console.log(`[AlertSubscribe] New subscription ${id}: topics=${topics.join(',')} webhook=${webhookUrl}`)

    const raw = await callLLM({
      system: SYSTEM,
      user: `Subscription created:
- ID: ${id}
- Topics: ${topics.join(', ')}
- Watched addresses: ${addresses.length > 0 ? addresses.join(', ') : 'none (global alerts)'}
- Webhook: ${webhookUrl}

Generate confirmation summary and setup tips.`,
      temperature: 0.3,
      maxTokens: 600,
    })

    const result = extractJSON(raw) as any
    return Response.json({
      subscriptionId: id,
      status: 'active',
      topics,
      addresses,
      webhookUrl,
      createdAt: sub.createdAt,
      ...result,
    })
  } catch (error) {
    console.error('[AlertSubscribe] Error:', error)
    return Response.json({ error: 'Subscription failed', message: (error as Error).message }, { status: 500 })
  }
}
