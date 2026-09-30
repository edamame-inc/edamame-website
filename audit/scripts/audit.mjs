// Main read-only UX audit harness for edamame-jp.com
// Captures screenshots + measured data per page per viewport. Writes JSON to data/, PNG to screens/.
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { writeFileSync, mkdirSync } from 'node:fs';

const BASE = 'https://edamame-jp.com';
const OUT = new URL('../', import.meta.url).pathname; // audit/
mkdirSync(OUT + 'data', { recursive: true });
mkdirSync(OUT + 'screens', { recursive: true });

const PAGES = [
  { id: 'en-home',     url: `${BASE}/kintone-philippines/en/`,                                          lang: 'en' },
  { id: 'ja-home',     url: `${BASE}/kintone-philippines/ja/`,                                          lang: 'ja' },
  { id: 'vs',          url: `${BASE}/kintone-philippines/en/vs/`,                                       lang: 'en' },
  { id: 'case-mscorp', url: `${BASE}/kintone-philippines/en/customers/ms-corp/`,                        lang: 'en' },
  { id: 'blog-crm',    url: `${BASE}/kintone-philippines/en/blog/best-crm-software-philippines-2026/`,  lang: 'en' },
  { id: 'contact',     url: `${BASE}/kintone-philippines/en/contact/`,                                  lang: 'en' },
  { id: '404',         url: `${BASE}/this-page-does-not-exist-audit-${Date.now()}/`,                    lang: 'en' },
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900,  isMobile: false, hasTouch: false },
  { name: 'laptop',  width: 1280, height: 800,  isMobile: false, hasTouch: false },
  { name: 'tablet',  width: 768,  height: 1024, isMobile: false, hasTouch: true  },
  { name: 'mobile-ios',     width: 390, height: 844, isMobile: true, hasTouch: true,
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' },
  { name: 'mobile-android', width: 360, height: 800, isMobile: true, hasTouch: true,
    ua: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36' },
];

// ---- in-page measurement function (runs in browser) ----
function measure() {
  const css = (el, p) => getComputedStyle(el).getPropertyValue(p);
  const vis = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05;
  };
  // ---- color parsing + WCAG contrast ----
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(',').map(s => parseFloat(s.trim()));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const over = (fg, bg) => { // composite fg(with alpha) over bg(opaque)
    const a = fg.a; return { r: fg.r*a + bg.r*(1-a), g: fg.g*a + bg.g*(1-a), b: fg.b*a + bg.b*(1-a), a: 1 };
  };
  const effBg = (el) => {
    let node = el, stack = [];
    while (node && node.nodeType === 1) {
      const bg = parse(getComputedStyle(node).backgroundColor);
      if (bg && bg.a > 0) { stack.push(bg); if (bg.a >= 0.999) break; }
      node = node.parentElement;
    }
    let base = { r: 250, g: 250, b: 248, a: 1 }; // off-white fallback
    for (let i = stack.length - 1; i >= 0; i--) base = stack[i].a >= 0.999 ? stack[i] : over(stack[i], base);
    return base;
  };
  const lum = ({ r, g, b }) => { const f = v => { v /= 255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); }; return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b); };
  const ratio = (a, b) => { const L1 = lum(a), L2 = lum(b); const hi = Math.max(L1,L2), lo = Math.min(L1,L2); return (hi+0.05)/(lo+0.05); };

  // ---- overflow ----
  const docW = document.documentElement.scrollWidth;
  const innerW = window.innerWidth;
  const overflowers = [];
  if (docW > innerW + 1) {
    document.querySelectorAll('*').forEach(el => {
      if (!vis(el)) return;
      const r = el.getBoundingClientRect();
      if (r.right > innerW + 2 && r.width <= innerW + 200 && r.width > 12) {
        overflowers.push({ sel: cssPath(el), right: Math.round(r.right), w: Math.round(r.width), tag: el.tagName.toLowerCase(), cls: el.className?.toString().slice(0,40) });
      }
    });
  }

  function cssPath(el) {
    if (!el || el.nodeType !== 1) return '';
    if (el.id) return '#' + el.id;
    const parts = [];
    let node = el;
    for (let i = 0; node && node.nodeType === 1 && i < 4; i++) {
      let s = node.tagName.toLowerCase();
      const c = node.className && node.className.toString().trim().split(/\s+/).filter(Boolean).slice(0,2).join('.');
      if (c) s += '.' + c;
      parts.unshift(s); node = node.parentElement;
    }
    return parts.join(' > ');
  }

  // ---- typography ----
  const typo = {};
  for (const sel of ['h1', 'h2', 'h3', 'p', 'nav a', 'a.btn-primary', '.eyebrow', 'footer a']) {
    const el = [...document.querySelectorAll(sel)].find(vis);
    if (el) {
      const s = getComputedStyle(el);
      typo[sel] = { fontFamily: s.fontFamily, fontSize: s.fontSize, lineHeight: s.lineHeight, fontWeight: s.fontWeight, fontStyle: s.fontStyle };
    }
  }
  // body line length (chars per line) on representative paragraphs
  const cpl = [];
  const cnv = document.createElement('canvas').getContext('2d');
  [...document.querySelectorAll('p')].filter(vis).slice(0, 8).forEach(p => {
    const s = getComputedStyle(p);
    const txt = (p.textContent || '').trim();
    if (txt.length < 40) return;
    cnv.font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
    const sample = txt.slice(0, 200);
    const avg = cnv.measureText(sample).width / sample.length;
    const contentW = p.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight);
    if (avg > 0 && contentW > 0) cpl.push({ chars: Math.round(contentW / avg), fontSize: s.fontSize, lineHeight: s.lineHeight, sel: cssPath(p) });
  });

  // ---- fonts loaded ----
  const fontsLoaded = [...document.fonts].map(f => `${f.family} ${f.weight} ${f.style} (${f.status})`);
  const fontFamiliesUsed = new Set();
  document.querySelectorAll('h1,h2,h3,h4,p,a,span,div,li,button').forEach(el => {
    if (vis(el) && (el.textContent || '').trim()) fontFamiliesUsed.add(getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, '').trim());
  });

  // ---- contrast scan (dedup) ----
  const seen = new Map();
  document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a,span,li,button,strong,em,small,div,label,td,th,summary').forEach(el => {
    if (!vis(el)) return;
    const direct = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!direct) return;
    const s = getComputedStyle(el);
    const fg = parse(s.color); if (!fg) return;
    const bg = effBg(el);
    const fgC = fg.a < 1 ? over(fg, bg) : fg;
    const fsize = parseFloat(s.fontSize); const bold = +s.fontWeight >= 700;
    const large = fsize >= 24 || (fsize >= 18.66 && bold);
    const cr = ratio(fgC, bg);
    const need = large ? 3 : 4.5;
    const key = `${Math.round(fgC.r)},${Math.round(fgC.g)},${Math.round(fgC.b)}|${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)}|${Math.round(fsize)}|${bold}`;
    if (!seen.has(key)) {
      seen.set(key, {
        ratio: +cr.toFixed(2), need, pass: cr >= need, large,
        fg: `rgb(${Math.round(fgC.r)},${Math.round(fgC.g)},${Math.round(fgC.b)})`,
        bg: `rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)})`,
        fontSize: Math.round(fsize) + 'px', weight: s.fontWeight,
        sample: (el.textContent || '').trim().slice(0, 45), sel: cssPath(el),
      });
    }
  });
  const contrast = [...seen.values()];

  // ---- tap targets (interactive) ----
  const tap = [];
  document.querySelectorAll('a,button,[role="button"],input:not([type=hidden]),select,textarea,summary').forEach(el => {
    if (!vis(el)) return;
    const r = el.getBoundingClientRect();
    if (r.width < 44 || r.height < 44) {
      tap.push({ w: Math.round(r.width), h: Math.round(r.height), tag: el.tagName.toLowerCase(),
        txt: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30), sel: cssPath(el) });
    }
  });

  return {
    overflow: { docW, innerW, hasHScroll: docW > innerW + 1, overflowers: overflowers.slice(0, 25) },
    typo, cpl, fontsLoaded, fontFamiliesUsed: [...fontFamiliesUsed],
    contrast, tapTargets: tap.slice(0, 60), tapCount: tap.length,
  };
}

