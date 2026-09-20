#!/usr/bin/env node
// Rewrites every <span data-price="KEY">…</span> from data/pricing.json.
// Run after changing a price. Never edit a price in a page by hand.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const P = JSON.parse(readFileSync('data/pricing.json', 'utf8'));
const d = P.derived['kintone-25u-year'];
const K = Math.round((P.kintone_from.amount * d.users * d.months) / 1000);
const MAP = {
  'kintone-from':      { en: P.kintone_from.display_en,   ja: P.kintone_from.display_ja },
  'implementation':    { en: P.implementation.display_en, ja: P.implementation.display_ja },
  'kintone-25u-year':  { en: d.label_en.replace('{K}', K), ja: d.label_ja.replace('{K}', Math.round(K/10)) },
};
const walk = (d, out = []) => {
  for (const f of readdirSync(d)) {
    if (['.git', '_backups', 'audit', 'node_modules'].includes(f)) continue;
    const p = join(d, f);
    statSync(p).isDirectory() ? walk(p, out) : p.endsWith('.html') && out.push(p);
  }
  return out;
};
let files = 0, spans = 0, jsonld = 0;
for (const p of walk('.')) {
  const lang = p.includes('/ja/') ? 'ja' : 'en';
  const src = readFileSync(p, 'utf8');
  const out = src.replace(/<span data-price="([a-z0-9-]+)">[^<]*<\/span>/g, (m, key) => {
    const v = MAP[key]?.[lang];
    if (!v) { console.error(`UNKNOWN data-price key "${key}" in ${p}`); process.exit(1); }
    spans++; return `<span data-price="${key}">${v}</span>`;
  });
  // JSON-LD cannot contain markup, so prices live there as plain text and are matched by shape.
  const EN_SHAPE = /from ₱[0-9][0-9,]* per user\/month/g;
  const JA_SHAPE = /1ユーザーあたり月額[0-9][0-9,]*ペソ〜/g;
  const out2 = out.replace(/<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g, (blk) => {
    // Only touch prices in blocks that are about Kintone — never a competitor's Offer.
    if (!/Kintone|キントーン/i.test(blk)) return blk;
    let b = blk.replace(EN_SHAPE, MAP['kintone-from'].en).replace(JA_SHAPE, MAP['kintone-from'].ja);
    b = b.replace(/"price"\s*:\s*"?[0-9][0-9.]*"?/g, `"price":${P.kintone_from.amount}`);
    if (b !== blk) jsonld++;
    return b;
  });
  if (out2 !== src) { writeFileSync(p, out2); files++; }
}
console.log(`sync-pricing: ${spans} spans + ${jsonld} JSON-LD blocks checked, ${files} files rewritten`);
