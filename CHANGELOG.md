# Edamame Website Changelog

## [homepage-redesign — site-wide consent + price consistency] — 2026-06-21

Closed the one-click gap: pages linked from the homepage still named uncleared clients. Applied the consent gate site-wide (42 files, EN + JA).

### Consent gate — every user-facing surface
- **Only Maximum Solutions Corporation (= MSCorp) and Guhring stay named.** All others genericized to fixed canonical descriptors, EN + JA, across customers, `/vs/`, all blogs, all industries, contact, meta/OG, and JSON-LD:
  - ORIX Metro → "a major vehicle-leasing & finance firm" / 大手リース・ファイナンス企業
  - Daikin (incl. HVAC wording standardized to **air-conditioning**) → "a global air-conditioning manufacturer" / 大手空調メーカー
  - Quipper → "a leading EdTech platform" / 大手EdTechプラットフォーム
  - GMA Network → "a national broadcast network" / 大手放送局
  - AEON Fantasy → "a major commercial-facility operator" / 大手商業施設運営企業
- **Two more uncleared clients found and genericized** (not in the original five): **A2 Network** → "a logistics and freight operator" / 大手物流企業 (customers, `/vs/`, JA logistics meta); **Travelbook Philippines** → "an online travel agency" / 大手オンライン旅行会社 (16 industry proof-grids + 3 blogs). *(Descriptors are my choice — adjust if either is actually cleared.)*
- De-identification: dropped the masked client from the manufacturing/retail market-context investor lists; removed office districts + parent-company tags next to descriptors in the JA founder blog.

### Engagement prices — non-blog pages
- `brand-guidelines.html` price-card reference → scope cues + qualitative framing (no ₱ figures). Homepages already done. **Confirmed zero engagement-tier prices on any non-blog page.** `/vs/` keeps its multi-platform 3-year **TCO comparison** figures (analysis, not an engagement quote) — flagged for your decision.

### Testimonial
- Removed the placeholder testimonial block from the EN homepage (JA never had one).

### SEO preserved
- No URLs changed; **302 JSON-LD blocks all valid**; no internal links broken by the edits; ranking comparison/blog pages intact (blog pricing left untouched).

## [homepage-redesign — pricing pass] — 2026-06-21

Decision: do **not** publish specific prices. Removed every specific peso figure **and** all `[TBC]` placeholders / pending-confirmation flags from EN + JA so the pricing section reads finished, scope-based, with the number driven to the consultation.

- **Pricing section:** kept "priced by scope, not by the hour" + the Starter/Enterprise/Retainer names and what each includes; replaced each tier price with a scope cue (new `.tier-scope`: "a single high-value app" / "a connected multi-app operation" / "ongoing build & support" — JA: 単一の高価値アプリ / 連携した複数アプリ運用 / 継続的なビルドとサポート). Platform line → "Per-user subscription — no six-figure upfront, no lock-in". Section CTA → "Book a free consultation for a fixed quote" (JA: 無料相談で確定見積りを).
- **Elsewhere:** comparison-table Kintone cell now "Per-user subscription" / "月額サブスク" (competitors keep their public list prices); "safe middle path" bullet → "Per-user subscription — no six-figure license or lock-in"; FAQ pricing answers reworded to model + qualitative contrast and routed to the free consultation (removed the homepage→pricing-blog links to keep the no-figure story consistent).
- **JSON-LD:** price fields remain stripped (no priced Offers); FAQ cost answers updated to match.
- **Verified:** zero specific peso figures and zero `[TBC]` markers user-facing on EN or JA. (The testimonial quote remains a clearly-flagged placeholder — separate from pricing.)

## [homepage-redesign — accuracy & consent pass] — 2026-06-21

Accuracy + permission revision on the EN homepage (`/kintone-philippines/en/`). Branch unchanged; preview auto-redeploys.