// ---- page hygiene (run once at desktop) ----
function hygiene() {
  const get = (sel, attr) => { const e = document.querySelector(sel); return e ? (attr ? e.getAttribute(attr) : e.textContent) : null; };
  const og = {}; document.querySelectorAll('meta[property^="og:"]').forEach(m => og[m.getAttribute('property')] = m.getAttribute('content'));
  const ld = []; document.querySelectorAll('script[type="application/ld+json"]').forEach(s => { try { const j = JSON.parse(s.textContent); ld.push(Array.isArray(j) ? j.map(x => x['@type']).join('+') : j['@type']); } catch(e) { ld.push('PARSE_ERROR'); } });
  // headings order
  const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => ({ level: +h.tagName[1], text: (h.textContent||'').trim().slice(0,50) }));
  // images missing alt
  const imgsNoAlt = [...document.querySelectorAll('img')].filter(i => !i.hasAttribute('alt')).map(i => i.src);
  const links = [...document.querySelectorAll('a[href]')].map(a => ({ href: a.href, text: (a.textContent||'').trim().slice(0,40) }));
  return {
    title: document.title, titleLen: document.title.length,
    metaDesc: get('meta[name="description"]', 'content'),
    canonical: get('link[rel="canonical"]', 'href'),
    htmlLang: document.documentElement.lang,
    og, jsonLdTypes: ld, jsonLdCount: document.querySelectorAll('script[type="application/ld+json"]').length,
    headings: heads, imgsNoAlt, linkCount: links.length, links,
    h1Count: document.querySelectorAll('h1').length,
    skipLink: !!document.querySelector('a[href="#main-content"], a.skip-link'),
  };
}

