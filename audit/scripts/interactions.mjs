// Verify the shipped interaction polish (read-only) on the EN homepage.
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const BASE = 'https://edamame-jp.com';
const URL_ = `${BASE}/kintone-philippines/en/`;
const OUT = new URL('../', import.meta.url).pathname;
const out = {};

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });

// ---------- 1. NORMAL motion (desktop) ----------
{
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const pg = await ctx.newPage();
  await pg.goto(URL_, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(800);

  // reveal-on present on <html>?
  out.revealOnClass = await pg.evaluate(() => document.documentElement.classList.contains('reveal-on'));

  // a below-fold section should be gated (opacity ~0) before we scroll to it
  out.gatedBeforeScroll = await pg.evaluate(() => {
    const s = document.querySelector('#pricing') || document.querySelector('main > section:nth-of-type(6)');
    if (!s) return null;
    const cs = getComputedStyle(s);
    return { id: s.id, opacity: +cs.opacity, hasPolIn: s.classList.contains('pol-in'), transform: cs.transform };
  });

  // scroll fully, then check NOTHING is stuck hidden
  await pg.evaluate(async () => { await new Promise(r => { let y=0; const t=setInterval(()=>{ window.scrollBy(0,700); y+=700; if (y>document.body.scrollHeight){clearInterval(t);r();} },50); }); });
  await pg.waitForTimeout(1200);
  out.afterScroll = await pg.evaluate(() => {
    const secs = [...document.querySelectorAll('main > section')];
    const hidden = secs.filter(s => +getComputedStyle(s).opacity < 0.5).map(s => ({ id: s.id || s.className, op: +getComputedStyle(s).opacity }));
    return { totalSections: secs.length, revealed: secs.filter(s => s.classList.contains('pol-in')).length, stuckHidden: hidden };
  });

  await pg.evaluate(() => window.scrollTo(0, 0));
  await pg.waitForTimeout(400);

  // hover state on a card + a button + nav link
  async function hoverDelta(sel) {
    const el = pg.locator(sel).first();
    if (await el.count() === 0) return { sel, missing: true };
    const before = await el.evaluate(e => { const s = getComputedStyle(e); return { transform: s.transform, boxShadow: s.boxShadow, color: s.color, borderColor: s.borderColor }; });
    await el.hover();
    await pg.waitForTimeout(280);
    const after = await el.evaluate(e => { const s = getComputedStyle(e); return { transform: s.transform, boxShadow: s.boxShadow, color: s.color, borderColor: s.borderColor }; });
    return { sel, changed: JSON.stringify(before) !== JSON.stringify(after), before, after };
  }
  out.hover = [];
  try { for (const sel of ['.value', '.case', 'a.btn-primary', '.nav-cta', 'nav a', '.trust-logos a']) out.hover.push(await hoverDelta(sel)); } catch (e) { out.hoverError = String(e).slice(0,120); }

  // keyboard focus ring across first 10 tabs (do this BEFORE any click test)
  out.focus = [];
  try {
    for (let i = 0; i < 10; i++) {
      await pg.keyboard.press('Tab');
      const f = await pg.evaluate(() => {
        const a = document.activeElement; if (!a || a === document.body) return null;
        const s = getComputedStyle(a);
        return { tag: a.tagName.toLowerCase(), text: (a.textContent||a.getAttribute('aria-label')||'').trim().slice(0,28),
          outlineStyle: s.outlineStyle, outlineWidth: s.outlineWidth, outlineColor: s.outlineColor, outlineOffset: s.outlineOffset };
      });
      if (f) { f.visibleRing = f.outlineStyle !== 'none' && parseFloat(f.outlineWidth) > 0; out.focus.push(f); }
      if (i === 3) await pg.screenshot({ path: `${OUT}screens/en-home__desktop__focus-ring.png`, clip: { x:0, y:0, width:1440, height:160 } });
    }
  } catch (e) { out.focusError = String(e).slice(0,120); }

  // smooth-scroll anchor offset clears sticky nav (in-page hash only; no nav away)
  try {
    out.anchorOffset = await pg.evaluate(async () => {
      const nav = document.querySelector('header.nav, .nav'); const navH = nav ? nav.getBoundingClientRect().height : 0;
      const link = [...document.querySelectorAll('a[href^="#"]')].find(a => a.getAttribute('href').length > 1 && document.querySelector(a.getAttribute('href')));
      if (!link) return { navH, note: 'no in-page anchor' };
      const id = link.getAttribute('href');
      window.scrollTo(0,0);
      link.click();
      await new Promise(r => setTimeout(r, 900));
      const target = document.querySelector(id);
      const top = target.getBoundingClientRect().top;
      return { anchor: id, navH: Math.round(navH), targetTopAfterScroll: Math.round(top), clearsNav: top >= navH - 2, scrollMarginTop: getComputedStyle(target).scrollMarginTop };
    });
  } catch (e) { out.anchorError = String(e).slice(0,120); }

  // :active press feedback — prevent the click from navigating away (read-only DOM guard)
  try {
    await pg.evaluate(() => window.scrollTo(0, 0));
    const btn = pg.locator('a.btn-primary, .nav-cta').first();
    await btn.evaluate(e => e.addEventListener('click', ev => { ev.preventDefault(); ev.stopPropagation(); }, { capture: true }));
    const box = await btn.boundingBox();
    if (box) {
      await pg.mouse.move(box.x + box.width/2, box.y + box.height/2);
      await pg.mouse.down();
      await pg.waitForTimeout(120);
      const t = await btn.evaluate(e => getComputedStyle(e).transform);
      await pg.mouse.up();
      out.activePress = { transformWhilePressed: t, looksPressed: t !== 'none' && t !== 'matrix(1, 0, 0, 1, 0, 0)' };
    }
  } catch (e) { out.activePressError = String(e).slice(0,120); }

  await ctx.close();
}

// ---------- 2. REDUCED MOTION ----------
try {
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const pg = await ctx.newPage();
  await pg.goto(URL_, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(800);
  out.reducedMotion = await pg.evaluate(() => {
    const secs = [...document.querySelectorAll('main > section')];
    const hidden = secs.filter(s => +getComputedStyle(s).opacity < 0.9).map(s => s.id || s.className);
    const sample = secs[5] || secs[secs.length-1];
    return {
      htmlHasRevealOn: document.documentElement.classList.contains('reveal-on'),
      allVisible: hidden.length === 0, hiddenSections: hidden,
      sampleTransition: sample ? getComputedStyle(sample).transition : null,
      sampleOpacity: sample ? +getComputedStyle(sample).opacity : null,
    };
  });
  await pg.screenshot({ path: `${OUT}screens/en-home__desktop__reduced-motion__full.png`, fullPage: true });
  await ctx.close();
} catch (e) { out.reducedMotionError = String(e).slice(0,150); }

await browser.close();
writeFileSync(`${OUT}data/interactions.json`, JSON.stringify(out, null, 2));
console.log('interactions:', JSON.stringify({
  revealOn: out.revealOnClass, gated: out.gatedBeforeScroll?.opacity, stuckHidden: out.afterScroll?.stuckHidden?.length,
  hoverChanged: out.hover?.filter(h=>h.changed).length + '/' + out.hover?.length, activePressed: out.activePress?.looksPressed,
  focusRings: out.focus?.filter(f=>f.visibleRing).length + '/' + out.focus?.length, anchorClearsNav: out.anchorOffset?.clearsNav,
  rmAllVisible: out.reducedMotion?.allVisible, rmRevealOn: out.reducedMotion?.htmlHasRevealOn,
}, null, 2));
