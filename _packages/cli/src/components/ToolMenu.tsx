import React from 'react'
import { Box, Text, useInput } from 'ink'
import SelectInput from 'ink-select-input'
import type { Category } from './CategoryMenu.js'

const TOOLS: Record<Category, Array<{ label: string; value: string; params: string[] }>> = {
  security: [
    { label: 'riskcheck       $0.05  — Pre-tx safety check (APPROVE/WARN/BLOCK)', value: 'risk-gate', params: ['action', 'contractAddress?', 'amount?'] },
    { label: 'honeypot-check  $0.05  — Detect honeypot tokens', value: 'honeypot-check', params: ['token'] },
    { label: 'allowance-audit $0.20  — Find dangerous token approvals', value: 'allowance-audit', params: ['address'] },
    { label: 'phishing-scan   $0.10  — Scan URL/address for phishing', value: 'phishing-scan', params: ['target'] },
    { label: 'mev-shield      $0.30  — MEV sandwich risk before swap', value: 'mev-shield', params: ['action'] },
    { label: 'contract-trust  $0.25  — Trust score for any contract', value: 'contract-trust', params: ['address'] },
    { label: 'aml-screen      $0.25  — AML compliance screening', value: 'aml-screen', params: ['address'] },
    { label: 'circuit-breaker $0.50  — CONTINUE/PAUSE/HALT for agents', value: 'circuit-breaker', params: ['context?', 'recentLosses?'] },
    { label: 'quantum         $1.50  — Quantum vulnerability score', value: 'quantum-premium', params: ['address'] },
    { label: 'key-exposure    $0.50  — Check if public key exposed on-chain', value: 'key-exposure', params: ['address'] },
    { label: 'quantum-migrate $2.00  — Quantum-safe migration plan', value: 'quantum-migrate', params: ['address'] },
    { label: 'quantum-timeline$0.40  — Evidence-based quantum threat timeline', value: 'quantum-timeline', params: ['address?'] },
  ],
  research: [
    { label: 'analyze         $0.35  — Deep token due diligence', value: 'deep-analysis', params: ['projectName'] },
    { label: 'tokenomics      $0.50  — Supply/inflation/unlock analysis', value: 'tokenomics-score', params: ['token'] },
    { label: 'whitepaper-tldr $0.20  — Summarize whitepaper into 5 bullets', value: 'whitepaper-tldr', params: ['url'] },
    { label: 'narrative-pulse $0.40  — Trending narratives in Base ecosystem', value: 'narrative-pulse', params: ['query'] },
    { label: 'vc-tracker      $1.00  — VC investment activity & thesis', value: 'vc-tracker', params: ['query'] },
    { label: 'advisor         $3.00  — Full token launch playbook', value: 'launch-advisor', params: ['description'] },
    { label: 'grant           $5.00  — Base ecosystem grant scoring', value: 'grant-evaluator', params: ['description'] },
    { label: 'x402-readiness  $1.00  — Audit API for x402 readiness', value: 'x402-readiness', params: ['url?', 'description?'] },
    { label: 'deploy-check    $0.50  — Pre-deployment security check', value: 'base-deploy-check', params: ['contractCode?', 'description?'] },
  ],
  data: [
    { label: 'pnl             $1.00  — Wallet PnL report', value: 'wallet-pnl', params: ['address', 'period?'] },
    { label: 'whale-tracker   $0.10  — Smart money flow analysis', value: 'whale-tracker', params: ['token'] },
    { label: 'dex-flow        $0.15  — DEX buy/sell pressure', value: 'dex-flow', params: ['token'] },
    { label: 'unlock-alert    $0.20  — Upcoming token unlock events', value: 'unlock-alert', params: ['token'] },
  ],
  earn: [
    { label: 'yield-optimizer $0.15  — Best APY on Base DeFi', value: 'yield-optimizer', params: ['token?'] },
    { label: 'airdrop-check   $0.10  — Base airdrop eligibility', value: 'airdrop-check', params: ['address'] },
    { label: 'lp-analyzer     $0.25  — LP position analysis', value: 'lp-analyzer', params: ['address'] },
    { label: 'tax-report      $2.00  — On-chain tax summary', value: 'tax-report', params: ['address', 'year?'] },
  ],
}

interface Props {
  category: Category
  onSelect: (tool: string, params: string[]) => void
  onBack: () => void
}

export function ToolMenu({ category, onSelect, onBack }: Props) {
  useInput((_, key) => { if (key.escape) onBack() })
  const tools = TOOLS[category]
  const items = tools.map(t => ({ label: t.label, value: t.value }))

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text color="blueBright" bold>{category.toUpperCase()} TOOLS</Text>
        <Text dimColor>  (esc to go back)</Text>
      </Box>
      <SelectInput
        items={items}
        onSelect={(item) => {
          const tool = tools.find(t => t.value === item.value)!
          onSelect(item.value, tool.params)
        }}
      />
    </Box>
  )
}
