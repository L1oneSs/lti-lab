import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const envPath = resolve(root, '.env');
if (!process.env.CODESPACE_NAME) {
  console.error('Run this setup inside GitHub Codespaces. Local .env was not changed.');
  process.exitCode = 1;
} else if (existsSync(envPath)) {
  console.log('Existing .env preserved. Check PUBLIC_URL if the Codespace changed.');
} else {
  const domain = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN || 'app.github.dev';
  const publicUrl = `https://${process.env.CODESPACE_NAME}-3000.${domain}`;
  const template = readFileSync(resolve(root, '.env.example'), 'utf8');
  writeFileSync(envPath, template.replace(/^PUBLIC_URL=.*$/m, `PUBLIC_URL=${publicUrl}`),
    { encoding: 'utf8', mode: 0o600, flag: 'wx' });
  console.log(`Created .env. PUBLIC_URL=${publicUrl}`);
  console.log('Fill the exact Moodle platform details in .env; set port 3000 visibility to Public.');
}
