#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const args = process.argv.slice(2);
let testFiles = [];
const runByPathIndex = args.indexOf('--runTestsByPath');
if (runByPathIndex !== -1) {
  testFiles = args.slice(runByPathIndex + 1);
} else {
  const unitDir = path.resolve('tests/unit');
  testFiles = fs
    .readdirSync(unitDir)
    .filter((file) => file.endsWith('.test.ts'))
    .map((file) => path.join('tests/unit', file));
}

if (testFiles.length === 0) {
  console.error('No test files specified.');
  process.exit(1);
}

process.env.PRISMA_MOCK = '1';

const distDir = path.resolve('.test-dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}

const tscResult = spawnSync('tsc', ['--project', 'tsconfig.test.json'], {
  stdio: 'inherit'
});
if (tscResult.status !== 0) {
  process.exit(tscResult.status ?? 1);
}

const compiledTests = testFiles.map((file) => {
  const compiled = path.resolve('.test-dist', file.replace(/\.ts$/, '.js'));
  if (!fs.existsSync(compiled)) {
    console.error(`Compiled file missing for ${file}`);
    process.exit(1);
  }
  return compiled;
});

const runtimePath = path.resolve('tools/jest-lite/runtime.js');
if (!fs.existsSync(runtimePath)) {
  console.error('Runtime helper missing at tools/jest-lite/runtime.js');
  process.exit(1);
}

Promise.resolve()
  .then(() => require(runtimePath).runTests(compiledTests))
  .then((passed) => {
    process.exit(passed ? 0 : 1);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
