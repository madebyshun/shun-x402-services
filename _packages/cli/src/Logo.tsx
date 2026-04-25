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
      <Text color="#818CF8" bold>{BLUE}</Text>
      <Text color="#C084FC" bold>{AGENT}</Text>
      <Box marginTop={1}>
        <Text color="#6B7280">  Security OS for Autonomous Agents  ·  Base  ·  x402</Text>
      </Box>
    </Box>
  )
}
