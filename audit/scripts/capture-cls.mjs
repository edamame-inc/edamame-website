// Measure CLS directly and attribute each shift to its source node(s).
import { chromium } from 'playwright';
const URL_ = 'https://edamame-jp.com/kintone-philippines/en/';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
for (const mode of [{ name: 'mobile', w: 390, h: 844, cpu: 4 }, { name: 'desktop', w: 1440, h: 900, cpu: 1 }]) {
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: mode.w, height: mode.h }, deviceScaleFactor: 1 });
  const pg = await ctx.newPage();
  const cdp = await ctx.newCDPSession(pg);
  if (mode.cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: mode.cpu });

  await pg.addInitScript(() => {
    window.__cls = 0; window.__shifts = [];
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (e.hadRecentInput) continue;
        window.__cls += e.value;
        window.__shifts.push({
          value: +e.value.toFixed(4), t: Math.round(e.startTime),
          sources: (e.sources || []).map(s => ({
            tag: s.node ? (s.node.tagName ? s.node.tagName.toLowerCase() : s.node.nodeName) : '?',
            cls: s.node && s.node.className ? String(s.node.className).slice(0, 30) : '',
            text: s.node && s.node.textContent ? s.node.textContent.trim().slice(0, 40) : '',
            from: `${Math.round(s.previousRect.y)},${Math.round(s.previousRect.height)}h`,
            to: `${Math.round(s.currentRect.y)},${Math.round(s.currentRect.height)}h`,
          })),
        });
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });

  await pg.goto(URL_, { waitUntil: 'load' });
  await pg.waitForTimeout(4000); // let fonts swap + reveal run
  const r = await pg.evaluate(() => ({ cls: +window.__cls.toFixed(3), shifts: window.__shifts }));
  console.log(`\n=== ${mode.name} (cpu x${mode.cpu})  measured CLS=${r.cls}  (${r.shifts.length} shift entries) ===`);
  r.shifts.sort((a,b)=>b.value-a.value).slice(0,6).forEach(s => {
    console.log(`  +${s.value} @${s.t}ms`);
    s.sources.slice(0,3).forEach(src => console.log(`      <${src.tag}.${src.cls}> y:${src.from}->${src.to} "${src.text}"`));
  });
  await ctx.close();
}
await browser.close();
