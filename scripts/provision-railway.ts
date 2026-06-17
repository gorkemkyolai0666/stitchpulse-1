#!/usr/bin/env tsx
/**
 * Railway provisioning for StitchPulse backend.
 * Requires RAILWAY_API_TOKEN environment variable.
 */

const PROJECT_NAME = 'stitchpulse';
const GITHUB_REPO = process.env.GITHUB_REPO || 'gorkemkyolai06/stitchpulse';

async function main() {
  const token = process.env.RAILWAY_API_TOKEN;
  if (!token) {
    console.log('RAILWAY_API_TOKEN not set — Railway provisioning skipped');
    console.log('Configure Railway manually via GitHub integration:');
    console.log(`  Repo: ${GITHUB_REPO}`);
    console.log('  Root: backend/');
    console.log('  Branch: main');
    console.log('  Wait for CI: enabled');
    return;
  }

  console.log(`Provisioning Railway project: ${PROJECT_NAME}`);
  // Railway GraphQL API provisioning would go here when token is available
  console.log('Railway API token present — connect repo via Railway dashboard GitHub integration');
}

main().catch(console.error);
