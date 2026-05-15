#!/usr/bin/env node
/**
 * BlueAgent x402 Services — Full test suite (31 tools)
 * Usage: node test-all.mjs [host]
 * Default: http://localhost:3002
 */

const HOST = process.argv[2] ?? "http://localhost:3002";

// Common test addresses (Base)
const TREASURY  = "0xf31f59e7b8b58555f7871f71973a394c8f1bffe5";
const BLUEAGENT = "0xf895783b2931c919955e18b5e3343e7c7c456ba3"; // BLUEAGENT token
const COINBASE  = "0x71660c4005BA85c37ccec55d0C4493E66Fe775d3";

const TESTS = [
  // ── Quantum ──────────────────────────────────────────────────────────────
  {
    tool: "quantum-premium", label: "quantum-premium: treasury wallet",
    body: { address: TREASURY },
  },
  {
    tool: "quantum-batch", label: "quantum-batch: 3 wallets",
    body: { addresses: [TREASURY, BLUEAGENT, COINBASE] },
  },
  {
    tool: "quantum-migrate", label: "quantum-migrate: treasury",
    body: { address: TREASURY, urgencyLevel: "HIGH" },
  },
  {
    tool: "quantum-timeline", label: "quantum-timeline: general concern",
    body: { concern: "When will quantum computers break Ethereum wallets?" },
  },
  {
    tool: "key-exposure", label: "key-exposure: treasury wallet",
    body: { address: TREASURY },
  },

  // ── Security ─────────────────────────────────────────────────────────────
  {
    tool: "risk-gate", label: "risk-gate: normal swap",
    body: { action: "swap 0.05 ETH to USDC on Uniswap", amount: "$80", context: "portfolio rebalancing" },
  },
  {
    tool: "risk-gate", label: "risk-gate: large unlimited approval",
    body: { action: "approve unlimited USDC", contractAddress: BLUEAGENT, amount: "$5000" },
  },
  {
    tool: "honeypot-check", label: "honeypot-check: BLUEAGENT token",
    body: { token: BLUEAGENT },
    timeout: 20000,
  },
  {
    tool: "allowance-audit", label: "allowance-audit: treasury",
    body: { address: TREASURY },
  },
  {
    tool: "phishing-scan", label: "phishing-scan: Uniswap URL",
    body: { target: "https://app.uniswap.org" },
  },
  {
    tool: "phishing-scan", label: "phishing-scan: suspicious handle",
    body: { target: "@uniswap_airdrop_claim" },
  },
  {
    tool: "mev-shield", label: "mev-shield: large ETH swap",
    body: { action: "swap 10 ETH to USDC on Uniswap v3 Base" },
  },
  {
    tool: "contract-trust", label: "contract-trust: BLUEAGENT contract",
    body: { address: BLUEAGENT },
  },
  {
    tool: "circuit-breaker", label: "circuit-breaker: agent with losses",
    body: { agentId: "blue-agent-v1", action: "swap 5 ETH", context: "DeFi arbitrage loop", recentLosses: "$800", consecutiveBlocks: 3 },
  },

  // ── Research & Analysis ───────────────────────────────────────────────────
  {
    tool: "deep-analysis", label: "deep-analysis: BLUEAGENT token",
    body: { projectName: "Blue Agent", ticker: "BLUEAGENT", contractAddress: BLUEAGENT },
  },
  {
    tool: "deep-analysis", label: "deep-analysis: Uniswap (no contract)",
    body: { projectName: "Uniswap", ticker: "UNI" },
  },
  {
    tool: "launch-advisor", label: "launch-advisor: AI project",
    body: { projectName: "Blue Agent", description: "AI-native founder console for Base builders", targetAudience: "Base builders and crypto founders" },
    timeout: 45000,
  },
  {
    tool: "grant-evaluator", label: "grant-evaluator: strong application",
    body: { projectName: "Blue Agent", description: "AI-native founder console for Base — idea to ship pipeline powered by Bankr LLM", teamBackground: "Solo founder, 10+ shipped products on Base", requestedAmount: "$25,000", milestones: "1) x402 API launch 2) 100 paying users Q3 3) $10k MRR Q4" },
    timeout: 45000,
  },
  {
    tool: "x402-readiness", label: "x402-readiness: freemium SaaS",
    body: { description: "AI writing tool with 1000 free requests/month then paid", currentModel: "freemium SaaS" },
  },
  {
    tool: "base-deploy-check", label: "base-deploy-check: ERC-20 description",
    body: { projectName: "BLUEAGENT", description: "Standard ERC-20 token with 1B supply, no mint/burn, owner can pause" },
  },
  {
    tool: "tokenomics-score", label: "tokenomics-score: BLUEAGENT",
    body: { token: "BLUEAGENT" },
  },
  {
    tool: "whitepaper-tldr", label: "whitepaper-tldr: Base docs",
    body: { url: "https://base.org/about", projectName: "Base" },
    timeout: 25000,
  },
  {
    tool: "vc-tracker", label: "vc-tracker: a16z Base",
    body: { query: "a16z crypto Base ecosystem AI agents" },
  },

  // ── Data & Intelligence ───────────────────────────────────────────────────
  {
    tool: "wallet-pnl", label: "wallet-pnl: treasury wallet",
    body: { address: TREASURY },
  },
  {
    tool: "whale-tracker", label: "whale-tracker: BLUEAGENT token",
    body: { address: BLUEAGENT },
  },
  {
    tool: "aml-screen", label: "aml-screen: treasury wallet",
    body: { address: TREASURY },
  },
  {
    tool: "airdrop-check", label: "airdrop-check: coinbase wallet",
    body: { address: COINBASE },
  },
  {
    tool: "narrative-pulse", label: "narrative-pulse: AI agents",
    body: { query: "AI agents on Base" },
  },
  {
    tool: "dex-flow", label: "dex-flow: BLUEAGENT token",
    body: { token: BLUEAGENT },
    timeout: 20000,
  },

  // ── Earn & LP ─────────────────────────────────────────────────────────────
  {
    tool: "yield-optimizer", label: "yield-optimizer: USDC",
    body: { token: "USDC" },
  },
  {
    tool: "lp-analyzer", label: "lp-analyzer: ETH/USDC position",
    body: { token0: "ETH", token1: "USDC", entryPrice: "2000", investedAmount: "$5000" },
  },
  {
    tool: "tax-report", label: "tax-report: treasury 2025",
    body: { address: TREASURY, year: "2025", country: "US" },
    timeout: 35000,
  },

  // ── Alerts ────────────────────────────────────────────────────────────────
  {
    tool: "alert-subscribe", label: "alert-subscribe: whale+honeypot",
    body: { webhookUrl: "https://httpbin.org/post", topics: ["whale_movement", "honeypot_detected"], addresses: [TREASURY] },
  },
  {
    tool: "alert-check", label: "alert-check: treasury wallet",
    body: { address: TREASURY },
  },
];

