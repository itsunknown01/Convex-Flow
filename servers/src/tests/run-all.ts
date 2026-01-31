import { spawn } from "child_process";

const scripts = [
  "src/tests/verify-identity.ts",
  "src/tests/verify-orchestrator.ts",
  "src/tests/verify-queue.ts",
  "src/tests/verify-execution.ts",
  "src/tests/verify-ai.ts",
  "src/tests/verify-ledger.ts",
  "src/tests/verify-policy.ts",
  "src/tests/verify-load.ts",
  "src/tests/verify-production.ts",
];

async function runScript(script: string) {
  console.log(`\n>>> Running ${script}...`);
  return new Promise((resolve) => {
    // Run npx tsx <script> from the current project root
    const child = spawn("npx", ["tsx", script], {
      stdio: "inherit",
      env: process.env,
      shell: true,
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(true);
      } else {
        console.error(`!!! ${script} failed with code ${code}`);
        resolve(false);
      }
    });
  });
}

async function runAll() {
  let allPassed = true;
  for (const script of scripts) {
    const passed = await runScript(script);
    if (!passed) allPassed = false;
  }

  if (allPassed) {
    console.log("\n✅ ALL VERIFICATIONS PASSED");
  } else {
    console.error("\n❌ SOME VERIFICATIONS FAILED");
    process.exit(1);
  }
}

runAll().catch(console.error);
