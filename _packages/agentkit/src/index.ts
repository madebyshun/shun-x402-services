import { BlueAgent } from '@blueagent/sdk'

/**
 * BlueAgent plugin for Coinbase AgentKit.
 *
 * Usage:
 *   import { blueagentPlugin } from '@blueagent/agentkit'
 *   const kit = await AgentKit.from({ actionProviders: [blueagentPlugin()] })
 */
export function blueagentPlugin(opts?: { privateKey?: string }) {
  const key = opts?.privateKey ?? process.env.WALLET_PRIVATE_KEY
  if (!key) throw new Error('BlueAgent: set WALLET_PRIVATE_KEY or pass privateKey option')
  const ba = new BlueAgent({ privateKey: key })

  return {
    name: 'blueagent',
    actions: [

      // ── SECURITY ────────────────────────────────────────────────────────

      {
        name: 'blueagent_riskcheck',
        description: 'Pre-transaction safety check — APPROVE / WARN / BLOCK with risk score. Call before EVERY onchain action.',
        schema: {
          type: 'object',
          properties: {
            action: { type: 'string', description: 'Describe the onchain action' },
            contractAddress: { type: 'string' },
            amount: { type: 'string' },
            agentId: { type: 'string' },
          },
          required: ['action'],
        },
        invoke: (p: any) => ba.security.riskcheck(p),
      },
      {
        name: 'blueagent_honeypot',
        description: 'Detect honeypot or rug pull token contracts — SAFE / SUSPICIOUS / HONEYPOT verdict.',
        schema: {
          type: 'object',
          properties: { token: { type: 'string', description: 'Token contract address (0x...)' } },
          required: ['token'],
        },
        invoke: (p: any) => ba.security.honeypotCheck(p),
      },
      {
        name: 'blueagent_circuit_breaker',
        description: 'CONTINUE / PAUSE / HALT decision for autonomous agents. Call when losses or anomalies detected.',
        schema: {
          type: 'object',
          properties: {
            agentId: { type: 'string' },
            context: { type: 'string' },
            recentLosses: { type: 'string' },
          },
        },
        invoke: (p: any) => ba.security.circuitBreaker(p),
      },
      {
        name: 'blueagent_contract_trust',
        description: 'Trust score for any contract — verified, audited, safe for AI agent interaction?',
        schema: {
          type: 'object',
          properties: { address: { type: 'string', description: 'Contract address (0x...)' } },
          required: ['address'],
        },
        invoke: (p: any) => ba.security.contractTrust(p),
      },
      {
        name: 'blueagent_aml',
        description: 'AML compliance screening — CLEAN / SUSPICIOUS / HIGH_RISK verdict.',
        schema: {
          type: 'object',
          properties: { address: { type: 'string', description: 'Wallet address (0x...)' } },
          required: ['address'],
        },
        invoke: (p: any) => ba.security.amlScreen(p),
      },

      // ── RESEARCH ────────────────────────────────────────────────────────

      {
        name: 'blueagent_analyze',
        description: 'Deep due diligence for any token or project — risk score, rug probability, red flags.',
        schema: {
          type: 'object',
          properties: { projectName: { type: 'string', description: 'Token name, ticker, or contract' } },
          required: ['projectName'],
        },
        invoke: (p: any) => ba.research.analyze(p),
      },
      {
        name: 'blueagent_narrative',
        description: 'Trending narratives in crypto and Base ecosystem — momentum scores, emerging themes.',
        schema: {
          type: 'object',
          properties: { query: { type: 'string', description: 'Topic or sector (e.g. "AI agents")' } },
          required: ['query'],
        },
        invoke: (p: any) => ba.research.narrativePulse(p),
      },

      // ── DATA ────────────────────────────────────────────────────────────

      {
        name: 'blueagent_pnl',
        description: 'Wallet PnL report — win rate, realized gains, trading style, smart money score.',
        schema: {
          type: 'object',
          properties: {
            address: { type: 'string', description: 'Wallet address (0x...)' },
            period: { type: 'string', enum: ['7d', '30d', '90d', 'all'] },
          },
          required: ['address'],
        },
        invoke: (p: any) => ba.data.pnl(p),
      },
      {
        name: 'blueagent_whale_tracker',
        description: 'Smart money flow — accumulation vs distribution signal, top whale movements.',
        schema: {
          type: 'object',
          properties: { token: { type: 'string', description: 'Token address or ticker' } },
          required: ['token'],
        },
        invoke: (p: any) => ba.data.whaleTracker(p),
      },
      {
        name: 'blueagent_dex_flow',
        description: 'DEX buy/sell pressure and volume flow — live DexScreener data.',
        schema: {
          type: 'object',
          properties: { token: { type: 'string', description: 'Token address or ticker' } },
          required: ['token'],
        },
        invoke: (p: any) => ba.data.dexFlow(p),
      },

      // ── EARN ────────────────────────────────────────────────────────────

      {
        name: 'blueagent_yield',
        description: 'Best APY opportunities on Base DeFi — live DeFiLlama data, risk-adjusted.',
        schema: {
          type: 'object',
          properties: {
            token: { type: 'string', description: 'Token to deploy (e.g. USDC, ETH)' },
            riskTolerance: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
          },
        },
        invoke: (p: any) => ba.earn.yieldOptimizer(p),
      },
      {
        name: 'blueagent_airdrop',
        description: 'Base airdrop eligibility — which protocols qualify, activity score, estimated value.',
        schema: {
          type: 'object',
          properties: { address: { type: 'string', description: 'Wallet address (0x...)' } },
          required: ['address'],
        },
        invoke: (p: any) => ba.earn.airdropCheck(p),
      },
    ],
  }
}
