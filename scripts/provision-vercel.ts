#!/usr/bin/env tsx
/**
 * Vercel provisioning for StitchPulse frontend.
 * Uses GitHub integration — no CLI deployment.
 */

const GITHUB_REPO = process.env.GITHUB_REPO || 'gorkemkyolai06/stitchpulse';

async function main() {
  console.log('Vercel provisioning for StitchPulse frontend');
  console.log('Vercel MCP deploy_to_vercel suggests CLI — using GitHub integration instead');
  console.log('\nManual Vercel setup (one-time):');
  console.log(`  1. Import GitHub repo: ${GITHUB_REPO}`);
  console.log('  2. Root directory: frontend/');
  console.log('  3. Framework: Next.js');
  console.log('  4. Production branch: main');
  console.log('  5. Environment variable: NEXT_PUBLIC_API_URL → Railway backend URL + /api');
  console.log('\nVercel will auto-deploy on push to main after CI passes.');
}

main().catch(console.error);