### Pricing — provenance gate
- **All peso price figures replaced with clearly-marked `[TBC]` placeholders** pending Tom's confirmation: Kintone base license (was ₱1,000/user/mo + 5-user min — conflicts with the old ₱1,500/3,000/5,000 tiers), and implementation tiers (was ₱95k / ₱450k+ / ₱85k-mo, carried over from the pre-redesign page, never independently confirmed).
- Removed all price values from JSON-LD (Service `hasOfferCatalog`/`offers`, Product `AggregateOffer`) and from the FAQ/meta so no unsourced number is published as a real price. Added a visible "figures pending confirmation" flag to the pricing section. (`priceRange:"₱₱"` generic indicator retained.)

### Client names — consent gate
- Kept named (written/published consent): **MSCorp, Guhring**.
- Genericized everywhere else (trust wall, FAQ, meta/OG, body): **ORIX Metro → "a major vehicle-leasing & finance firm"**, **Daikin → "a global HVAC manufacturer"** (incl. the "quoted at 3 months, shipped in days" claim → "a Japanese manufacturer"), **Quipper → "a leading EdTech platform"**, **AEON Fantasy / GMA Network** removed/anonymized.

### Security claims — verified vs Kintone Trust Center
- Corrected to match the official source ([trust-center.kintone.com](https://trust-center.kintone.com/)): **SOC 2 Type II** ✓, **ISO/IEC 27001 (cert IS 577142)** ✓, added **HIPAA** ✓. **Removed the unsubstantiated "99.99% uptime SLA"** (Kintone publishes a Service Level *Objective* with daily status, not a 99.99% SLA) and the unverified **AES-256** specific → "encrypted in transit and at rest."

### Copy + headline numbers
- Hero H1 tail changed from "run your business on custom software" → "**digitize how your business runs**" (plain-outcome; kept "official Kintone partner" + "safe way").
- SEC registration number removed from the hero credential line + founder facts; **now visible in the footer only** (retained in Organization JSON-LD as accurate public-record metadata).
- User count reconciled to a single figure (**2,400+**; hero card was 2,443).

### JA homepage — same consent + pricing scrub applied
- Genericized the same five clients in Japanese across meta/OG/Twitter, hero, trust row, named-client list, FAQ (visible + JSON-LD), and footer (大手リース・ファイナンス企業 / 大手空調メーカー / 大手EdTechプラットフォーム / 大手放送局 / 大手商業施設運営企業). Kept **Maximum Solutions Corporation = MSCorp** (cleared) and Guhring.
- All ₱ figures → `[TBC]` (tiers + comparison cell); stripped prices from the JA Service/Offer JSON-LD; added a Japanese "pending confirmation" pricing note. User count 2,443 → 2,400+.
- (JA remains on the old visual system — full JA redesign is still the next workstream.)

## [homepage-redesign] — 2026-06-21

**EN homepage rebuilt for conversion + enterprise authority. Branch `homepage-redesign` → Cloudflare Pages preview. See `docs/adr/0001-homepage-positioning-and-brand-direction.md`.**

### Added — new conversion architecture (`/kintone-philippines/en/`)
- **Hero** rebuilt around ONE dominant value prop ("the official Kintone partner — the safe way to run your business on custom software"), Partner-of-the-Year badge, and a static **authority credential card** (50 clients · 2,443 users · #1 SE Asia · SEC CS20190000095) that replaces the old fake pulsing "● LIVE" panel.
- **Problem / loss-aversion section** ("too little" paper+Excel vs "too much" SAP/Oracle/NetSuite), surfacing the **50–75% PH ERP failure rate**, funnelling into "the safe middle path."
- **Why-a-partner section** — disintermediation defense vs Cybozu's direct Manila presence ("Cybozu builds Kintone; we make it work in your business").
- **Proof section** — MSCorp + Guhring case files with concrete metrics, plus a flagged testimonial placeholder.
- **"Kintone vs the alternatives" decision table** — now covers the real competitors (SAP/Oracle/NetSuite, Odoo/ERPNext, monday/Airtable, Salesforce/Power Apps, Zoho, Excel) and links out to `/vs/` + comparison blogs, elevating the #1/#2 ranking articles.
- **Risk-reversal block** — 6 guarantees (free consultation, 30-day trial, start-small, migration handled, same-day local support, honest-fit promise).
- **Founder/human-trust section** (Tom Arai) with flagged photo placeholder.
- Transparent PHP pricing kept and clarified (platform line + 3 engagement tiers + "most chosen" flag).

### Changed — brand direction: evolve "Data Atelier" → enterprise authority
- DM Serif Display demoted from *every* heading to a controlled accent; **DM Sans now carries headings** for corporate clarity. Palette, bean logo, and font set retained (only DM Serif Display / DM Sans / JetBrains Mono on EN; no Inter).
- Retired boutique tells: blob border-radii, pod-ornament dividers, "studio/atelier/field notes/three beans" voice → disciplined radius scale + confident enterprise voice.
- **Primary CTA unified to "Book a free consultation"** (was inconsistent "Book demo"/"Book 30-min demo"); semantic colour system (sage = safe path/CTA, red = danger/failure-rate only).
- Meta title/description + OG/Twitter copy re-led on "official partner / safe / days not months."

### Fixed — factual consistency
- **Founding date corrected 2020 → 2019-09-16 (SEC CS20190000095)** in EN + JA homepage JSON-LD and `BUSINESS_NAP.md`.
- Removed retired Tagalog (`tl`) from JA homepage WebSite JSON-LD `inLanguage`.
- `contactPoint.availableLanguage` on EN now reflects trilingual support (English/Filipino/Japanese) in visible copy without re-adding TL content.

### SEO equity preserved
- Homepage URL unchanged (`/kintone-philippines/en/`) — no redirect needed; **no blog/comparison/customer URLs moved or orphaned.**
- All 6 JSON-LD blocks retained (Organization, LocalBusiness, Service, WebSite, FAQPage, Product) and validated; GA4, canonical, hreflang, RSS intact.
- 30 internal links validated (all resolve); cross-links now actively elevate ranking comparison content.
- Previous homepage snapshot saved to `_backups/v3-2026-06-21/`.

### Open follow-ups (flagged in markup)
- Client logos shown as text wordmarks — logo usage permission UNCONFIRMED.
- Testimonial quote + founder photo are placeholders pending approval.
- JA homepage + secondary pages still on old system — next workstream.

## [vs-hub-deepening] — 2026-05-07

### Added — /vs/ hub depth pass
**Goal: deepest comparison destination in the PH category. Was 29KB / 4 H2 sections, now 63KB / 10 H2 sections.**

- **Master matrix** (new): 10 platforms (Kintone + 9 competitors) × 8 evaluation dimensions in one scrollable table. Time-to-first-app, dev requirements, record limits, starting price, PH local support, JP business-grade, real fit per platform. Color-coded badges.
- **3-year TCO summary** (new): Year-by-year + 3-year total in PHP for a 25-user mid-market profile. Kintone+edamame ~₱995K vs Odoo ₱2.4–3.8M vs Salesforce ₱3.4–4.8M vs HubSpot ₱1.75–2.65M vs Airtable ₱580–910K vs ERPNext ₱2.1–3.6M. Links to ROI calculator.
- **Decision matrix** (new): 8 "If you need X, choose Y" cards. Routes prospects to HubSpot for inbound marketing, Salesforce for enterprise teams already on it, Airtable for under-50K-row use cases, Monday for project-led work, ERPNext for open-source DevOps shops, Notion for knowledge bases, Kintone for the rest. We'd rather lose the deal than mis-recommend.
- **Migration playbook** (new): 8 source-platform cards (Excel, Odoo, Airtable, Salesforce, Monday, HubSpot, Zoho, SAP) with typical migration windows + hardest-step + first-week deliverable.
- **By-industry recommendations** (new): 9 industry cards (manufacturing, healthcare, real estate, BPO, construction, logistics, education, retail, marketing-led B2B) with top-pick + named PH client where relevant (Daikin, A2 Network, AEON Fantasy, Quipper).
- **Comparison FAQ** (new): 7 questions actually asked in evaluation calls (cheaper than Odoo? Airtable cap? Salesforce replacement? HubSpot free tier? Why JP popular? Open source? Trial?) — wired with FAQPage JSON-LD for rich results.

### Schema enhancements
- Added FAQPage JSON-LD with all 7 Q/A pairs (rich-result eligible).
- BreadcrumbList + CollectionPage + ItemList retained.

### Cross-linking
- Internal blog links: 22 → 44 occurrences (23 unique articles)
- Internal industry links: 0 → 8
- ROI calculator linked from TCO section
- Customer pages (MSCorp, Guhring) implicitly referenced via named PH deployments

### Accessibility & local SEO on /vs/
- Skip-to-content link
- Landmark roles (banner/navigation/main/contentinfo)
- Footer NAP block: address, tel, email

## [Unreleased] — 2026-05-07

### Added (Local SEO depth)
- **EN homepage footer NAP block:** physical address (15F Jollibee Tower, Ortigas Center, Pasig City 1605), tel:+63 928 872 7958, mailto:kintone@edamame-jp.com — clickable on mobile.
- **JA homepage footer NAP block:** Japanese-localized address with same phone/email.
- **Footer columns expanded:** added MSCorp + Guhring case-file links, "vs Comparisons" hub link, "For Japanese cos." article link.

### Added (Accessibility coherency)
- **Skip-to-content link** (EN: "Skip to main content"; JA: "メインコンテンツへスキップ") — first focusable element, off-screen until focused, jumps to #main-content.
- **Landmark roles** added to EN + JA homepages: role="banner" on <header>, role="navigation" + aria-label="Primary" on nav links, role="main" on <main id="main-content">, role="contentinfo" on <footer>.
- Wrap hero through pricing in `<main id="main-content">` so screen readers can jump past the chrome.

### Updated (LLM optimization)
- **llms.txt** rewritten and deepened from 47 → 124 lines: full NAP, founder bio, scale metrics, all 9 comparison articles, all 7 best-of guides, all 8 industry pages, JA versions of every section, comparison link cluster, and best-of guide cluster.

## [Unreleased — earlier] — 2026-05-07

### Removed
- **Tagalog locale (/tl/) retired entirely.** Stub homepage + privacy policy + contact deleted. ICP analysis: B2B software buyers in PH research in English; TL added maintenance burden without lifting enterprise pipeline. Inbound /tl/* traffic 301-redirected to /en/ via _redirects.

### Fixed
- **Homepage trust bar:** ORIX Metro, DAIKIN, Quipper, AEON Fantasy were plain text while GMA Network and Maximum Solutions were links — visual inconsistency since all 6 had hover/arrow affordances. All 6 logos now uniformly link to /customers/.
- **Homepage Named Deployments:** Same inconsistency — rows 01–04 were unwrapped spans while 05–06 were `<a>` elements. All 6 rows now uniformly clickable, all targeting /customers/ index.
- Removed TL from hreflang and og:locale:alternate across EN home, JA home, JA blog articles (×5), customers index, privacy policies. Cleaned root sitemap.xml, kintone-philippines/sitemap.xml, ja/sitemap.xml.

### Updated  
- llms.txt + llms-full.txt: Filipino language reference removed; canonical "English and Japanese" propagated.

## 2026-04-30 · Live panel · Remove MRR row across all locales

Strategic visibility scrub: dropped `Monthly recurring · ₱1.87M/mo` from public live-panel on all three homepage locales (EN, TL, JA) plus brand-guidelines reference doc. Replaced with `Industries served · 5 sectors` to preserve the 4-row layout and signal breadth without leaking economics.

### Why
Public MRR disclosure was leaking too much downside intel: (1) ORIX concentration (32.5%) becomes inferrable from public data — 50 clients × ₱1.87M = ₱37K avg, ORIX at ₱608K is 16× avg, signaling whale; (2) enterprise procurement (GMA, Coca-Cola, Watsons, Ayala Land) flagging business-continuity risk on small MRR; (3) pricing leverage lost in negotiations; (4) acquisition-lowball anchor; (5) talent-poaching coordinates.

The remaining metrics (50 enterprise clients · 2,443 users · Global Partner of the Year) already deliver the trust/credibility signal that specific-numbers buy. MRR was the only row leaking economics.

### Files changed
- `kintone-philippines/en/index.html` — line 621
- `kintone-philippines/tl/index.html` — line 216
- `kintone-philippines/ja/index.html` — line 311
- `brand-guidelines.html` — lines 423, 478, 628 (demo block + voice rules + type sample)

Backup at `_backups/v2-2026-04-22/` retains original MRR row for reference.

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
