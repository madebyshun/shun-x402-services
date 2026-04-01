// x402/deep-analysis/index.mjs
// Deep Project Due Diligence - 0.35 USDC per analysis
// Powered by Blue Agent

import { callLLM } from '../../utils/llm.js';

export default async function handler(req) {
  try {
    const { contractAddress, projectName, ticker } = req.body || {};

    if (!contractAddress && !projectName) {
      return {
        status: 400,
        body: { error: "Please provide either contractAddress or projectName" }
      };
    }

    const input = contractAddress 
      ? contractAddress 
      : `${projectName}${ticker ? ` (${ticker})` : ''}`;

    console.log(`[BlueAgent DeepAnalysis] Analyzing: ${input}`);

    const systemPrompt = `You are a senior crypto due diligence analyst on Base chain, powered by Blue Agent.

Return ONLY a valid JSON object with this exact structure. No extra text:

{
  "projectName": "string",
  "ticker": "string or null",
  "contractAddress": "string or null",
  "riskScore": number (0-100, higher = riskier),
  "overallScore": number (0-100),
  "rugProbability": number (0-