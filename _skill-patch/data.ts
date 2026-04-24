import type { SkillDef } from '../types.js'

export const dataSkills: SkillDef[] = [
  {
    name: 'pnl',
    category: 'data',
    description: 'Wallet PnL report — win rate, realized/unrealized gains, trading style, smart money score.',
    priceUSD: 1.00,
    endpoint: 'wallet-pnl',
    inputSchema: {
      type: 'object',
      properties: {
        address: { type: 'string', description: 'Wallet address to analyze (0x...)' },
        period: { type: 'string', description: 'Time period: 7d | 30d | 90d | all (default: 30d)' },
      },
      required: ['address'],
    },
    buildBody: ({ address, period = '30d' }) => ({ address, period, chain: 'base' }),
  },
  {
    name: 'whale-tracker',
    category: 'data',
    description: 'Smart money flow analysis for any token — accumulation vs distribution signal, top whale movements.',
    priceUSD: 0.10,
    endpoint: 'whale-tracker',
    inputSchema: {
      type: 'object',
      properties: {
        token: { type: 'string', description: 'Token contract address or ticker symbol' },
        minAmountUSD: { type: 'number', description: 'Minimum whale transaction size in USD (default: 1000)' },
      },
      required: ['token'],
    },
    buildBody: ({ token, minAmountUSD = 1000 }) => ({ token, minAmountUSD, chain: 'base' }),
  },
  {
    name: 'dex-flow',
    category: 'data',
    description: 'DEX buy/sell pressure and volume flow — live DexScreener data, buy/sell ratio, liquidity health.',
    priceUSD: 0.15,
    endpoint: 'dex-flow',
    inputSchema: {
      type: 'object',
      properties: {
        token: { type: 'string', description: 'Token address or ticker to analyze' },
      },
      required: ['token'],
    },
    buildBody: ({ token }) => ({ token, chain: 'base' }),
  },
  {
    name: 'unlock-alert',
    category: 'data',
    description: 'Upcoming token unlock events — dates, amounts, sell pressure risk, cliff vs linear vesting breakdown.',
    priceUSD: 0.20,
    endpoint: 'unlock-alert',
    inputSchema: {
      type: 'object',
      properties: {
        token: { type: 'string', description: 'Token name, ticker, or contract address' },
        days: { type: 'number', description: 'Look-ahead window in days (default: 30)' },
      },
      required: ['token'],
    },
    buildBody: ({ token, days = 30 }) => ({ token, days }),
  },
]
