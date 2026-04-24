import type { SkillDef } from '../types.js'

export const securitySkills: SkillDef[] = [
  // ── AGENT SAFETY ─────────────────────────────────────────────────────────
  {
    name: 'riskcheck',
    category: 'security',
    description: 'Pre-transaction safety check — APPROVE / WARN / BLOCK decision with risk score. Call before EVERY onchain action.',
    priceUSD: 0.05,
    endpoint: 'risk-gate',
    inputSchema: {
      type: 'object',
      properties: {
        action: { type: 'string', description: 'Describe the onchain action (e.g. "approve 0xABC to spend USDC")' },
        contractAddress: { type: 'string', description: 'Contract address to interact with (optional)' },
        amount: { type: 'string', description: 'Transaction amount in USD or tokens (optional)' },
        agentId: { type: 'string', description: 'Your agent identifier for audit trail (optional)' },
      },
      required: ['action'],
    },
    buildBody: ({ action, contractAddress, amount, agentId }) => ({ action, contractAddress, amount, agentId }),
  },
  {
    name: 'honeypot-check',
    category: 'security',
    description: 'Detect honeypot or rug pull token contracts before buying. Returns SAFE / SUSPICIOUS / HONEYPOT verdict.',
    priceUSD: 0.05,
    endpoint: 'honeypot-check',
    inputSchema: {
      type: 'object',
      properties: {
        token: { type: 'string', description: 'Token contract address to check (0x...)' },
      },
      required: ['token'],
    },
    buildBody: ({ token }) => ({ token, chain: 'base' }),
  },
  {
    name: 'allowance-audit',
    category: 'security',
    description: 'Audit dangerous token approvals for a wallet — find unlimited allowances and get revoke recommendations.',
    priceUSD: 0.20,
    endpoint: 'allowance-audit',
    inputSchema: {
      type: 'object',
      properties: {
        address: { type: 'string', description: 'Wallet address to audit (0x...)' },
      },
      required: ['address'],
    },
    buildBody: ({ address }) => ({ address }),
  },
  {
    name: 'phishing-scan',
    category: 'security',
    description: 'Scan URL, contract address, or social handle for phishing and scam indicators before interacting.',
    priceUSD: 0.10,
    endpoint: 'phishing-scan',
    inputSchema: {
      type: 'object',
      properties: {
        target: { type: 'string', description: 'URL, contract address, or @handle to scan' },
      },
      required: ['target'],
    },
    buildBody: ({ target }) => ({ target }),
  },
  {
    name: 'mev-shield',
    category: 'security',
    description: 'MEV sandwich attack risk before large swaps — sandwich probability, protection strategies, recommended slippage.',
    priceUSD: 0.30,
    endpoint: 'mev-shield',
    inputSchema: {
      type: 'object',
      properties: {
        action: { type: 'string', description: 'Describe the swap (e.g. "swap 10 ETH to USDC on Uniswap v3")' },
      },
      required: ['action'],
    },
    buildBody: ({ action }) => ({ action, chain: 'base' }),
  },
  {
    name: 'contract-trust',
    category: 'security',
    description: 'Trust score for any contract — verified, audited, safe for AI agent interaction? Returns agentSafe boolean.',
    priceUSD: 0.25,
    endpoint: 'contract-trust',
    inputSchema: {
      type: 'object',
      properties: {
        address: { type: 'string', description: 'Contract address to evaluate (0x...)' },
      },
      required: ['address'],
    },
    buildBody: ({ address }) => ({ address }),
  },
  {
    name: 'aml-screen',
    category: 'security',
    description: 'AML compliance screening for any wallet — transaction pattern analysis, risk flags, CLEAN / SUSPICIOUS / HIGH_RISK verdict.',
    priceUSD: 0.25,
    endpoint: 'aml-screen',
    inputSchema: {
      type: 'object',
      properties: {
        address: { type: 'string', description: 'Wallet address to screen (0x...)' },
      },
      required: ['address'],
    },
    buildBody: ({ address }) => ({ address, chain: 'base' }),
  },
  {
    name: 'circuit-breaker',
    category: 'security',
    description: 'Circuit breaker for autonomous agents and ZHC — CONTINUE / PAUSE / HALT decision. Call when agent detects losses or anomalies.',
    priceUSD: 0.50,
    endpoint: 'circuit-breaker',
    inputSchema: {
      type: 'object',
      properties: {
        agentId: { type: 'string', description: 'Agent identifier' },
        action: { type: 'string', description: 'Action the agent is about to take' },
        context: { type: 'string', description: 'Current situation (losses, anomalies, etc.)' },
        recentLosses: { type: 'string', description: 'Recent loss amount if any (e.g. "$340")' },
        consecutiveBlocks: { type: 'number', description: 'Number of consecutive BLOCK decisions from risk-gate' },
      },
    },
    buildBody: ({ agentId, action, context, recentLosses, consecutiveBlocks }) => ({
      agentId, action, context, recentLosses, consecutiveBlocks,
    }),
  },

  // ── QUANTUM SECURITY ────────────────────────────────────────────────────
  {
    name: 'quantum',
    category: 'security',
    description: 'Quantum vulnerability score for any wallet — public key exposure check, threat timeline, migration steps.',
    priceUSD: 1.50,
    endpoint: 'quantum-premium',
    inputSchema: {
      type: 'object',
      properties: {
        address: { type: 'string', description: 'Wallet address to analyze (0x...)' },
        chain: { type: 'string', description: 'Blockchain (default: base)' },
      },
      required: ['address'],
    },
    buildBody: ({ address, chain = 'base' }) => ({ address, chain }),
  },
  {
    name: 'key-exposure',
    category: 'security',
    description: 'Check if wallet public key is exposed on-chain — the #1 quantum risk factor. Exposed = sent at least 1 transaction.',
    priceUSD: 0.50,
    endpoint: 'key-exposure',
    inputSchema: {
      type: 'object',
      properties: {
        address: { type: 'string', description: 'Wallet address to check (0x...)' },
      },
      required: ['address'],
    },
    buildBody: ({ address }) => ({ address, chain: 'base' }),
  },
  {
    name: 'quantum-migrate',
    category: 'security',
    description: 'Step-by-step quantum-safe wallet migration plan — specific tools, timeline, and priority actions.',
    priceUSD: 2.00,
    endpoint: 'quantum-migrate',
    inputSchema: {
      type: 'object',
      properties: {
        address: { type: 'string', description: 'Wallet address to migrate (0x...)' },
        urgencyLevel: { type: 'string', description: 'CRITICAL | HIGH | MEDIUM | LOW (optional, auto-assessed if omitted)' },
      },
      required: ['address'],
    },
    buildBody: ({ address, urgencyLevel }) => ({ address, chain: 'base', urgencyLevel }),
  },
  {
    name: 'quantum-timeline',
    category: 'security',
    description: 'Evidence-based quantum threat timeline — when CRQC arrives, milestone events 2026-2035, what it means for your wallet.',
    priceUSD: 0.40,
    endpoint: 'quantum-timeline',
    inputSchema: {
      type: 'object',
      properties: {
        address: { type: 'string', description: 'Wallet address for personalized context (optional)' },
        concern: { type: 'string', description: 'Specific quantum concern (optional)' },
      },
    },
    buildBody: ({ address, concern }) => ({ address, concern }),
  },
]
