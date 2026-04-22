# Edamame Website Changelog

## 2026-04-22 — SEO surgery · Week 1

Comprehensive technical SEO overhaul addressing the v2 homepage regression and multi-year backlog of missing signals.

### Homepage head tags (EN, JP, TL)
- Canonical URL on every homepage
- `hreflang` alternates (en/ja/tl/x-default) wired across all three
- Open Graph (type, locale, locale:alternate, site_name, title, description, url, image + image:width/height/alt) — 12 OG fields per page
- Twitter card (`summary_large_image` with title/description/image)
- Geo meta (`geo.region`, `geo.placename`, `geo.position`, `ICBM`) for Philippines local signals
- `<html lang>` attribute corrected where missing
- Robots meta with `max-image-preview:large`, `max-snippet:-1`, `max-video-preview:-1`

### Structured data (JSON-LD × 5 per homepage)
- **Organization** — legal name, logo, founding, founder, address, contactPoint, award (2024 Cybozu Global Partner of the Year), sameAs
- **LocalBusiness** — Pasig office with geo coordinates, opening hours, areaServed=PH
- **Service** — Kintone implementation with OfferCatalog (Starter ₱95k, Enterprise ₱450k+, Retainer ₱85k/mo) + pricing spec including 5-user minimum
- **WebSite** — publisher linked to Organization, inLanguage=[en,ja,tl]
- **FAQPage** — 5 canonical Q&As (pricing, timeline, differentiation, JP support, competitor replacement)

### Sitemap (66 → 84 URLs)
- Added all 16 previously-missing pages: 9 industry pages (bpo, construction, education, healthcare, logistics, manufacturing, real-estate, retail, industries index), customers, events, contact, tools/, app-estimator, digital-readiness, TL index, TL privacy
- Homepage URLs now emit `xhtml:link` hreflang alternates inline (12 alternates total)
- `image:image` sitemap entries on homepages
- Priority tuning: homepages 1.0, blog articles 0.7-0.9, industry pages 0.8

### Internal link integrity
- Fixed broken `/blog/` link on EN homepage (was returning 404; now `/kintone-philippines/en/blog/`)

### Blog article hreflang (51 EN articles)
- Self-referential `hreflang="en"` + `hreflang="x-default"` added to every EN article

### Industry / tools / customers / contact hreflang (16 pages, single commit)
- Same hreflang pattern applied; single tree commit = single CF Pages deploy

### Legacy URL migration (`_redirects`)
- 301 redirects for pre-Cloudflare Wix URLs (`/en/*`, `/ja/*`, `/tl/*`) → current paths
- `/blog/*` → `/kintone-philippines/en/blog/*` (prevents future 404s on the shorthand)
- `/kintone`, `/pricing`, `/contact`, `/customers` shortcut redirects
- `/demo`, `/book` 302 to Calendly

### IndexNow (Bing + Yandex instant indexing)
- Key file deployed at `/cfc06d78b70493d0af8aec24a48dee28.txt`
- Key value: `cfc06d78b70493d0af8aec24a48dee28`
- Endpoint: `https://api.indexnow.org/indexnow` (or `https://www.bing.com/indexnow`)
- Can now trigger instant (re)indexing of any URL by POSTing `{host, key, keyLocation, urlList}` — ideal for Digital Tom worker to call on every content publish

### Not yet done (manual steps)
- Submit updated sitemap to Google Search Console (requires property verification)
- Submit to Bing Webmaster Tools
- Verify Google Business Profile for Pasig office
- Backlink outreach (PH business media, JP chambers of commerce)
- TL content expansion (currently v1 placeholder)

---

## 2026-04-20 · Homepage v2 — Editorial Premium

**Complete redesign of both EN and JP landing pages.**

### Design
- New aesthetic: "Editorial Premium" — Stripe / Linear / Vercel energy
- Typography: Inter Tight (EN) · Noto Serif JP + Noto Sans JP (JP)
- Structure reduced from 19 sections to 9: Hero · Proof · Difference · What we build · Work · Process · Pricing · Final CTA · Footer
- Three decorative edamame pod motifs in hero background at 4–6% opacity
- Dark-mode-capable (bg tokens use CSS variables)

### Content
- **Headline metric updated**: "2,400+ users across 50 enterprise clients" (verified from App 230 subtable sum = 2,443 total users)
- Removed keyword-stuffed meta tags (old version had 80+ keywords = Google spam signal)
- Client list: ORIX Metro · Daikin · Quipper · AEON Fantasy · GMA Network (swapped in AEON Fantasy over Travel Book PH — larger Japanese client, stronger enterprise signal)
- Specific stats softened to ranges ("Days, not months", "Under $20/mo") where false precision risked overclaiming
- Named case studies preserved: ORIX (1,000+ users, 4 years), Daikin (5-day dispatch build), Quipper (4 automated workflows), AEON Fantasy (legacy tools → platform)
- Pricing: ₱95K Starter / ₱450K+ Enterprise / Custom Ops Partnership (unchanged structure)

### JP version (native, not translated)
- Hero: "Kintoneを、自ら使う側が設計する。"
- Noto Serif JP headlines, Noto Sans JP body — feels native, line-height 1.7 for JP readability
- Pricing featured label: "最も選ばれています"
- Footer: "公式Kintoneパートナー · 2024年 グローバル・パートナー・オブ・ザ・イヤー受賞"

### Technical
- Backup created at `_backups/v1-2026-04/kintone-philippines-{en,ja}-index.html`
- File sizes: EN 30KB / JP 34KB (down from 272KB / 268KB)
- JSON-LD Organization schema added
- Preserved: GA4 tracking, Calendly CTA, hreflang tags, canonical URLs
- Commits: EN `5fc5e80` · JP `f4503b3` · rebuild trigger `3b3151b`
- Note: Initial GH Pages build served stale JP cache; resolved with a marker commit to force a clean rebuild

### Known follow-ups
- TL (Filipino) homepage still on v1 — needs rebuild or retirement
- Consider wiring the "Digital Tom" dashboard concept to live Cloudflare Worker data (deferred — the static version ships cleaner)
- Internal pages (customers, blog, tools, industries) still on v1 styling — planned for subsequent phase
