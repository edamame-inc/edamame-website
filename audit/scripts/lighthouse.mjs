// Lighthouse CWV runs (mobile + desktop) on homepage + one blog page. Read-only.
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import * as chromeLauncher from 'chrome-launcher';
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const OUT = new URL('../', import.meta.url).pathname;
const CHROME = chromium.executablePath();
const TARGETS = [
  { id: 'en-home', url: 'https://edamame-jp.com/kintone-philippines/en/' },
  { id: 'blog-crm', url: 'https://edamame-jp.com/kintone-philippines/en/blog/best-crm-software-philippines-2026/' },
];

function extract(lhr) {
  const a = lhr.audits;
  const num = id => a[id] ? a[id].numericValue : null;
  const disp = id => a[id] ? a[id].displayValue : null;
  return {
    perfScore: Math.round((lhr.categories.performance?.score ?? 0) * 100),
    a11yScore: Math.round((lhr.categories.accessibility?.score ?? 0) * 100),
    bestPracticesScore: Math.round((lhr.categories['best-practices']?.score ?? 0) * 100),
    seoScore: Math.round((lhr.categories.seo?.score ?? 0) * 100),
    LCP_ms: Math.round(num('largest-contentful-paint')),
    FCP_ms: Math.round(num('first-contentful-paint')),
    CLS: +(num('cumulative-layout-shift')?.toFixed(3)),
    TBT_ms: Math.round(num('total-blocking-time')),
    SI_ms: Math.round(num('speed-index')),
    TTI_ms: Math.round(num('interactive') ?? 0),
    totalByteWeight_kb: Math.round((num('total-byte-weight') ?? 0) / 1024),
    renderBlocking: (a['render-blocking-resources']?.details?.items || []).map(i => ({ url: (i.url||'').slice(0,90), wasted: Math.round(i.wastedMs||0) })),
    oversizedImages: (a['uses-responsive-images']?.details?.items || []).map(i => ({ url: (i.url||'').slice(0,90), wastedKb: Math.round((i.wastedBytes||0)/1024) })),
    unminifiedCss: a['unminified-css']?.score,
    fontDisplay: a['font-display']?.score,
    mainThreadWork_ms: Math.round(num('mainthread-work-breakdown') ?? 0),
    serverResponse_ms: Math.round(num('server-response-time') ?? 0),
  };
}

const results = {};
for (const t of TARGETS) {
  for (const mode of ['mobile', 'desktop']) {
    const chrome = await chromeLauncher.launch({ chromePath: CHROME, chromeFlags: ['--headless=new','--no-sandbox','--ignore-certificate-errors','--disable-gpu'] });
    try {
      const flags = { port: chrome.port, output: 'json', logLevel: 'error' };
      const cfg = mode === 'desktop' ? desktopConfig : undefined; // default config = mobile
      const runnerResult = await lighthouse(t.url, flags, cfg);
      const lhr = runnerResult.lhr;
      const m = extract(lhr);
      results[`${t.id}__${mode}`] = m;
      writeFileSync(`${OUT}data/lh__${t.id}__${mode}.json`, JSON.stringify(lhr, null, 2));
      console.log(`${t.id} ${mode}: perf=${m.perfScore} LCP=${m.LCP_ms}ms CLS=${m.CLS} TBT=${m.TBT_ms}ms FCP=${m.FCP_ms}ms weight=${m.totalByteWeight_kb}KB`);
    } catch (e) {
      results[`${t.id}__${mode}`] = { error: String(e).slice(0, 200) };
      console.log(`${t.id} ${mode}: ERROR ${String(e).slice(0,120)}`);
    } finally {
      await chrome.kill();
    }
  }
}
writeFileSync(`${OUT}data/lighthouse-summary.json`, JSON.stringify(results, null, 2));
console.log('WROTE data/lighthouse-summary.json');
