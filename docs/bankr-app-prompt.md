# Bankr App Prompt — BlueAgent x402 Terminal

Paste toàn bộ prompt bên dưới vào Bankr chat để build app.

---

```
Build a new app called "blueagent-terminal".

Match this exact design system from blueagent.xyz:

COLORS & FONTS:
- Background: #050508
- Surface/card: #0D0D14
- Border: #1A1A2E
- Blue accent: #4FC3F7
- Purple accent: #A78BFA
- Text primary: #E2E8F0
- Text muted: #94A3B8 (slate-400)
- Text dim: #4B5563 (slate-600)
- Font body: Inter, system-ui, sans-serif
- Font mono: JetBrains Mono, monospace (use for labels, prices, code, badges)

BACKGROUNDS:
- Grid pattern: repeating linear-gradient(rgba(79,195,247,0.03) 1px, transparent 1px) 40px 40px
- Hero glow: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(79,195,247,0.12) 0%, transparent 70%)

CATEGORY COLORS (for badge text/bg/border):
- Security:  #4FC3F7 / rgba(79,195,247,0.1) / rgba(79,195,247,0.2)
- Quantum:   #A78BFA / rgba(167,139,250,0.1) / rgba(167,139,250,0.2)
- Research:  #34D399 / rgba(52,211,153,0.1) / rgba(52,211,153,0.2)
- Analytics: #FB923C / rgba(251,146,60,0.1) / rgba(251,146,60,0.2)
- Portfolio: #FACC15 / rgba(250,204,21,0.1) / rgba(250,204,21,0.2)
- Alerts:    #F472B6 / rgba(244,114,182,0.1) / rgba(244,114,182,0.2)

CARD STYLE:
- background: rgba(13,13,20,0.8)
- border: 1px solid #1A1A2E
- backdrop-filter: blur(12px)
- border-radius: 12px
- On hover: border-color → rgba(79,195,247,0.3), box-shadow: 0 0 30px rgba(79,195,247,0.08), translateY(-2px)
- Transition: all 0.3s ease

GLOW DOT: width 8px, height 8px, border-radius 50%, background #4FC3F7, box-shadow: 0 0 8px #4FC3F7, 0 0 16px rgba(79,195,247,0.5)

---

LAYOUT:

Header (sticky, dark, blur):
- Left: glow dot + "BLUEAGENT" in JetBrains Mono font-bold + small badge "x402 TERMINAL"
- Right: connect wallet button (blue border, hover glow)
- Border bottom: 1px solid #1A1A2E, backdrop-filter: blur(12px)

Hero section (full-width, centered):
- Grid pattern background + hero glow radial gradient
- Animated pulse orbs (blue top-left, purple bottom-right, blur-3xl)
- Badge pill: "● BUILT ON BASE · x402 PROTOCOL" in mono, #4FC3F7, border rgba(79,195,247,0.2)
- Title: "BLUE" (white gradient) + "AGENT" (#4FC3F7 gradient), JetBrains Mono bold, 72px+
- Subtitle: "The Security OS for autonomous agents on Base. 31 pay-per-call tools — no API keys, no subscriptions, just USDC on Base."
- Stats row (4 cards): 31 / Security Tools | $0.05 / Min per Call | Base / Network | x402 / Protocol
- CTA button: "Browse Tools →" filled blue (#4FC3F7 bg, #050508 text, hover glow)

Main section — Tools:
- Section header: badge "31 TOOLS AVAILABLE" + h2 "The full security toolkit"
- Search input (left) + category filter pills (right): All / Security / Quantum / Research / Analytics / Portfolio / Alerts
- Active filter pill: bg #4FC3F7, text #050508
- Tool grid: 3 columns on desktop, 2 on tablet, 1 on mobile
- Count footer: "X of 31 tools shown" in mono

Tool Card:
- Glow dot (opacity 0.6) + tool name (mono, white) + category badge (top row)
- Description text (slate-400, xs)
- Bottom: price "$X.XX/call" in #4FC3F7 mono bold + "→ use tool" text (slate-600, hover #4FC3F7)
- Cursor pointer, onClick opens modal

Tool Modal (bottom sheet on mobile, centered on desktop):
- Overlay: bg black/70, backdrop-blur-sm
- Modal: bg #0D0D14, border #1A1A2E, rounded-2xl (rounded-t-2xl on mobile)
- Header: glow dot + tool name + category badge + close X button
- Body scrollable:
  - Description + price "$X.XX/call" right-aligned
  - Endpoint row: "POST" label + full URL in #4FC3F7 mono (copyable)
  - Input fields per tool (see tool list below)
  - Run button: full-width, bg #4FC3F7, text #050508, "Run · $X USDC" — disabled until required fields filled
  - Loading states: spinner + "Calling service…" / "Sign $X in wallet…" / "Submitting payment…"
  - Result: green glow dot + "Result" label + JSON pre block (bg #050508, border #1A1A2E, max-h-52, overflow-auto)
  - Error: red border/bg pill with message + retry button
  - Payment receipt: "✓ Paid $X USDC · settled on Base" in emerald mono
  - GitHub source link at bottom: SVG icon + "View source on GitHub" → https://github.com/madebyshun/blueagent-x402-services/tree/main/x402/{toolId}

Footer:
- "$BLUEAGENT on Base · t.me/blueagent_hub · @blocky_agent"
- Mono text, slate-600, centered

---

x402 PAYMENT PATTERN (for each tool button click):

Base URL: https://x402.bankr.bot/0xf31f59e7b8b58555f7871f71973a394c8f1bffe5

1. Require bankr.auth.isAuthenticated — if not, show "Connect Wallet" prompt
2. Call bankr.x402.fetch(BASE_URL + "/" + toolId, { method: "POST", body: JSON.stringify(inputs), headers: { "Content-Type": "application/json" }, maxPaymentUsd: <price> })
3. On success: show result.body as formatted JSON + payment receipt
4. On "rejected": silent (user cancelled)
5. On other error: show error pill with message

Manifest:
- permissions: ["pay:x402"]
- x402.allowedHosts: ["x402.bankr.bot"]
- x402.maxPaymentUsdPerCall: 5.00

---

TOOL LIST (31 tools, 6 categories):

SECURITY (7 tools):
1. risk-gate · $0.05
   Inputs: action* (text, "transfer / swap / approve"), contractAddress (address, "0x…"), amount (text, "e.g. 1000"), toAddress (address, "0x…")
   Body: { action, contractAddress, amount, toAddress }

2. honeypot-check · $0.05
   Inputs: token* (address, "Token contract 0x…")
   Body: { token }

3. allowance-audit · $0.20
   Inputs: address* (address, "Wallet 0x…")
   Body: { address }

4. phishing-scan · $0.10
   Inputs: target* (text, "URL / 0x… / @handle")
   Body: { target }

5. mev-shield · $0.30
   Inputs: action* (text, "swap 10 ETH to USDC on Uniswap"), amount (text, "USD value optional")
   Body: { action, amount }

6. contract-trust · $0.25
   Inputs: address* (address, "Contract 0x…")
   Body: { address }

7. circuit-breaker · $0.50
   Inputs: context* (text, "3 consecutive failed trades"), recentLosses (text, "$340"), agentId (text, "my-agent")
   Body: { context, recentLosses, agentId }

QUANTUM (5 tools):
8. quantum-premium · $1.50
   Inputs: address* (address, "Wallet 0x…")
   Body: { address }

9. quantum-batch · $2.50
   Inputs: addresses* (text, "0x…, 0x…, 0x… (max 10 comma-separated)")
   Body: { addresses: input.split(",").map(a => a.trim()) }

10. quantum-migrate · $2.00
    Inputs: address* (address, "Wallet 0x…"), urgencyLevel (select: LOW/MEDIUM/HIGH/CRITICAL, default MEDIUM)
    Body: { address, urgencyLevel }

11. quantum-timeline · $0.40
    Inputs: concern (text, "Specific concern optional")
    Body: { concern }

12. key-exposure · $0.50
    Inputs: address* (address, "Wallet 0x…")
    Body: { address }

RESEARCH (9 tools):
13. deep-analysis · $0.35
    Inputs: projectName* (text, "Token name, $SYMBOL, or 0x…")
    Body: { projectName }

14. tokenomics-score · $0.50
    Inputs: token* (text, "Token name or ticker")
    Body: { token }

15. whitepaper-tldr · $0.20
    Inputs: url* (url, "https://…"), projectName (text, "Project name optional")
    Body: { url, projectName }

16. narrative-pulse · $0.40
    Inputs: query* (text, "AI agents / Base DeFi / RWA")
    Body: { query }

17. vc-tracker · $1.00
    Inputs: query* (text, "a16z / AI x DeFi / gaming")
    Body: { query }

18. launch-advisor · $3.00
    Inputs: projectName* (text, "Project name"), description (text, "What it does"), targetRaise (text, "e.g. $500K optional")
    Body: { projectName, description, targetRaise }

19. grant-evaluator · $5.00
    Inputs: description* (text, "Project description"), projectName (text), teamBackground (text, "Team background optional"), requestedAmount (text, "Amount optional")
    Body: { description, projectName, teamBackground, requestedAmount }

20. x402-readiness · $1.00
    Inputs: url (url, "API base URL optional"), description (text, "What the API does"), currentModel (text, "e.g. subscription optional")
    Body: { url, description, currentModel }

21. base-deploy-check · $0.50
    Inputs: contractCode (textarea, "Paste Solidity code optional"), description (text, "What the contract does"), projectName (text)
    Body: { contractCode, description, projectName }

ANALYTICS (6 tools):
22. wallet-pnl · $1.00
    Inputs: address* (address, "Wallet 0x…"), period (select: 7d/30d/90d/all, default 30d)
    Body: { address, period }

23. whale-tracker · $0.10
    Inputs: token* (text, "Token 0x… or ticker"), minAmountUSD (text, "Min USD e.g. 1000")
    Body: { token, minAmountUSD }

24. aml-screen · $0.25
    Inputs: address* (address, "Wallet 0x…")
    Body: { address }

25. airdrop-check · $0.10
    Inputs: address* (address, "Wallet 0x…")
    Body: { address }

26. narrative-pulse → already in Research (skip duplicate)

27. dex-flow · $0.15
    Inputs: token* (text, "Token 0x… or ticker")
    Body: { token }

28. alert-check · $0.10
    Inputs: address* (address, "Wallet or token 0x…")
    Body: { address }

PORTFOLIO (3 tools):
29. yield-optimizer · $0.15
    Inputs: token* (text, "USDC / ETH / cbBTC"), riskTolerance (select: LOW/MEDIUM/HIGH, default MEDIUM)
    Body: { token, riskTolerance }

30. lp-analyzer · $0.25
    Inputs: address* (address, "Wallet 0x…"), positionId (text, "LP NFT position ID optional"), pool (address, "Pool address optional")
    Body: { address, positionId, pool }

31. tax-report · $2.00
    Inputs: address* (address, "Wallet 0x…"), year (number, current year), country (text, "US")
    Body: { address, year: Number(year), country }

ALERTS (2 tools):
32. alert-subscribe · $0.50
    Inputs: webhookUrl* (url, "https://… HTTPS only"), topics* (text, "comma-separated: whale_movement, circuit_breaker, quantum_exposure, honeypot_detected, rug_risk"), addresses (text, "comma-separated watch addresses optional")
    Body: { webhookUrl, topics: topics.split(",").map(t => t.trim()), addresses: addresses ? addresses.split(",").map(a => a.trim()) : [] }

---

Make the app public after creation and share the public link.
```
