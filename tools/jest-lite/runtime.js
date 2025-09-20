function createExpect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${actual} to be ${expected}`);
      }
    },
    toBeDefined() {
      if (actual === undefined) {
        throw new Error('Expected value to be defined');
      }
    },
    toBeGreaterThan(expected) {
      if (!(actual > expected)) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`);
      }
    },
    toBeGreaterThanOrEqual(expected) {
      if (!(actual >= expected)) {
        throw new Error(`Expected ${actual} to be greater than or equal to ${expected}`);
      }
    },
    toEqual(expected) {
      const actualJson = JSON.stringify(actual);
      const expectedJson = JSON.stringify(expected);
      if (actualJson !== expectedJson) {
        throw new Error(`Expected ${actualJson} to equal ${expectedJson}`);
      }
    }
  };
}

async function runSuite(tests, beforeAlls, afterAlls) {
  for (const hook of beforeAlls) {
    await hook();
  }
  const results = [];
  for (const test of tests) {
    try {
      await test.fn();
      results.push({ name: test.fullName, status: 'passed' });
    } catch (error) {
      results.push({ name: test.fullName, status: 'failed', error });
    }
  }
  for (const hook of afterAlls) {
    try {
      await hook();
    } catch (error) {
      console.error('afterAll hook failed', error);
    }
  }
  return results;
}

const path = require('node:path');
const Module = require('node:module');

const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function patched(request, parent, isMain, options) {
  if (typeof request === 'string' && request.startsWith('@/')) {
    const resolved = path.resolve(process.cwd(), '.test-dist', request.slice(2));
    return originalResolveFilename.call(this, resolved, parent, isMain, options);
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

async function runTests(files) {
  const tests = [];
  const beforeAlls = [];
  const afterAlls = [];
  const suiteStack = [];

  const globalAny = global;

  globalAny.describe = (name, fn) => {
    suiteStack.push(name);
    try {
      fn();
    } finally {
      suiteStack.pop();
    }
  };

  globalAny.it = (name, fn) => {
    const fullName = [...suiteStack, name].join(' › ');
    tests.push({ name, fullName, fn });
  };

  globalAny.test = globalAny.it;

  globalAny.beforeAll = (fn) => {
    beforeAlls.push(fn);
  };

  globalAny.afterAll = (fn) => {
    afterAlls.push(fn);
  };

  globalAny.expect = createExpect;

  for (const file of files) {
    delete require.cache[file];
    require(file);
  }

  const results = await runSuite(tests, beforeAlls, afterAlls);
  let passed = 0;
  let failed = 0;
  for (const result of results) {
    if (result.status === 'passed') {
      passed += 1;
      console.log(`✓ ${result.name}`);
    } else {
      failed += 1;
      console.error(`✗ ${result.name}`);
      if (result.error) {
        console.error(result.error);
      }
    }
  }
  console.log(`\nTest summary: ${passed} passed, ${failed} failed.`);
  return failed === 0;
}

module.exports = {
  runTests
};
