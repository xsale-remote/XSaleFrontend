const fs = require('fs');
const path = require('path');

const mode = process.argv[2]; // 'dev' or 'prod'
const envFile = mode === 'prod' ? '.env.production' : '.env';
const envPath = path.resolve(__dirname, '..', '..', envFile);
const outPath = path.resolve(__dirname, '..', 'config', 'env-config.js');

if (!fs.existsSync(envPath)) {
  console.error(`Missing file: ${envFile}`);
  process.exit(1);
}

const lines = fs.readFileSync(envPath, 'utf8').split('\n');
const values = {};

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const [key, ...rest] = trimmed.split('=');
  if (key) values[key.trim()] = rest.join('=').trim();
}

const output = `// AUTO-GENERATED - do not edit manually
// Source: ${envFile}
// Generated: ${new Date().toISOString()}

${Object.entries(values).map(([k, v]) => `export const ${k} = '${v}';`).join('\n')}
`;

fs.mkdirSync(path.dirname(outPath), {recursive: true});
fs.writeFileSync(outPath, output, 'utf8');
console.log(`[env] Generated env-config.js from ${envFile}`);