const results = {};
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });

for (const page of PAGES) {
  results[page.id] = { url: page.url, viewports: {} };
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ ignoreHTTPSErrors: true,
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1, isMobile: vp.isMobile, hasTouch: vp.hasTouch,
      userAgent: vp.ua || undefined,
    });
    const pg = await ctx.newPage();
    const console_ = [], pageErrors = [], failed = [];
    pg.on('console', m => { if (['error','warning'].includes(m.type())) console_.push({ type: m.type(), text: m.text().slice(0, 200) }); });
    pg.on('pageerror', e => pageErrors.push(String(e).slice(0, 200)));
    pg.on('requestfailed', r => failed.push({ url: r.url().slice(0,120), err: r.failure()?.errorText }));
    pg.on('response', r => { if (r.status() >= 400) failed.push({ url: r.url().slice(0,120), status: r.status() }); });

    const rec = { console: console_, pageErrors, failed };
    try {
      const resp = await pg.goto(page.url, { waitUntil: 'networkidle', timeout: 45000 });
      rec.httpStatus = resp ? resp.status() : null;
      await pg.waitForTimeout(900); // allow fonts + reveal
      // scroll through to trigger reveal, then back to top for fold shot
      await pg.evaluate(async () => { await new Promise(r => { let y=0; const t=setInterval(()=>{ window.scrollBy(0, window.innerHeight); y+=window.innerHeight; if (y>document.body.scrollHeight){clearInterval(t);r();} }, 60); }); });
      await pg.waitForTimeout(500);
      await pg.evaluate(() => window.scrollTo(0, 0));
      await pg.waitForTimeout(300);

      rec.measure = await pg.evaluate(measure);
      if (vp.name === 'desktop') rec.hygiene = await pg.evaluate(hygiene);

      const base = `${OUT}screens/${page.id}__${vp.name}`;
      await pg.screenshot({ path: `${base}__fold.png`, clip: { x:0, y:0, width: vp.width, height: vp.height } });
      await pg.screenshot({ path: `${base}__full.png`, fullPage: true });

      // axe at desktop + mobile-ios only
      if (vp.name === 'desktop' || vp.name === 'mobile-ios') {
        try {
          const ax = await new AxeBuilder({ page: pg }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
          rec.axe = ax.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, n: v.nodes.length,
            nodes: v.nodes.slice(0,5).map(n => ({ target: n.target.join(' '), summary: (n.failureSummary||'').slice(0,160) })) }));
          writeFileSync(`${OUT}data/axe__${page.id}__${vp.name}.json`, JSON.stringify(rec.axe, null, 2));
        } catch (e) { rec.axeError = String(e).slice(0,150); }
      }
    } catch (e) {
      rec.error = String(e).slice(0, 250);
    }
    results[page.id].viewports[vp.name] = rec;
    await ctx.close();
    console.log(`done ${page.id} @ ${vp.name}  http=${rec.httpStatus} overflow=${rec.measure?.overflow?.hasHScroll} axe=${rec.axe?.length ?? '-'} err=${rec.error||''}`);
  }
}

await browser.close();
writeFileSync(`${OUT}data/audit-results.json`, JSON.stringify(results, null, 2));
console.log('\nWROTE data/audit-results.json');
