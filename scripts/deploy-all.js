#!/usr/bin/env node

/**
 * Consolidated deploy helper.
 * Runs build once, then:
 * 1. Pushes HEAD to main (or DEPLOY_BRANCH)
 * 2. Creates + pushes pantheon_test_<timestamp> tag
 * 3. Creates + pushes pantheon_live_<timestamp> tag
 *
 * Env overrides:
 * - DEPLOY_BRANCH: branch to push (default main)
 * - TAG_NAME_TEST / TAG_NAME_LIVE: custom tag names
 * - TAG_MESSAGE_TEST / TAG_MESSAGE_LIVE: custom tag messages
 * - SKIP_MAIN / SKIP_TEST / SKIP_LIVE: set to "1" to skip specific steps
 * - DRY_RUN: if set, prints commands instead of executing.
 */

const { execSync } = require("node:child_process");

const run = (cmd, opts = {}) => {
  if (process.env.DRY_RUN) {
    console.log(`[dry-run] ${cmd}`);
    return;
  }
  return execSync(cmd, { stdio: "inherit", ...opts });
};

const output = (cmd) => {
  if (process.env.DRY_RUN) {
    console.log(`[dry-run-output] ${cmd}`);
    return "";
  }
  return execSync(cmd, { encoding: "utf8" }).trim();
};

function ensureCleanWorkingTree() {
  const status = output("git status --porcelain");
  if (status) {
    console.error(
      "Abort: working tree has uncommitted changes. Commit/stash before deploying.",
    );
    process.exit(1);
  }
}

function generateTag(prefix) {
  const stamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  return `${prefix}${stamp}`;
}

function tagExists(tag) {
  if (process.env.DRY_RUN) return false;
  const existing = output(`git tag --list ${tag}`);
  return Boolean(existing);
}

function createAndPushTag({ prefix, tagNameEnv, messageEnv }) {
  const tag = process.env[tagNameEnv] || generateTag(prefix);
  const message = process.env[messageEnv] || `Deploy ${tag}`;

  if (!process.env.DRY_RUN && tagExists(tag)) {
    console.error(`Abort: tag ${tag} already exists.`);
    process.exit(1);
  }

  console.log(`Creating tag ${tag}...`);
  run(`git tag -a ${tag} -m "${message}"`);
  console.log(`Pushing tag ${tag}...`);
  run(`git push origin ${tag}`);
  console.log(`Pushed ${tag}`);
}

function pushMain() {
  const branch = process.env.DEPLOY_BRANCH || "main";
  console.log(`Pushing HEAD to origin/${branch}...`);
  run(`git push origin HEAD:${branch}`);
  console.log(`Pushed to branch ${branch}`);
}

function shouldSkip(flag) {
  return process.env[flag] && process.env[flag] !== "0";
}

async function main() {
  ensureCleanWorkingTree();

  console.log("Building project once...");
  run("npm run build");

  if (!shouldSkip("SKIP_MAIN")) {
    pushMain();
  } else {
    console.log("Skipping main branch push (SKIP_MAIN set).");
  }

  if (!shouldSkip("SKIP_TEST")) {
    createAndPushTag({
      prefix: "pantheon_test_",
      tagNameEnv: "TAG_NAME_TEST",
      messageEnv: "TAG_MESSAGE_TEST",
    });
  } else {
    console.log("Skipping test tag (SKIP_TEST set).");
  }

  if (!shouldSkip("SKIP_LIVE")) {
    createAndPushTag({
      prefix: "pantheon_live_",
      tagNameEnv: "TAG_NAME_LIVE",
      messageEnv: "TAG_MESSAGE_LIVE",
    });
  } else {
    console.log("Skipping live tag (SKIP_LIVE set).");
  }

  console.log("All deploy targets processed.");
}

main().catch((err) => {
  console.error("deploy-all failed:");
  console.error(err?.message || err);
  process.exit(1);
});
