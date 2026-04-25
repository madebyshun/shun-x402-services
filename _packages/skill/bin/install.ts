#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

const TOOL_COUNT = 31

// Claude Code CLI reads from ~/.claude/settings.json (NOT claude_desktop_config.json)
const CONFIG_PATHS = {
  'claude-code': join(homedir(), '.claude', 'settings.json'),
  'claude-desktop': {
    darwin: join(homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json'),
    linux:  join(homedir(), '.config', 'Claude', 'claude_desktop_config.json'),
    win32:  join(process.env.APPDATA ?? homedir(), 'Claude', 'claude_desktop_config.json'),
  },
  'cursor': join(homedir(), '.cursor', 'mcp.json'),
}

function readConfig(path: string): Record<string, any> {
  if (!existsSync(path)) return {}
  try { return JSON.parse(readFileSync(path, 'utf-8')) } catch { return {} }
}

function writeConfig(path: string, config: Record<string, any>) {
  mkdirSync(join(path, '..'), { recursive: true })
  writeFileSync(path, JSON.stringify(config, null, 2) + '\n')
}

const SERVER_ENTRY = {
  command: 'npx',
  args: ['-y', '@blueagent/skill'],
  env: { WALLET_PRIVATE_KEY: process.env.WALLET_PRIVATE_KEY ?? '' },
}

function installToPath(path: string, label: string) {
  const config = readConfig(path)
  config.mcpServers ??= {}
  config.mcpServers['blueagent'] = SERVER_ENTRY
  writeConfig(path, config)
  console.log(`  ✓ ${label} → ${path}`)
}

export function main() {
  const flag = process.argv[2] ?? '--help'
  const platform = process.platform as 'darwin' | 'linux' | 'win32'

  if (flag === '--help' || flag === '-h') {
    console.log(`
BlueAgent MCP — ${TOOL_COUNT} tools for Claude Code, Claude Desktop, Cursor

  npx @blueagent/skill install --claude     Claude Code CLI
  npx @blueagent/skill install --desktop    Claude Desktop app
  npx @blueagent/skill install --cursor     Cursor
  npx @blueagent/skill install --all        All editors at once
`)
    return
  }

  console.log(`\nBlueAgent MCP — installing ${TOOL_COUNT} tools\n`)

  if (flag === '--claude' || flag === '--all') {
    installToPath(CONFIG_PATHS['claude-code'], 'Claude Code')
  }
  if (flag === '--desktop' || flag === '--all') {
    const path = CONFIG_PATHS['claude-desktop'][platform] ?? CONFIG_PATHS['claude-desktop']['linux']
    installToPath(path, 'Claude Desktop')
  }
  if (flag === '--cursor' || flag === '--all') {
    installToPath(CONFIG_PATHS['cursor'], 'Cursor')
  }

  const keySet = !!process.env.WALLET_PRIVATE_KEY

  console.log(`
Next steps:
${keySet
  ? '  ✓ WALLET_PRIVATE_KEY detected — already saved to config'
  : `  1. Open the config file that was just updated and set your wallet key:
       "WALLET_PRIVATE_KEY": "0x<your_64_char_hex_key>"

     How to get a key:
       • MetaMask → Account Details → Export Private Key
       • New wallet: node -e "const {generatePrivateKey}=require('viem/accounts');console.log(generatePrivateKey())"

     Make sure the wallet has USDC on Base (min ~$1 for testing)`}

  2. Restart Claude Code / Claude Desktop / Cursor

  3. Type /mcp in Claude — you should see "blueagent" connected

  4. Ask: "use blueagent to check if 0x4200... is a honeypot"

  ${TOOL_COUNT} tools · pay USDC per call · no subscription
  Docs: https://github.com/madebyshun/blueagent-x402-services
`)
}

if (process.argv[1]?.endsWith('install.js')) main()
