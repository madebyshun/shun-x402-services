// deep-analysis.mjs
// CLI Tool to test Deep Project Due Diligence Service

import { wrapFetchWithPayment } from 'x402-fetch';
import dotenv from 'dotenv';
import { parseArgs } from 'util';

dotenv.config();

const API_URL = 'https://shun-x402-services.bankr.bot/deep-analysis';

async function deepAnalysis(input) {
  if (!input) {
    console.error('❌ Usage: node deep-analysis.mjs <contractAddress or projectName>');
    console.error('Example:');
    console.error('  node deep-analysis.mjs 0x1234...');
    console.error('  node deep-analysis.mjs "Pepe Unchained"');
    process.exit(1);
  }

  console.log(`🔍 Performing Deep Analysis on: ${input}`);

  try {
    const fetchWithPayment = wrapFetchWithPayment({
      payment: {
        amount: '0.35',
        token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
      },
      settleAfterResponse: true,
    });

    const response = await fetchWithPayment(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contractAddress: input.startsWith('0x') ? input : undefined,
        projectName: input.startsWith('0x') ? undefined : input
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log('\n✅ Deep Project Analysis Result:');
    console.log('═══════════════════════════════════════════════');
    console.log(`Project     : ${data.projectName || 'N/A'}`);
    console.log(`Ticker      : ${data.ticker || 'N/A'}`);
    console.log(`Overall Score: ${data.overallScore}/100`);
    console.log(`Risk Score  : ${data.riskScore}/100`);
    console.log(`Rug Probability: ${data.rugProbability}%`);
    console.log(`Recommendation: ${data.recommendation}`);

    console.log('\n📊 Categories:');
    Object.entries(data.categories || {}).forEach(([key, value]) => {
      console.log(`  ${key.padEnd(15)}: ${value}`);
    });

    if (data.keyRisks && data.keyRisks.length > 0) {
      console.log('\n⚠️  Key Risks:');
      data.keyRisks.forEach(risk => console.log(`  • ${risk}`));
    }

    if (data.keyStrengths && data.keyStrengths.length > 0) {
      console.log('\n✅ Key Strengths:');
      data.keyStrengths.forEach(str => console.log(`  • ${str}`));
    }

    if (data.summary) {
      console.log('\n💡 Summary:');
      console.log(data.summary);
    }

    if (data.suggestedActions && data.suggestedActions.length > 0) {
      console.log('\n📌 Suggested Actions:');
      data.suggestedActions.forEach(action => console.log(`  • ${action}`));
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.message.includes('payment')) {
      console.error('💰 Please make sure you have enough USDC in your wallet.');
    }
  }
}

// Parse arguments
const args = parseArgs({
  options: { help: { type: 'boolean', short: 'h' } },
  allowPositionals: true,
});

if (args.values.help) {
  console.log('Usage: node deep-analysis.mjs <contractAddress or projectName>');
  process.exit(0);
}

const input = args.positionals[0];
deepAnalysis(input);