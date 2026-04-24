import React from 'react'
import { Box, Text } from 'ink'
import SelectInput from 'ink-select-input'

export type Category = 'security' | 'research' | 'data' | 'earn'

const ITEMS = [
  { label: '🔐  Security   — 12 tools  (agent safety + quantum)', value: 'security' as Category },
  { label: '🔬  Research   — 9 tools   (due diligence + builder)', value: 'research' as Category },
  { label: '📊  Data       — 4 tools   (pnl, whale, dex, unlock)', value: 'data' as Category },
  { label: '💰  Earn       — 4 tools   (yield, airdrop, lp, tax)', value: 'earn' as Category },
]

interface Props {
  onSelect: (category: Category) => void
  walletAddress?: string
}

export function CategoryMenu({ onSelect, walletAddress }: Props) {
  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text dimColor>{'─'.repeat(55)}</Text>
      </Box>
      <SelectInput
        items={ITEMS}
        onSelect={(item) => onSelect(item.value)}
      />
      <Box marginTop={1}>
        <Text dimColor>{'─'.repeat(55)}</Text>
      </Box>
      {walletAddress && (
        <Text dimColor> wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</Text>
      )}
      <Text dimColor> ctrl+c quit · ↑↓ navigate · enter select</Text>
    </Box>
  )
}
