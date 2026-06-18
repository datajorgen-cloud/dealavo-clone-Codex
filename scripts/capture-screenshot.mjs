import { mkdirSync } from 'node:fs';
import { access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const candidates = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  process.env.CHROME_BIN,
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

async function firstUsableExecutable() {
  for (const candidate of candidates) {
    try {
      await access(candidate);
      const probe = spawnSync(candidate, ['--version'], { encoding: 'utf8', timeout: 3000 });
      if (probe.status === 0) return candidate;
    } catch {
      // Try the next candidate; Playwright can still fall back to its managed browser below.
    }
  }
  return undefined;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const output = resolve(__dirname, '..', 'screenshots', 'pricepilot-home.png');
mkdirSync(dirname(output), { recursive: true });

const executablePath = await firstUsableExecutable();
const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  await page.goto(process.env.APP_URL ?? 'http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: output, fullPage: true });
  console.log(`Screenshot written to ${output}`);
} finally {
  await browser.close();
}
