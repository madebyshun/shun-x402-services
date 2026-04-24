import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import TextInput from 'ink-text-input'

interface Props {
  endpoint: string
  params: string[]
  onRun: (endpoint: string, body: Record<string, string>) => void
  onBack: () => void
  loading: boolean
  result: unknown
  error: string | null
}

export function ToolRunner({ endpoint, params, onRun, onBack, loading, result, error }: Props) {
  const required = params.filter(p => !p.endsWith('?'))
  const optional = params.filter(p => p.endsWith('?')).map(p => p.slice(0, -1))
  const allFields = [...required, ...optional]

  const [values, setValues] = useState<Record<string, string>>({})
  const [cursor, setCursor] = useState(0)

  useInput((_, key) => {
    if (key.escape) { onBack(); return }
    if (key.return && cursor < allFields.length) setCursor(c => c + 1)
    if (key.return && cursor === allFields.length) {
      onRun(endpoint, values)
    }
  })

  if (loading) return (
    <Box><Text color="blueBright">⏳ Calling {endpoint} via x402...</Text></Box>
  )

  if (result) return (
    <Box flexDirection="column">
      <Text color="green" bold>✓ Result from {endpoint}</Text>
      <Text>{JSON.stringify(result, null, 2)}</Text>
      <Text dimColor>esc to go back</Text>
    </Box>
  )

  if (error) return (
    <Box flexDirection="column">
      <Text color="red">✗ Error: {error}</Text>
      <Text dimColor>esc to go back</Text>
    </Box>
  )

  return (
    <Box flexDirection="column">
      <Text color="blueBright" bold>{endpoint}</Text>
      <Box marginBottom={1} />
      {allFields.map((field, i) => (
        <Box key={field} marginBottom={0}>
          <Text color={i === cursor ? 'blue' : 'white'}>
            {field}{required.includes(field) ? ' *' : ' (optional)'}:{' '}
          </Text>
          {i === cursor ? (
            <TextInput
              value={values[field] ?? ''}
              onChange={v => setValues(prev => ({ ...prev, [field]: v }))}
              onSubmit={() => setCursor(c => c + 1)}
            />
          ) : (
            <Text dimColor>{values[field] || '—'}</Text>
          )}
        </Box>
      ))}
      {cursor === allFields.length && (
        <Box marginTop={1}>
          <Text color="green">→ Press Enter to run  ·  esc to cancel</Text>
        </Box>
      )}
    </Box>
  )
}
