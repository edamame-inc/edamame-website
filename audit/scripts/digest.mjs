// Consolidate all collected JSON into a compact digest for report-writing.
import { readFileSync, existsSync } from 'node:fs';
const D = new URL('../data/', import.meta.url).pathname;
const J = f => existsSync(D + f) ? JSON.parse(readFileSync(D + f, 'utf8')) : null;

const res = J('audit-results.json');
const inter = J('interactions.json');
const links = J('links.json');
const lh = J('lighthouse-summary.json');

console.log('========== HYGIENE (per page, desktop) ==========');
for (const [id, p] of Object.entries(res)) {
  const h = p.viewports.desktop?.hygiene;
  if (!h) continue;
  console.log(`\n## ${id}  (${p.url.replace('https://edamame-jp.com','')})`);
  console.log(`  title(${h.titleLen}): ${h.title}`);
  console.log(`  metaDesc: ${h.metaDesc ? h.metaDesc.slice(0,80)+'…' : 'MISSING'}`);
  console.log(`  canonical: ${h.canonical} | lang: ${h.htmlLang} | h1Count: ${h.h1Count} | skipLink: ${h.skipLink}`);
  console.log(`  JSON-LD: ${h.jsonLdCount} blocks [${h.jsonLdTypes.join(', ')}]`);
  console.log(`  OG: ${Object.keys(h.og).length} tags | imgsNoAlt: ${h.imgsNoAlt.length}`);
  // heading order skips
  let prev = 0, skips = [];
  h.headings.forEach(x => { if (prev && x.level > prev + 1) skips.push(`${prev}->${x.level} @ "${x.text}"`); prev = x.level; });
  console.log(`  heading order skips: ${skips.length ? skips.join(' | ') : 'none'}`);
}

console.log('\n\n========== OVERFLOW (any viewport) ==========');
for (const [id, p] of Object.entries(res)) {
  for (const [vp, r] of Object.entries(p.viewports)) {
    if (r.measure?.overflow?.hasHScroll) console.log(`  ${id} @ ${vp}: docW=${r.measure.overflow.docW} innerW=${r.measure.overflow.innerW} -> ${JSON.stringify(r.measure.overflow.overflowers.slice(0,3))}`);
  }
}
console.log('  (nothing above = no horizontal overflow anywhere)');

console.log('\n========== TYPOGRAPHY (desktop) ==========');
for (const [id, p] of Object.entries(res)) {
  const t = p.viewports.desktop?.measure?.typo;
  const fonts = p.viewports.desktop?.measure?.fontFamiliesUsed;
  if (!t) continue;
  console.log(`\n## ${id}`);
  for (const [sel, v] of Object.entries(t)) console.log(`  ${sel.padEnd(14)} ${v.fontSize.padEnd(6)} lh:${v.lineHeight.padEnd(8)} w:${v.fontWeight} ${v.fontStyle}  ${v.fontFamily.slice(0,42)}`);
  console.log(`  families used: ${fonts.join(' | ')}`);
  const inter2 = fonts.filter(f => /inter|arial|helvetica|system|sans-serif$|times|roboto/i.test(f));
  if (inter2.length) console.log(`  ⚠ NON-BRAND families: ${inter2.join(', ')}`);
}

console.log('\n========== LINE LENGTH (chars/line) ==========');
for (const [id, p] of Object.entries(res)) {
  const cpl = p.viewports.desktop?.measure?.cpl || [];
  const flags = cpl.filter(c => c.chars > 75 || c.chars < 45);
  if (cpl.length) console.log(`  ${id}: [${cpl.map(c=>c.chars).join(', ')}]  flags(>75/<45): ${flags.length ? flags.map(f=>f.chars+'@'+f.sel).join('; ') : 'none'}`);
}

console.log('\n========== CONTRAST FAILURES (AA) ==========');
for (const [id, p] of Object.entries(res)) {
  const c = p.viewports.desktop?.measure?.contrast || [];
  const fails = c.filter(x => !x.pass);
  if (fails.length) {
    console.log(`\n## ${id}: ${fails.length} failing pair(s)`);
    fails.forEach(f => console.log(`  ${f.ratio}:1 (need ${f.need}) ${f.large?'[large]':'[body]'} ${f.fg} on ${f.bg} | ${f.fontSize} w${f.weight} | "${f.sample}" | ${f.sel}`));
  }
}
console.log('  (none above = all sampled text passes AA)');

console.log('\n========== TAP TARGETS <44px (mobile-ios) ==========');
for (const [id, p] of Object.entries(res)) {
  const tt = p.viewports['mobile-ios']?.measure?.tapTargets || [];
  if (tt.length) { console.log(`\n## ${id}: ${p.viewports['mobile-ios'].measure.tapCount} under 44px`); tt.slice(0,12).forEach(t => console.log(`  ${t.w}x${t.h} <${t.tag}> "${t.txt}" ${t.sel}`)); }
}

