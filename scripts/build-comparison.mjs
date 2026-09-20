#!/usr/bin/env node
// Generates competitor comparison pages from data/competitors/<slug>.json.
// Chrome (head assets, nav, footer) is inherited from an existing page so brand stays identical.
// Usage: node scripts/build-comparison.mjs [slug]
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
const SRC = 'kintone-philippines/en/blog/kintone-vs-odoo/index.html';
const BASE = 'https://edamame-jp.com';
const ABOUT = '/kintone-philippines/en/about/';
const today = new Date().toISOString().slice(0, 10);
const P = JSON.parse(readFileSync('data/pricing.json', 'utf8'));
const PRICE = `<span data-price="kintone-from">${P.kintone_from.display_en}</span>`;
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const jtxt = s => s.replace(/"/g, '\\"');

const src = readFileSync(SRC, 'utf8');
const pick = (re, d = '') => (src.match(re) || [, d])[1];
const cssLinks = [...src.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/g)].map(m => m[0]).join('\n');
const fontLinks = [...src.matchAll(/<link[^>]+fonts\.(?:googleapis|gstatic)[^>]*>/g)].map(m => m[0]).join('\n');
const nav = pick(/(<nav[\s\S]*?<\/nav>)/);
const footer = pick(/(<footer[\s\S]*?<\/footer>)/);
const inlineCss = [...src.matchAll(/<style>[\s\S]*?<\/style>/g)].map(m => m[0]).join('\n');

function page({ title, desc, path, h1, bluf, body, faq, d }) {
  const url = BASE + path;
  const ld = [
    { "@context": "https://schema.org", "@type": "Article", headline: title, description: desc,
      author: { "@type": "Person", name: "Tom Arai", jobTitle: "Founder & CEO", url: BASE + ABOUT },
      publisher: { "@type": "Organization", name: "Edamame Inc.", url: BASE + "/kintone-philippines/en/" },
      datePublished: today, dateModified: today, inLanguage: "en", mainEntityOfPage: url },
    { "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE + "/kintone-philippines/en/" },
      { "@type": "ListItem", position: 2, name: "Field Notes", item: BASE + "/kintone-philippines/en/blog/" },
      { "@type": "ListItem", position: 3, name: h1, item: url } ] }
  ];
  const faqHtml = faq.map(([q, a]) =>
    `<details class="faq-item"><summary>${esc(q)}</summary><p>${a}</p></details>`).join('\n');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="author" content="Edamame Inc.">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="article">
${fontLinks}
${cssLinks}
${ld.map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}
${inlineCss}
</head>
<body>
${nav}
<article class="post">
<header class="post-header">
<h1>${esc(h1)}</h1>
<p class="post-meta">By <a href="${ABOUT}">Tom Arai, Founder &amp; CEO, Edamame Inc.</a> · Updated ${today}</p>
</header>
<p class="lead"><strong>Short answer:</strong> ${bluf}</p>
${body}
<h2>Frequently asked questions about ${esc(d.short)} and Kintone</h2>
${faqHtml}
<section class="cta">
<h2>Work out which fits your operation</h2>
<p>Bring your messiest workflow to a 30-minute consultation. We will map how it would run on Kintone, what the scope looks like, and a fixed quote — no obligation. Kintone licensing starts ${PRICE}; implementation is scoped per engagement.</p>
<p><a class="btn" href="/kintone-philippines/en/contact/">Book a free consultation →</a></p>
</section>
</article>
${footer}
</body>
</html>`;
}

function build(slug) {
  const d = JSON.parse(readFileSync(`data/competitors/${slug}.json`, 'utf8'));
  const factRows = d.facts.map(([k, v]) => `<tr><td><strong>${esc(k)}</strong></td><td>${v}</td></tr>`).join('\n');
  const ul = a => `<ul>${a.map(x => `<li>${x}</li>`).join('')}</ul>`;

  // 1. kintone-vs-<slug> — research/comparison intent
  const vsBody = `
<h2>How ${esc(d.name)} and Kintone differ</h2>
<p>${esc(d.name)} is a ${esc(d.category)}. Kintone is a no-code business application platform by Cybozu, implemented in the Philippines by Edamame Inc. The table below sets out the differences that actually change a buying decision.</p>
<table class="cmp"><tbody>${factRows}</tbody></table>
<h2>When ${esc(d.name)} is the better choice</h2>
<p>${esc(d.name)} is the stronger option in these situations, and we will tell you so directly rather than talk you out of it.</p>
${ul(d.choose_them)}
<h2>When Kintone is the better choice</h2>
<p>Kintone tends to win where app ownership sits with the business team rather than with IT.</p>
${ul(d.choose_kintone)}
<h2>Running ${esc(d.short)} and Kintone together</h2>
<p>${d.together}</p>
<h2>The verdict on ${esc(d.name)} versus Kintone</h2>
<p>${d.verdict_vs}</p>`;

  // 2. <slug>-alternative-philippines — switching intent
  const altBody = `
<h2>Why Philippine teams look for a ${esc(d.name)} alternative</h2>
<p>The reasons teams in the Philippines start evaluating alternatives to ${esc(d.name)} are consistent, and they are rarely about features.</p>
${ul(d.choose_kintone)}
<h2>What ${esc(d.name)} actually costs and requires</h2>
<table class="cmp"><tbody>${factRows}</tbody></table>
<h2>Where ${esc(d.name)} remains the right answer</h2>
<p>An honest alternative page has to say where the incumbent wins. Stay with ${esc(d.name)} if any of these hold.</p>
${ul(d.choose_them)}
<h2>Moving the app layer to Kintone without leaving your existing stack</h2>
<p>${d.together}</p>
<h2>What switching looks like in practice</h2>
<p>Edamame Inc. is the official Kintone partner in the Philippines, based in Pasig City, and recipient of the 2024 Cybozu Global Award — Asia. A typical move starts with one operational process — approvals, inventory, or a customer database — mapped and rebuilt on Kintone, with your team trained to maintain it. Kintone licensing starts ${PRICE}; implementation is scoped per engagement and quoted after a free consultation.</p>`;

  const out = [
    { path: `/kintone-philippines/en/blog/kintone-vs-${d.slug}/`,
      title: `Kintone vs ${d.short}: Which Fits a Philippine Team?`,
      desc: `A practical comparison of Kintone and ${d.name} for Philippine businesses — licensing, who maintains the apps, and when each is the right call.`,
      h1: `Kintone vs ${d.name}: which fits a Philippine team?`, bluf: d.bluf_vs, body: vsBody },
    { path: `/kintone-philippines/en/blog/${d.slug}-alternative-philippines/`,
      title: `${d.short} Alternative Philippines: What Teams Switch To`,
      desc: `Looking for a ${d.name} alternative in the Philippines? What drives the switch, what ${d.short} really costs, and where it still wins.`,
      h1: `${d.name} alternative in the Philippines`, bluf: d.bluf_alt, body: altBody },
  ];
  for (const o of out) {
    const dir = '.' + o.path;
    mkdirSync(dir, { recursive: true });
    writeFileSync(dir + 'index.html', page({ ...o, faq: d.faq, d }));
    console.log('built', o.path);
  }
  return out.map(o => o.path);
}

const args = process.argv.slice(2);
const slugs = args.length ? args : readdirSync('data/competitors').filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));
const paths = slugs.flatMap(build);
console.log(`\n${paths.length} pages generated from ${slugs.length} competitor file(s)`);
