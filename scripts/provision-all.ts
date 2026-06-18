#!/usr/bin/env tsx
/**
 * GrowPulse infrastructure provisioning orchestrator.
 * Idempotent — safe to run multiple times.
 */

const GITHUB_REPO = process.env.GITHUB_REPO || 'gorkemkyolai06/growpulse';

async function main() {
  console.log('════════════════════════════════════════════════════════');
  console.log('GrowPulse Infrastructure Provisioning');
  console.log(`Repository: ${GITHUB_REPO}`);
  console.log('════════════════════════════════════════════════════════');

  const hasRailway = Boolean(process.env.RAILWAY_API_TOKEN);
  const hasVercelMcp = true; // Vercel MCP auth active in Cursor environment

  console.log(`Railway API Token: ${hasRailway ? '✅ present' : '❌ missing'}`);
  console.log(`Vercel MCP: ${hasVercelMcp ? '✅ available (GitHub integration required)' : '❌ unavailable'}`);

  if (hasRailway) {
    const { execSync } = await import('child_process');
    execSync('tsx scripts/provision-railway.ts', { stdio: 'inherit' });
  } else {
    console.log('\n⚠️  RAILWAY_API_TOKEN not set — skipping Railway provisioning');
    console.log('Manual setup required:');
    console.log('  1. Connect GitHub repo to Railway');
    console.log('  2. Root directory: backend/');
    console.log('  3. Enable Wait for CI');
    console.log('  4. Add PostgreSQL plugin');
    console.log('  5. Set JWT_SECRET, FRONTEND_URL env vars');
  }

  if (hasVercelMcp) {
    const { execSync } = await import('child_process');
    execSync('tsx scripts/provision-vercel.ts', { stdio: 'inherit' });
  }

  console.log('\n✅ Provisioning script completed');
}

main().catch((err) => {
  console.error('Provisioning failed:', err);
  process.exit(1);
});
