#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const binDir = path.resolve('node_modules/.bin');
const jestPath = path.join(binDir, 'jest');

fs.mkdirSync(binDir, { recursive: true });

const scriptContents = `#!/usr/bin/env node
const path = require('node:path');
require(path.resolve(__dirname, '../../scripts/jest-lite.js'));
`;

fs.writeFileSync(jestPath, scriptContents, { mode: 0o755 });

console.log(`Created offline jest runner at ${jestPath}`);
