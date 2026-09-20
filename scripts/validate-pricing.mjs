#!/usr/bin/env node
// FAILS the build on any price that is not sourced from data/pricing.json.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const P = JSON.parse(readFileSync('data/pricing.json', 'utf8'));
const EN = P.kintone_from.display_en, JA = P.kintone_from.display_ja;
const walk = (d, out = []) => {
  for (const f of readdirSync(d)) {
    if (['.git', '_backups', 'audit', 'node_modules'].includes(f)) continue;
    const p = join(d, f);
    statSync(p).isDirectory() ? walk(p, out) : p.endsWith('.html') && out.push(p);
  }
  return out;
};
const errs = [], warns = [];
const DEBT = new Set(JSON.parse(readFileSync('data/pricing-debt.json', 'utf8')).paths.map(s => s.replace(/\\/g, '/')));
// Edamame service/implementation fees may never be published.
// Competitor pricing is legitimate content and must never be flagged.
const RIVALS = /(odoo|salesforce|sap|hubspot|monday|zoho|airtable|notion|smartsheet|erpnext|quickbooks|qne|oracle|zendesk|freshdesk|kissflow|zapier|power automate|unicommerce|netsuite|xero|scaleocean|hashmicro)/i;
// Only OUR fees are forbidden: Edamame/our must govern, with no rival named in the window.
const FEE = /(?:edamame(?:'s)?|our)\s[^.<]{0,60}?(?:implementation|setup|onboarding|training|service)\s*(?:fee|cost|price)?s?[^.<]{0,25}?₱\s?[0-9][0-9,]*/gi;
for (const p of walk('.')) {
  const lang = p.includes('/ja/') ? 'ja' : 'en';
  const src = readFileSync(p, 'utf8');
  // 1. span contents must equal the canonical display string
  for (const m of src.matchAll(/<span data-price="kintone-from">([^<]*)<\/span>/g)) {
    const want = lang === 'ja' ? JA : EN;
    if (m[1] !== want) errs.push(`${p}: span says "${m[1]}" but pricing.json says "${want}"`);
  }
  // 2. no Kintone-adjacent peso figure outside a span
  // JSON-LD holds prices as plain text (no markup allowed); verify then exclude from the span rule.
  let jsonldOnly = '';
  const noJsonLd = src.replace(/<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g, (b) => { jsonldOnly += b; return '§LD§'; });
  const wantPlain = lang === 'ja' ? JA : EN;
  // every numeric price inside a Kintone JSON-LD block must equal the canonical amount
  for (const blk of jsonldOnly.match(/<script[\s\S]*?<\/script>/g) || []) {
    if (!/Kintone|キントーン/i.test(blk)) continue;
    for (const m of blk.matchAll(/"price"\s*:\s*"?([0-9][0-9.]*)"?/g)) {
      if (Number(m[1]) !== P.kintone_from.amount) errs.push(`${p}: JSON-LD price ${m[1]} != canonical ${P.kintone_from.amount}`);
    }
  }
  for (const m of jsonldOnly.matchAll(/(?:Kintone|キントーン)[^"]{0,45}?(₱\s?[0-9][0-9,]*[^",]{0,22})/g)) {
    if (!m[0].includes(wantPlain) && !RIVALS.test(m[0])) errs.push(`${p}: JSON-LD price not canonical "${m[0].slice(0, 60)}"`);
  }
  // Tags between the product name and the figure used to hide violations (e.g. table cells),
  // so flatten markup to text before proximity matching.
  const stripped = noJsonLd
    .replace(/<span data-price="[a-z0-9-]+">[^<]*<\/span>/g, '§PRICE§')
    .replace(/<[^>]+>/g, ' ');
  for (const m of stripped.matchAll(/(?:Kintone|キントーン)([^.]{0,60}?)(₱\s?[0-9][0-9,]*)/g)) {
    if (RIVALS.test(m[1])) continue;               // the figure belongs to a competitor
    const rel = p.replace(/\\/g, '/').replace(/^\.\//, '');
    (DEBT.has(rel) ? warns : errs).push(`${rel}: unsourced Kintone price "${m[0].replace(/\s+/g, ' ').slice(0, 55)}"`);
  }
  // 3. no Edamame service-fee figures anywhere
  for (const m of src.matchAll(FEE)) {
    if (RIVALS.test(m[0])) continue;               // rival's fee, legitimate
    errs.push(`${p}: Edamame fee figure "${m[0].slice(0, 60)}"`);
  }
}
if (warns.length) {
  console.warn(`validate-pricing: ${warns.length} KNOWN DEBT (legacy TCO tables, see data/pricing-debt.json):`);
  warns.slice(0, 25).forEach(w => console.warn('  ! ' + w));
}
if (errs.length) { console.error(`validate-pricing FAILED (${errs.length}):`); errs.slice(0, 40).forEach(e => console.error('  ' + e)); process.exit(1); }
console.log('validate-pricing: PASS — every price sourced from data/pricing.json');