console.log('\n========== AXE VIOLATIONS ==========');
for (const [id, p] of Object.entries(res)) {
  for (const vp of ['desktop','mobile-ios']) {
    const ax = p.viewports[vp]?.axe;
    if (ax && ax.length) { console.log(`\n## ${id} @ ${vp}: ${ax.length} violation type(s)`); ax.forEach(v => console.log(`  [${v.impact}] ${v.id} (${v.n} nodes): ${v.help}\n      e.g. ${v.nodes[0]?.target}`)); }
    else if (ax) console.log(`## ${id} @ ${vp}: 0 violations ✓`);
  }
}

console.log('\n========== CONSOLE / NETWORK ERRORS ==========');
for (const [id, p] of Object.entries(res)) {
  for (const [vp, r] of Object.entries(p.viewports)) {
    const c = (r.console||[]).length, pe = (r.pageErrors||[]).length, f = (r.failed||[]).length;
    if (c+pe+f) {
      console.log(`  ${id} @ ${vp}: console=${c} pageErr=${pe} failed=${f}`);
      (r.failed||[]).slice(0,4).forEach(x => console.log(`      FAILED ${x.status||x.err} ${x.url}`));
      (r.console||[]).slice(0,3).forEach(x => console.log(`      ${x.type}: ${x.text}`));
      (r.pageErrors||[]).slice(0,3).forEach(x => console.log(`      JSERR: ${x}`));
    }
  }
}
console.log('  (clean pages not listed)');

console.log('\n========== INTERACTIONS ==========');
if (inter) {
  console.log(`  reveal-on (html): ${inter.revealOnClass}`);
  console.log(`  gated before scroll (#${inter.gatedBeforeScroll?.id}): opacity=${inter.gatedBeforeScroll?.opacity} polIn=${inter.gatedBeforeScroll?.hasPolIn}`);
  console.log(`  after full scroll: ${inter.afterScroll?.revealed}/${inter.afterScroll?.totalSections} revealed, stuckHidden=${inter.afterScroll?.stuckHidden?.length} ${JSON.stringify(inter.afterScroll?.stuckHidden)}`);
  console.log(`  hover changed: ` + (inter.hover||[]).map(h => `${h.sel}=${h.missing?'MISSING':h.changed}`).join(', '));
  console.log(`  active press: ${inter.activePress?.looksPressed} (${inter.activePress?.transformWhilePressed})`);
  const rings = (inter.focus||[]);
  console.log(`  focus rings: ${rings.filter(f=>f.visibleRing).length}/${rings.length} visible; colors: ${[...new Set(rings.map(f=>f.outlineColor))].join(', ')}`);
  console.log(`  anchor offset: clearsNav=${inter.anchorOffset?.clearsNav} targetTop=${inter.anchorOffset?.targetTopAfterScroll} navH=${inter.anchorOffset?.navH} scrollMargin=${inter.anchorOffset?.scrollMarginTop}`);
  console.log(`  reduced-motion: revealOn=${inter.reducedMotion?.htmlHasRevealOn} allVisible=${inter.reducedMotion?.allVisible} sampleTransition=${inter.reducedMotion?.sampleTransition} hidden=${JSON.stringify(inter.reducedMotion?.hiddenSections)}`);
}

console.log('\n========== LINKS ==========');
if (links) {
  console.log(`  internal checked: ${links.internalCount} | broken(non-200): ${links.broken.length}`);
  links.broken.forEach(b => console.log(`     ${b.status} ${b.url}`));
  console.log(`  CTA hrefs: ${JSON.stringify(links.ctaHrefs.slice(0,6))}`);
  console.log(`  external (calendly) checked: ${JSON.stringify(links.externalChecked)}`);
}

console.log('\n========== LIGHTHOUSE ==========');
if (lh) for (const [k, m] of Object.entries(lh)) {
  if (m.error) { console.log(`  ${k}: ERROR ${m.error}`); continue; }
  console.log(`  ${k}: perf=${m.perfScore} a11y=${m.a11yScore} bp=${m.bestPracticesScore} seo=${m.seoScore} | LCP=${m.LCP_ms}ms CLS=${m.CLS} TBT=${m.TBT_ms}ms FCP=${m.FCP_ms}ms SI=${m.SI_ms}ms | weight=${m.totalByteWeight_kb}KB | renderBlock=${m.renderBlocking.length}`);
}
else console.log('  (lighthouse not run yet)');
