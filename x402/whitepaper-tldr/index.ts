import { callLLM } from '../_lib/llm.js'
import { extractJSON } from '../_lib/json.js'

const SYSTEM = `You are a crypto research analyst who reads whitepapers and project docs and distills them into 5 essential bullets.

Focus on: core thesis, token utility, technical innovation, competitive moat, and key risks.
Be direct and opinionated — no filler.

Return ONLY valid JSON:

{
  "project": "string",
  "oneLiner": "string (under 15 words — what this project does)",
  "bullets": [
    "string (key point 1 — lead with the most important thing)",
    "string (key point 2)",
    "string (key point 3)",
    "string (key point 4)",
    "string (key point 5 — biggest risk or red flag)"
  ],
  "tokenUtility": "string (why would you hold the token?)",
  "moat": "string (what stops competitors?)",
  "verdict": "STRONG" | "PROMISING" | "AVERAGE" | "WEAK" | "RED_FLAG",
  "tldrScore": number (0-100, overall project quality),
  "recommendation": "string"
}`

async function fetchPageContent(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 BlueAgent/1.0' },
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
  const html = await res.text()
  // Strip HTML tags, keep text
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 4000)
}

export default async function handler(req: Request): Promise<Response> {
  try {
    let body: { url?: string; projectName?: string } = {}
    try {
      const text = await req.text()
      if (text?.trim().startsWith('{')) body = JSON.parse(text)
    } catch {}
    const reqUrl = new URL(req.url)
    if (!body.url) body.url = reqUrl.searchParams.get('url') || undefined
    if (!body.projectName) body.projectName = reqUrl.searchParams.get('projectName') || undefined

    const { url, projectName } = body
    if (!url) return Response.json({ error: 'Provide url to whitepaper or project docs' }, { status: 400 })

    console.log(`[WhitepaperTldr] Summarizing: ${url}`)

    let content = ''
    try {
      content = await fetchPageContent(url)
    } catch (e) {
      content = `Could not fetch content from URL. URL: ${url}`
    }

    const raw = await callLLM({
      system: SYSTEM,
      user: `Summarize this whitepaper/project docs into 5 essential bullets.\nProject: ${projectName ?? 'Unknown'}\nURL: ${url}\n\nContent:\n${content}`,
      temperature: 0.4,
      maxTokens: 800,
    })
    return Response.json(extractJSON(raw))
  } catch (error) {
    console.error('[WhitepaperTldr] Error:', error)
    return Response.json({ error: 'Whitepaper summary failed', message: (error as Error).message }, { status: 500 })
  }
}
