#!/usr/bin/env node
/* Simple deploy helper:
   - npm run deploy:main            -> builds then pushes HEAD to main (or DEPLOY_BRANCH)
   - npm run deploy:pantheon:test   -> builds, tags pantheon_test_<timestamp>, pushes tag
   - npm run deploy:pantheon:live   -> builds, tags pantheon_live_<timestamp>, pushes tag

   Env overrides:
   - DEPLOY_BRANCH: branch name to push for main deploy
   - TAG_NAME: use a specific tag name instead of generated timestamp
   - TAG_MESSAGE: custom tag message (defaults to "Deploy <tag>")
*/

const { execSync } = require('node:child_process');

const target = process.argv[2];

if (!target) {
  console.error('Usage: node scripts/deploy.js <main|pantheon_test|pantheon_live>');
  process.exit(1);
}

const run = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', ...opts });
const output = (cmd) => execSync(cmd, { encoding: 'utf8' }).trim();

function ensureCleanWorkingTree() {
  const status = output('git status --porcelain');
  if (status) {
    console.error('Abort: working tree has uncommitted changes. Commit/stash before deploying.');
    process.exit(1);
  }
}

function generateTag(prefix) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '').slice(0, 15);
  return `${prefix}${stamp}`;
}

function tagExists(tag) {
  const existing = output(`git tag --list ${tag}`);
  return Boolean(existing);
}

try {
  ensureCleanWorkingTree();

  console.log('Building project...');
  run('npm run build');

  if (target === 'main') {
    const branch = process.env.DEPLOY_BRANCH || 'main';
    console.log(`Pushing HEAD to origin/${branch}...`);
    run(`git push origin HEAD:${branch}`);
    console.log(`Deployed to branch ${branch}`);
    process.exit(0);
  }

  if (target === 'pantheon_test' || target === 'pantheon_live') {
    const prefix = target === 'pantheon_test' ? 'pantheon_test_' : 'pantheon_live_';
    const tag = process.env.TAG_NAME || generateTag(prefix);
    const message = process.env.TAG_MESSAGE || `Deploy ${tag}`;

    if (tagExists(tag)) {
      console.error(`Abort: tag ${tag} already exists.`);
      process.exit(1);
    }

    console.log(`Creating tag ${tag}...`);
    run(`git tag -a ${tag} -m "${message}"`);
    console.log(`Pushing tag ${tag} to origin...`);
    run(`git push origin ${tag}`);
    console.log(`Deployed tag ${tag}`);
    process.exit(0);
  }

  console.error(`Unknown target "${target}". Use main | pantheon_test | pantheon_live`);
  process.exit(1);
} catch (err) {
  console.error('Deploy script failed:');
  console.error(err.message || err);
  process.exit(1);
}
