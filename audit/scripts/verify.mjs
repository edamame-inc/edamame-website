// 1) Extract LCP element + CLS shift sources + render-blocking from homepage LH json.
// 2) Verify the suspicious "white-on-white" elements by reading their real bg chain + element screenshots.
import { readFileSync, existsSync } from 'node:fs';
import { chromium } from 'playwright';
const D = new URL('../data/', import.meta.url).pathname;
const S = new URL('../screens/', import.meta.url).pathname;

// ---- 1. LH homepage mobile diagnostics ----
const lh = JSON.parse(readFileSync(D + 'lh__en-home__mobile.json', 'utf8'));
const a = lh.audits;
console.log('=== HOMEPAGE MOBILE — LCP element ===');
const lcpEl = a['largest-contentful-paint-element'];
console.log(JSON.stringify(lcpEl?.details?.items?.[0]?.items?.[0] || lcpEl?.displayValue || 'n/a').slice(0, 300));
console.log('\n=== CLS — layout shift sources ===');
const cls = a['layout-shift-elements'];
(cls?.details?.items || []).slice(0, 8).forEach(i => console.log(`  shift ${i.score?.toFixed?.(3) ?? i.score}: ${(i.node?.snippet || '').slice(0, 110)}`));
console.log('  CLS total:', a['cumulative-layout-shift']?.numericValue?.toFixed(3));
console.log('\n=== render-blocking ===');
(a['render-blocking-resources']?.details?.items || []).forEach(i => console.log(`  ${Math.round(i.wastedMs)}ms  ${(i.url||'').slice(0,95)}`));
console.log('\n=== font-display audit ===', a['font-display']?.score, '| third-party:', a['third-party-summary']?.displayValue || 'n/a');
console.log('=== LCP breakdown (phases) ===');
(a['largest-contentful-paint']?.details ? [] : []);
const lcpw = a['lcp-lazy-loaded']; console.log('  lcp lazy loaded:', lcpw?.score);

// ---- 2. Verify suspicious white-on-white elements ----
const checks = [
  { id: 'contact', url: 'https://edamame-jp.com/kintone-philippines/en/contact/', sel: 'button.submit-btn, #submitBtn, .form-card button[type=submit]' },
  { id: 'blog-crm', url: 'https://edamame-jp.com/kintone-philippines/en/blog/best-crm-software-philippines-2026/', sel: '.breadcrumb a, nav.breadcrumb a' },
  { id: 'blog-crm-author', url: 'https://edamame-jp.com/kintone-philippines/en/blog/best-crm-software-philippines-2026/', sel: '.author-box a' },
];
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
console.log('\n=== ELEMENT BG VERIFICATION ===');
for (const c of checks) {
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1440, height: 900 } });
  const pg = await ctx.newPage();
  await pg.goto(c.url, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(500);
  const el = pg.locator(c.sel).first();
  const n = await el.count();
  if (!n) { console.log(`  ${c.id} [${c.sel}]: NOT FOUND`); await ctx.close(); continue; }
  const info = await el.evaluate(e => {
    const chain = []; let node = e;
    for (let i = 0; node && node.nodeType === 1 && i < 5; i++) {
      const s = getComputedStyle(node);
      chain.push({ tag: node.tagName.toLowerCase(), cls: node.className?.toString().slice(0,24), color: s.color, bgColor: s.backgroundColor, bgImage: s.backgroundImage.slice(0,40) });
      node = node.parentElement;
    }
    return { text: (e.textContent||'').trim().slice(0,30), chain };
  });
  console.log(`\n  ${c.id} "${info.text}"`);
  info.chain.forEach((x, i) => console.log(`    ${i===0?'EL ':'  ^'} <${x.tag}.${x.cls}> color=${x.color} bg=${x.bgColor} bgImg=${x.bgImage}`));
  try { await el.scrollIntoViewIfNeeded(); await el.screenshot({ path: `${S}verify__${c.id}__${c.sel.split(/[ ,]/)[0].replace(/[^a-z]/gi,'')}.png` }); console.log(`    -> screenshot saved`); } catch(e) { console.log('    (screenshot failed:', String(e).slice(0,60),')'); }
  await ctx.close();
}
await browser.close();
