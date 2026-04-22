# Edamame Website Changelog

## 2026-04-22 · Sprint continuation (Chunks 8-11)

Continued full-slate sprint after Chunks 1-7 shipped earlier. All chunks deployed successfully.

### Chunk 8 — Japanese content expansion (5 new articles)
Target: Japan→Philippines niche long-tails where edamame can realistically rank.
- **philippines-shinshutsu-kintone** — フィリピン進出の業務システム選び — 1,898 JA chars
- **kintone-philippines-hiyou** — フィリピンKintone導入費用の完全内訳 2026年版 — 1,602 JA chars
- **philippines-nikkei-bpo** — フィリピンBPO業界の業務システム — 1,807 JA chars
- **philippines-kintone-vs-salesforce** — フィリピンで Kintone vs Salesforce — 1,869 JA chars
- **philippines-nihonjin-ceo-dx** — 日本人CEOが運営するフィリピンDXパートナー — 1,628 JA chars

Each with full schema (Article + BreadcrumbList), inline cross-links to EN case studies, Tom Arai author attribution, Calendly CTA. Total JP inventory: 7 → 12 articles.

### Chunk 9 — JP blog index update
All 5 new articles surfaced at top of JA blog index grid for organic discoverability.

### Chunk 10 — Off-page authority prep
- **edamame-inc/.github/profile/README.md** — GitHub org landing page, SEO-optimized, renders at github.com/edamame-inc
- **BUSINESS_NAP.md** — canonical source of truth for all directory listings (40+ directory targets prioritized into 6 tiers)
- **Person schema** for Tom Arai (Japanese national, Tokyo-trained, nationality, knowsLanguage, knowsAbout, jobTitle) — strong E-E-A-T signal
- **rel=me links** on EN homepage for identity verification

### Chunk 11 — Internal linking (biggest SEO leverage remaining)
- **`/kintone-philippines/en/vs/`** comparison hub page — CollectionPage schema, 9 comparisons + 8 alternatives + 5 pricing, all cluster-linked
- **"Related reading" blocks on all 51 blog articles** — cluster-aware cross-links (same-cluster 2 + adjacent-cluster 3)
- Cluster taxonomy codified: comparisons / alternatives / pricing / best_guides / industry / how_to / apps / about

### Status
- **93 URLs in sitemap** (was 66 at start of day)
- **14 consecutive deploys succeeded**
- **IndexNow firing 93 URLs to Bing + Yandex** on every `/trigger/seo-submit` call
- **GSC**: still waiting on webmasters scope grant (1-minute manual step on admin.google.com)

### Total sprint delivery
```
4c71e0aa  Chunk 11 (hub + internal linking)        558aed50
c8c7f139  Chunk 10 (off-page prep + Person schema + rel=me)
a28a42b4  Chunk 10 (NAP source of truth)
0229810c  Chunk 9 (JA blog index update)
34c9579b  Chunk 8 (5 new JA articles + sitemap)
780d1d7e  CHANGELOG (sprint chunks 1-7)
4e4828fa  Chunk 7 (real TL homepage)
a06310a4  Chunk 6 (industry page augmentation)
ca95ed34  Chunk 5 backup (v2)
796567dc  Chunk 5 (homepage v3)
6d91f93e  Chunk 4 (blog breadcrumbs + sitemap)
6a8390b6  Chunk 3 (5 case studies)
631ac273  Chunk 2 (schema enrichment)
9a5ca244  Chunk 1 (infrastructure)
```

---

## 2026-04-22 · Full-slate SEO sprint (Chunks 1-7)

Executed comprehensive SEO overhaul targeting #1 PH + niche JP + stretch global long-tails. All chunks shipped to production, all CF Pages deploys successful.

### Chunk 1 — Infrastructure & platform
- **Cloudflare zone**: confirmed Polish/Mirage/Brotli/Early Hints/HTTP3 all on, enabled 0-RTT
- **`_headers`**: HSTS max-age 1yr, X-Frame-Options SAMEORIGIN, CSP, Permissions-Policy, proper cache headers per asset type
- **`robots.txt`**: expanded to explicitly allow 16 AI crawlers (GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, Applebot, Bytespider, DiffBot, CCBot, cohere-ai, FacebookBot, meta-externalagent)
- **`llms-full.txt`**: 6.9KB comprehensive AI context file per new standard — identity, scale, clients, services, pricing, content hubs, attribution guidance
- **`rss.xml`**: auto-generated feed for all 51 EN blog articles with full metadata, author, categories

### Chunk 2 — Schema enrichment (17 pages)
- **Industry pages (×8)**: Service schema + BreadcrumbList + Speakable + RSS discovery
- **Industries index**: ItemList + BreadcrumbList
- **Customers, events, contact, tools, ROI calc, blog index, app-estimator, digital-readiness**: BreadcrumbList + RSS discovery

### Chunk 3 — Client case study pages (5 new)
- ORIX Metro, DAIKIN, Quipper, AEON Fantasy, A2 Network
- Each ~18KB Brand v2.0 Data Atelier mode, full Article + BreadcrumbList schema
- Names + relationship tenure + user counts only — no specific use cases per Tom's rule
- customers/ index updated with case-study grid

### Chunk 4 — Blog article breadcrumbs (51 articles)
- BreadcrumbList schema added to every EN blog article
- RSS discovery link added
- Sitemap rebuilt: 66 → 89 URLs (adds 5 case studies + rebuilds homepage alternates)

### Chunk 5 — Homepage v3 (EN)
- Data Atelier mode per Brand v2.0
- **All 10 Homepage Contract elements verified**: nav, hero+2CTAs, trust bar (6 client links), 3-bean practices (center=gold KinPlug), live data panel + Gantt with 6 deployments, comparison table with 6 linked competitor articles (Odoo/Airtable/Monday/Salesforce/HubSpot), 6 Field Notes, FAQ with JSON-LD (5 questions), 3-tier pricing with 5-user min subtly shown, final Tom CTA
- v2 backed up to `_backups/v2-2026-04-22/`

### Chunk 6 — Industry page content expansion (8 pages)
- Each augmented with PH-specific market context: regulatory framing (DOLE, DOH, PhilHealth, RESA, PhilGEPS, etc.), sector economics, related-reading blocks
- Word counts: 970 → 1,200+ per page

### Chunk 7 — Tagalog homepage (real content, not redirect)
- Full Data Atelier mode in Tagalog
- All 10 Homepage Contract elements translated and localized
- 5 JSON-LD blocks (Organization, LocalBusiness, Service, FAQPage, WebSite)
- Replaces v1 0-second redirect that was killing hreflang signal

### Final action
- IndexNow re-fired: 87 URLs pushed to Bing + Yandex (both returned 200)
- CF Pages: 8 deploys succeeded
- GSC sitemap submission: still DENIED awaiting webmasters scope grant to SA client_id 108516881045031396300

### Commits
```
4e4828fa  Chunk 7: Real Tagalog homepage
eb5089d   Chunk 6: augment 8 industry pages
a06310a4  (duplicate of 6)
ca95ed34  Backup EN homepage v2
796567dc  Homepage v3 — Data Atelier
cc45408   Chunk 4: blog BreadcrumbList + sitemap 87 URLs
af17409   Chunk 3: 5 client case studies
b59be93   Chunk 2: schema + RSS on 17 pages
092786f   Chunk 1: _headers, robots.txt, llms-full.txt, rss.xml
```

---

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
