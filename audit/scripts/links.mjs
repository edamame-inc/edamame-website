// Crawl homepage links + key pages; check internal links resolve (read-only).
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const BASE = 'https://edamame-jp.com';
const OUT = new URL('../', import.meta.url).pathname;
const SEEDS = [
  `${BASE}/kintone-philippines/en/`,
  `${BASE}/kintone-philippines/ja/`,
  `${BASE}/kintone-philippines/en/vs/`,
];

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ ignoreHTTPSErrors: true });
const pg = await ctx.newPage();

const internal = new Set(), external = new Set();
const ctaHrefs = new Map();
for (const seed of SEEDS) {
  await pg.goto(seed, { waitUntil: 'domcontentloaded' });
  const links = await pg.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => ({ href: a.href, text: (a.textContent||'').trim().slice(0,40), cls: a.className.toString() })));
  for (const l of links) {
    if (!/^https?:/.test(l.href)) continue;
    if (l.href.startsWith(BASE)) internal.add(l.href.split('#')[0]);
    else external.add(l.href.split('#')[0]);
    if (/book|consult|calendly|contact/i.test(l.href + l.text + l.cls)) ctaHrefs.set(l.href, l.text);
  }
}

// check status of each internal URL
const results = [];
for (const u of [...internal].sort()) {
  try {
    const r = await ctx.request.get(u, { maxRedirects: 0, timeout: 20000 });
    results.push({ url: u.replace(BASE,''), status: r.status() });
  } catch (e) { results.push({ url: u.replace(BASE,''), status: 'ERR', err: String(e).slice(0,80) }); }
}
// check key external (CTA) reachability
const ext = [];
for (const u of [...external]) {
  if (!/calendly|edamame-jp/i.test(u)) continue;
  try { const r = await ctx.request.get(u, { timeout: 20000 }); ext.push({ url: u, status: r.status() }); }
  catch (e) { ext.push({ url: u, status: 'ERR', err: String(e).slice(0,80) }); }
}

await browser.close();
const bad = results.filter(r => r.status !== 200);
const out = { internalCount: results.length, broken: bad, ctaHrefs: [...ctaHrefs.entries()], externalChecked: ext, all: results };
writeFileSync(`${OUT}data/links.json`, JSON.stringify(out, null, 2));
console.log(`internal links: ${results.length} | non-200: ${bad.length}`);
bad.forEach(b => console.log('  BAD', b.status, b.url));
console.log('CTA hrefs:', [...ctaHrefs.entries()].slice(0,5));
