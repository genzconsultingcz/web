import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('/Users/kulo/.npm/_npx/e41f203b7505f1fb/node_modules/playwright');
import { mkdir } from 'fs/promises';
import path from 'path';

const BASE_URL = 'http://localhost:3000';
const LOCALE = 'cs';
const OUT_DIR = path.join(process.cwd(), 'screenshots');

const pages = [
  { name: '01-home', path: `/${LOCALE}` },
  { name: '02-services', path: `/${LOCALE}/services` },
  { name: '03-services-career-pages', path: `/${LOCALE}/services/career-pages` },
  { name: '04-services-onboarding-app', path: `/${LOCALE}/services/onboarding-app` },
  { name: '05-services-trainee-program', path: `/${LOCALE}/services/trainee-program` },
  { name: '06-services-genz-workshop', path: `/${LOCALE}/services/genz-workshop` },
  { name: '07-services-custom', path: `/${LOCALE}/services/custom` },
  { name: '08-contact', path: `/${LOCALE}/contact` },
];

await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
const page = await context.newPage();

for (const { name, path: pagePath } of pages) {
  const url = `${BASE_URL}${pagePath}`;
  console.log(`Screenshotting ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle' });
  // scroll to bottom to trigger lazy-loaded content, then back to top
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let y = 0;
      const step = 400;
      const delay = 80;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        y += step;
        if (y >= document.body.scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, delay);
    });
  });
  await page.waitForTimeout(1500);
  const file = path.join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`  -> ${file}`);
}

await browser.close();
console.log(`\nDone! ${pages.length} screenshots saved to: ${OUT_DIR}`);