// ── Runner ────────────────────────────────────────────────────────────────────

const GREEN  = "\x1b[32m";
const RED    = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN   = "\x1b[36m";
const DIM    = "\x1b[2m";
const BOLD   = "\x1b[1m";
const RESET  = "\x1b[0m";

async function runTest({ tool, label, body, timeout = 30000 }) {
  const start = Date.now();
  try {
    const res = await fetch(`${HOST}/${tool}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeout),
    });
    const ms   = Date.now() - start;
    const data = await res.json();
    const ok   = res.status === 200 && !data.error;
    return { tool, label, ok, ms, status: res.status, data };
  } catch (err) {
    return { tool, label, ok: false, ms: Date.now() - start, status: 0, error: err.message, data: null };
  }
}

function summarize(data) {
  const fields = [
    "decision", "verdict", "score", "riskScore", "risk", "riskLevel",
    "signal", "pressure", "isHoneypot", "exposed", "hasAlerts",
    "sustainabilityScore", "trustScore", "readinessScore", "securityScore",
    "scanned", "subscriptionId", "status", "pnl", "style",
  ];
  const parts = [];
  for (const f of fields) {
    if (data[f] !== undefined && data[f] !== null) {
      parts.push(`${DIM}${f}${RESET}: ${data[f]}`);
    }
  }
  return parts.slice(0, 4).join("  ") || JSON.stringify(data).slice(0, 80);
}

async function main() {
  console.log(`\n${BOLD}🔵 BlueAgent x402 — ${TESTS.length} tests${RESET}`);
  console.log(`   Host: ${HOST}\n`);
  console.log("─".repeat(72));

  // Run all in parallel
  const results = await Promise.all(TESTS.map(runTest));

  let passed = 0;
  let failed = 0;
  let lastTool = "";

  for (const r of results) {
    if (r.tool !== lastTool) {
      if (lastTool) console.log();
      lastTool = r.tool;
    }

    const icon  = r.ok ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
    const ms    = `${YELLOW}${r.ms}ms${RESET}`;
    const lbl   = `${CYAN}${(r.label ?? r.tool).padEnd(40)}${RESET}`;

    if (r.ok) {
      console.log(`  ${icon}  ${lbl}  ${ms.padEnd(14)}  ${summarize(r.data)}`);
      passed++;
    } else {
      const errMsg = r.error ?? r.data?.error ?? r.data?.message ?? "unknown";
      console.log(`  ${icon}  ${lbl}  ${ms.padEnd(14)}  ${RED}[${r.status || "ERR"}] ${errMsg.slice(0, 55)}${RESET}`);
      failed++;
    }
  }

  console.log("\n" + "─".repeat(72));
  console.log(`\n  ${GREEN}${BOLD}${passed} passed${RESET}  ${failed > 0 ? RED + BOLD : ""}${failed} failed${RESET}  of ${TESTS.length} total\n`);

  if (failed > 0) {
    for (const r of results.filter(r => !r.ok && r.data)) {
      console.log(`${RED}--- ${r.label} ---${RESET}`);
      console.log(JSON.stringify(r.data, null, 2));
    }
  }
}

main();
