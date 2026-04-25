import React from 'react'
import { Box, Text } from 'ink'

const BLUE = `\
 ██████╗ ██╗     ██╗   ██╗███████╗
 ██╔══██╗██║     ██║   ██║██╔════╝
 ██████╔╝██║     ██║   ██║█████╗
 ██╔══██╗██║     ██║   ██║██╔══╝
 ██████╔╝███████╗╚██████╔╝███████╗
 ╚═════╝ ╚══════╝ ╚═════╝ ╚══════╝`

const AGENT = `\
 █████╗  ██████╗ ███████╗███╗   ██╗████████╗
██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝
███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║
██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║
██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║
╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝  ╚═╝   `

export function Logo() {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text color="#4FC3F7" bold>{BLUE}</Text>
      <Text color="#0EA5E9" bold>{AGENT}</Text>
      <Box marginTop={1}>
        <Text color="#6B7280">  Security OS for Autonomous Agents  ·  Base  ·  x402</Text>
      </Box>
    </Box>
  )
}
