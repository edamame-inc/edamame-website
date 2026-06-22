# edamame-jp.com — UI/UX Audit (live production)

**Date:** 2026-06-22 · **Branch:** `ui-ux-audit` · **Scope:** READ-ONLY audit of the live site. No site/source files changed, nothing deployed. Only `audit/` was written.

**Tooling:** Playwright 1.49 (Chromium 149 headless) · `@axe-core/playwright` 4.10 (WCAG 2.0/2.1 A & AA tags) · Lighthouse 12 (programmatic, mobile + desktop presets) · Node 22. All numbers below are measured, not estimated.

**Environment caveat (stated explicitly):** outbound traffic in this runner passes through a TLS-intercepting proxy, so Chromium reported `ERR_CERT_AUTHORITY_INVALID` and was launched with `ignoreHTTPSErrors` / `--ignore-certificate-errors`. `curl` and real browsers reach the valid production certificate normally (HTTP 200). **Consequence:** Lighthouse's TLS/"uses-HTTPS" best-practice signal is meaningless here and is excluded; performance, CWV, a11y, and SEO metrics are unaffected and valid. Lighthouse mobile uses the standard 4× CPU + slow-4G throttle; desktop is unthrottled.

**Pages tested (exact URLs):**
| id | URL |
|---|---|
| en-home | https://edamame-jp.com/kintone-philippines/en/ |
| ja-home | https://edamame-jp.com/kintone-philippines/ja/ |
| vs | https://edamame-jp.com/kintone-philippines/en/vs/ |
| case-mscorp | https://edamame-jp.com/kintone-philippines/en/customers/ms-corp/ |
| blog-crm | https://edamame-jp.com/kintone-philippines/en/blog/best-crm-software-philippines-2026/ |
| contact | https://edamame-jp.com/kintone-philippines/en/contact/ |
| 404 | https://edamame-jp.com/&lt;random&gt;/ → serves `404.html` (HTTP 404, correct) |

**Viewports (full-page + above-fold screenshot at each):** Desktop 1440×900 · Laptop 1280×800 · Tablet 768×1024 · Mobile-iOS 390×844 · Mobile-Android 360×800. (`deviceScaleFactor=1` for measurement consistency — layout, overflow and tap-target sizes are CSS-pixel based and unaffected by DPR.)

---

## Executive summary — top 5 issues hurting conversion / credibility

1. **🔴 The contact form's "Send Message →" button is invisible** (white text on a transparent → white card = **1:1 contrast**). The primary action on the lead-capture form can't be seen. Evidence: `screens/verify__contact__buttonsubmitbtn.png` (renders blank white); computed `color:#fff; background:rgba(0,0,0,0)` on `button.submit-btn`. This is the single most damaging conversion bug found.
2. **🔴 The homepage fails Core Web Vitals.** Measured **CLS 0.33 mobile / 0.27 desktop** (budget 0.10) and **mobile LCP 4.85 s** (budget 2.5 s). Root cause is proven (not guessed): the async, non-render-blocking web-font load lets the large hero `<h1>` paint in a fallback font, then reflow when DM Sans/DM Serif swap in — shifting `.hero-sub`, the CTA row and the credential card up by 34–68 px. The blog page, with smaller headings, is clean (CLS 0.003–0.016, LCP 0.47–1.74 s), so this is hero-specific.
3. **🟠 Brand sage and gold fail WCAG AA as text, site-wide.** Gold `#C4A35A` on white/cream measures **2.3–2.4:1**; sage `#4A7C59` on cream `#F0EDE8` measures **4.16:1** (both below the 4.5:1 body minimum). axe flags color-contrast as *serious* on every page — **54 nodes on `/vs/`**, 29 on the blog, 26 on the homepage. These are the eyebrows, kickers, case-file numbers, table badges and "→" links — exactly the credibility microcopy.
4. **🟠 A credibility regression on the contact page.** The award sidebar reads "Recognized by Cybozu as **the best Kintone partner worldwide**," re-introducing the worldwide overstatement that was deliberately corrected to "2024 Cybozu Global Award — Asia" everywhere else. (`screens/contact__desktop__fold.png`.)
5. **🟠 The mobile hero headline is clipped under the sticky nav** on the homepage and `/vs/` — the first line of the `<h1>` sits behind the nav at the top of the page, weakening the first impression on the most common device class. (`screens/en-home__mobile-ios__fold.png`, `screens/vs__mobile-ios__fold.png`.)

The good news up front: **zero horizontal overflow at any of the 35 page×viewport combinations**, all four brand fonts render (no Inter, no system fallback on content pages), the shipped interaction polish works exactly as designed (hover, press, focus ring, scroll-reveal with nothing stuck hidden, reduced-motion honored), JSON-LD is rich and valid on every page, and the blog template is a performance A+.

---

## Findings by severity

### 🔴 Critical

**C1 — Invisible contact submit button.** `contact` · all viewports · `screens/verify__contact__buttonsubmitbtn.png`, `screens/contact__mobile-ios__full.png`.
`button.submit-btn` ("Send Message →") computes to `color: rgb(255,255,255)` over `background-color: rgba(0,0,0,0)`, which resolves to the white `.form-card` — a **1:1** ratio. The button's fill is simply not being applied at rest. Users see a blank area where the submit control should be. **Why it matters:** this is the conversion endpoint of the only on-site lead form. **Fix:** restore the button's background (sage fill with white text, matching the homepage `.btn-primary`); verify ≥4.5:1.

**C2 — Homepage Core Web Vitals failure (CLS + mobile LCP).** `en-home` · mobile & desktop · Lighthouse `data/lh__en-home__*.json`, measured shift trace `scripts/capture-cls.mjs`.
- CLS **0.330** (mobile) / **0.270** (desktop) — both well over 0.10.
- LCP **4849 ms** (mobile) / 516 ms (desktop); FCP **3512 ms** (mobile). LCP element = hero `<h1>` (text).
- Directly observed shift sources (CPU-throttled): `+0.19–0.22` as `<h1>` "safe way", `<p.hero-sub>`, `<div.hero-actions>` and `<aside.cred>` jump upward when fonts swap (~285 ms desktop, ~1.6 s mobile).
**Why it matters:** CLS and LCP are Google ranking signals and the visible "jump" on load reads as unpolished on the flagship page. **Fix options (any one helps, combine for best result):** (a) `<link rel="preload">` the 1–2 fonts used in the hero so they're ready before first paint; (b) add `size-adjust`/`ascent-override` fallback `@font-face` metrics (or `font-size-adjust`) so the fallback occupies the same space as DM Sans/DM Serif — eliminates the reflow; (c) reserve a min-height on the hero text block. Note the no-render-blocking-resources result is otherwise good; this is purely the font-swap trade-off.

### 🟠 High

**H1 — Brand colors fail AA as text (site-wide).** All pages · `data/contrast-refined.json`, axe `data/axe__*.json`. Confirmed solid-background failures (scanner-verified, gradient false-positives excluded):

| Pair | Measured | Needs | Where (examples) |
|---|---|---|---|
| Gold `#C4A35A` on white/off-white | **2.3–2.4:1** | 4.5 | eyebrows, "Case File № 01", client numbers "01", "Sole Asia-region recipient · 2024", "Master matrix · TCO…" kicker |
| Gold-deep `#A8863F` on white | **3.42:1** | 4.5 | credential "active" stat label |
| Sage `#4A7C59` on cream `#F0EDE8` | **4.16:1** | 4.5 | "Why a partner…" eyebrow, "All notes →", "✓ Yes", "Best ERP… →" links |
| Sage `#4A7C59` on mint `#E7EEE9 / #E8F5E9` | **4.13–4.46:1** | 4.5 | `/vs/` table "Days"/"Kintone + edamame"/"₱395,000", blog recommended-card links |
| Gold-mid `#8A6D2E` on cream | **4.23:1** | 4.5 | `/vs/` "Months" badge |
| Footer fine-print gray on near-black | **2.71–3.44:1** | 4.5 | "© 2026 Edamame Inc…", footer section titles "Solutions" |
| Danger red `#ED1C24` on forest `#0A1E15` | **3.96:1** | 4.5 | `/vs/` "12–18 months" cell |

axe corroborates: color-contrast *serious* on every page (vs **54**, blog **29**, en-home **26/16**, mscorp **11**, ja **10**, contact **6**, 404 **3**). **Why it matters:** legibility for low-vision and outdoor-mobile users, plus a formal WCAG 2.1 AA failure. **Fix:** darken the "text" shades of the palette — use gold only ≥ `#7A5F1E`-ish for small text (or reserve gold for large/decorative), and bump sage to `#3A6349` (the existing `--sage-deep`) for text on cream/mint. Keep the bright gold/sage for fills and large display only.

**H2 — Credibility regression: "best Kintone partner worldwide."** `contact` · `screens/contact__desktop__fold.png`. The award sidebar overstates the Asia award as worldwide, contradicting the corrected wording used everywhere else. **Fix:** align to "2024 Cybozu Global Award — Asia / sole Asia-region recipient."

**H3 — Mobile hero headline clipped by the sticky nav.** `en-home`, `vs` · mobile-ios/android · `screens/en-home__mobile-ios__fold.png`, `screens/vs__mobile-ios__fold.png`. At scroll-top the first `<h1>` line tucks under the translucent sticky header (insufficient hero `padding-top` on small screens). **Why it matters:** the headline is the value prop and the LCP element. **Fix:** add hero `padding-top` ≥ nav height (≈64–80 px) at ≤480 px, or offset the hero for the fixed nav.

**H4 — Broken chatbot widget on blog pages.** `blog-crm` · all viewports · console capture in `data/audit-results.json`. `https://camille-chatbot.tom-arai.workers.dev/widget.js` fails with **`ERR_BLOCKED_BY_ORB`** (Opaque Response Blocking — wrong/again missing `Content-Type` for a cross-origin script). The chat widget never initializes. Also note the dependency is a personal `*.workers.dev` subdomain (branding/ownership risk). **Fix:** serve the widget JS with `Content-Type: text/javascript` (and ideally from a branded domain), or remove it.

### 🟡 Medium

**M1 — Horizontally-scrollable comparison tables aren't keyboard-accessible.** `en-home` (`.cmp-wrap`), `vs` (`#matrix .matrix-wrap`), `blog-crm` · mobile · axe `scrollable-region-focusable` (*serious*). The tables correctly use an internal scroll container (which is *why* there's no page overflow — good), but the container has no `tabindex=0`, so keyboard users can't scroll it. **Fix:** add `tabindex="0"` + an `aria-label` to each scroll wrapper.

**M2 — Heading-order skips (h2 → h4).** `vs` ("Excel / Google Sheets", "Manufacturing"), `blog-crm` ("Solutions"), `contact` ("Solutions") jump from `<h2>` to `<h4>` with no `<h3>`. **Why it matters:** screen-reader navigation + SEO outline. **Fix:** demote to the correct level or insert the missing level.

**M3 — `<li>` not wrapped in a list.** `ja-home` (5), `vs` (4) · axe `listitem` (*serious*). Standalone `<li>` elements outside any `<ul>/<ol>`. **Fix:** wrap in a list container (or change the element).

**M4 — Skip-link inconsistent across templates.** Present on `en-home`, `ja-home`, `vs`; **missing** on `case-mscorp`, `blog-crm`, `contact`, `404`. **Fix:** add the same skip-link to the inner-page/blog templates.

**M5 — Long line lengths on text-heavy pages.** Measured chars-per-line: `case-mscorp` body 78–88, `blog-crm` body 80–92, `vs`/`en-home` section intros 89–96, contact CTA banner **160**. Optimum is 45–75. **Why it matters:** reading speed/comprehension on the case study and long blog. **Fix:** cap prose measure at ~68–72ch (`max-width: 38rem`) on `.chapter-body`, `.article-wrap p`, and the contact CTA copy.

### 🔵 Low

**L1 — `/brand-guidelines.html` returns 308.** Footer link incurs a redirect hop (Cloudflare normalizes `.html`). Link directly to `/brand-guidelines` (1 of 58 internal links; the other 57 are clean 200s).

**L2 — Inconsistent primary-CTA label.** "Book a free consultation" / "Book free consultation" / "Book 30-min demo →" / "Free Demo" / "Talk to us →" all appear for the same intent across nav and pages. The destination is consistent (Calendly, reachable 200) but the wording isn't. **Fix:** standardize one verb+offer (e.g., "Book a free consultation") for the primary, and keep secondaries visually distinct.

**L3 — 404 page is off-brand and thin.** Uses **Fraunces** (a non-brand serif) for its `<h1>` instead of DM Serif Display; no meta description, no canonical, no skip-link, no JSON-LD; its own contrast failure (`.code`, 3 nodes). It *does* return a real HTTP 404 with a "Page Not Found" title (correct). **Fix:** reskin to the current design system + add a couple of helpful links (it already links Blog/Contact).

**L4 — Heading-font divergence between homepage and inner pages.** The redesigned homepage leads headings with **DM Sans** (serif demoted to accent); `/vs/`, case, blog, contact lead with **DM Serif Display**. Both are on-brand, but the hierarchy reads differently page-to-page. Worth a deliberate decision (not necessarily a bug).

### ⚪ Polish

- **P1 — Anchor scroll-margin only covers `section[id]`.** Section nav links (#why/#proof/#pricing…) get the intended 88 px offset; other in-page anchors (e.g. the skip-link target `#main-content`) land flush at the nav edge (measured top 73 px = nav height). Harmless; widen the `scroll-margin` selector if desired.
- **P2 — GA `…/g/collect` shows `ERR_ABORTED`** on every page. This is a **headless-audit artifact** (the analytics beacon is aborted when the context closes), not a site defect — flagged for completeness, no action needed.
- **P3 — Gold display accent on the light hero** ("safe way") is ~2.4:1; as 30–64 px display text it's decorative emphasis but still under the 3:1 large-text line. Consider a slightly deeper gold for the accent.

---

## Audit dimensions — measured results

1. **First impression & hierarchy.** Desktop: strong — H1 value prop + single sage primary CTA + credential card (award, 50 clients, 2,400 users) all above the fold (`en-home__desktop__fold.png`). Mobile: value prop and primary CTA still clear, but the H1 top line is clipped (H3) and the gold accent is low-contrast.
2. **Typography.** All four brand fonts render and load (`document.fonts`): DM Sans, DM Serif Display, Noto Sans JP, JetBrains Mono. **No Inter, no system-font fallback rendering on any content page.** Only the **404** uses **Fraunces** (off-brand, L3). Type scale is coherent (en-home h1 64 / h2 46 / h3 20 / body 19 px, lh 1.04–1.6). Line-length flags in M5. Fonts use `display=swap` (FOUT) via a `media="print"` async `<link>` — good for FCP, but the direct cause of C2's CLS.
3. **Spacing / rhythm / alignment.** No overflow or broken grids anywhere; section padding is consistent within each template. Main rhythm issue is long measure (M5) and the mobile hero top-padding (H3).
4. **Color & contrast.** Full confirmed table in H1 / Appendix. Headline: gold 2.3–2.4:1 and sage-on-cream 4.16:1 fail AA; footer fine-print 2.7–3.4:1 fails.
5. **Responsive integrity.** **Zero horizontal scroll** across all 7 pages × 5 viewports (document `scrollWidth ≤ innerWidth` everywhere). The `/vs/` master matrix and TCO tables and the homepage compare grid use internal scroll containers — they fit the page (no breakage) but need keyboard access (M1).
6. **Mobile usability.** Tap targets: many links/labels are < 44 px tall (en-home 36 instances — nav logo 134×37, trust wordmarks 75×34, compare-link chips ~41 px tall, footer links; 404 nav links 28×17 / 55×17). Legible without zoom. Sticky nav works; hover content is purely decorative (lift/shadow) so nothing is unreachable on touch. Main mobile defects: H3 (hero clip) and small tap targets.
7. **Interaction & micro-interactions (shipped polish).** Verified live (`data/interactions.json`): `html.reveal-on` present; a below-fold section measured `opacity:0` before scroll then revealed; **12/12 sections revealed after scroll, 0 stuck hidden**; hover state changes on 6/6 element types; `:active` press = `scale(.992)`; **focus ring visible on 10/10 tab stops** (3 px sage `#4A7C59`); anchor scroll clears the nav. **prefers-reduced-motion:** `reveal-on` correctly NOT added, all sections visible immediately, transitions `none`, nothing hidden (`en-home__desktop__reduced-motion__full.png`). The polish layer is working as designed.
8. **Accessibility (WCAG 2.1 AA).** axe totals per page (all violations are *serious*, none *critical*): see Appendix table. Dominant rule is color-contrast (H1); plus `scrollable-region-focusable` (M1), `listitem` (M3), one `link-in-text-block` on `/vs/`. Manual: one `<h1>` per page ✓, landmarks present ✓, image alt 0 missing across all pages ✓, heading-order skips on 3 pages (M2), skip-link missing on 4 (M4), focus order logical with visible ring ✓, no keyboard traps ✓. Forms: contact inputs have visible labels, but the submit control is invisible (C1).
9. **Performance / CWV (Lighthouse).** Homepage mobile **perf 57** (LCP 4.85 s ❌, CLS 0.33 ❌, TBT 136 ms, FCP 3.51 s, 344 KB); homepage desktop **86** (LCP 0.52 s, CLS 0.27 ❌, TBT 0). Blog mobile **98** (LCP 1.74 s ✓, CLS 0.016 ✓, TBT 146 ms, 282 KB); blog desktop **100**. No render-blocking external resources; third-party (GA) blocked main thread ~190 ms on mobile. The homepage's large inline stylesheet + 4 font families + font-swap reflow are the mobile drags.
10. **Conversion UX.** Path to book = **1 click** (any "Book…" CTA → Calendly booking page, reachable 200). Primary CTA is persistent (nav + hero + closing) but the **label varies** (L2). Trust signals are well placed (award + counts in the hero credential card; case files; certs in copy). Friction points: invisible contact-form submit (C1), and the worldwide-award overstatement undercutting the otherwise-disciplined proof (H2).
11. **Technical hygiene.** Titles/meta/canonical/lang/OG all present and correct on the 6 content pages (en-home 6 JSON-LD blocks [Organization, LocalBusiness, Service, WebSite, FAQPage, Product]; ja 5; vs 3; mscorp 2; blog 4; contact 2). 404 has none (acceptable). Console: no JS exceptions on any page; GA beacon abort is a headless artifact (P2); blog chatbot ORB-blocked (H4). Internal links 57/58 → 200, one 308 (L1). No mixed content.

---

## Prioritized fix queue

| # | Fix | Severity | Rough effort |
|---|---|---|---|
| 1 | Restore the contact "Send Message" button fill (sage + white, ≥4.5:1) | 🔴 C1 | XS (1 CSS rule) |
| 2 | Kill homepage CLS: preload hero fonts + add `size-adjust` fallback metrics | 🔴 C2 | M |
| 3 | Darken text-tier sage/gold to pass AA (sage→`#3A6349`, gold text→deeper) site-wide | 🟠 H1 | M (token + audit) |
| 4 | Fix contact "best partner worldwide" → "2024 Cybozu Global Award — Asia" | 🟠 H2 | XS |
| 5 | Add mobile hero `padding-top` so the H1 clears the sticky nav | 🟠 H3 | XS |
| 6 | Fix/serve or remove the ORB-blocked chatbot widget | 🟠 H4 | S |
| 7 | `tabindex="0"` + aria-label on scrollable table wrappers | 🟡 M1 | XS |
| 8 | Repair heading order (h2→h4 skips) on vs/blog/contact | 🟡 M2 | S |
| 9 | Wrap stray `<li>` in lists (ja-home, vs) | 🟡 M3 | XS |
| 10 | Add skip-link to inner/blog/contact/404 templates | 🟡 M4 | S |
| 11 | Cap prose line-length (~70ch) on case/blog/contact | 🟡 M5 | XS |
| 12 | Improve mobile tap targets to ≥44 px (nav, chips, footer) | 🟡 | S |
| 13 | Standardize primary-CTA label; point brand link to `/brand-guidelines` | 🔵 L1/L2 | XS |
| 14 | Reskin the 404 to the design system (DM Serif, meta, skip-link) | 🔵 L3 | S |

LCP on mobile (4.85 s) largely resolves with fix #2 (hero text is the LCP element) plus trimming/deferring non-critical font weights; re-measure after.

---

## Appendix

### A. axe-core violations (WCAG 2.0/2.1 A & AA) — counts by page

| Page | Desktop (types · nodes) | Mobile-iOS (types · nodes) | Rules |
|---|---|---|---|
| en-home | 1 · 26 | 2 · 16+1 | color-contrast; +scrollable-region-focusable (mobile) |
| ja-home | 2 · 10+5 | 1 · 10 | color-contrast; listitem |
| vs | 3 · 54+1+4 | 2 · 54+1 | color-contrast; link-in-text-block; listitem; scrollable-region-focusable (mobile) |
| case-mscorp | 1 · 11 | 1 · 11 | color-contrast |
| blog-crm | 1 · 29 | 2 · 29+1 | color-contrast; scrollable-region-focusable (mobile) |
| contact | 1 · 6 | 1 · 6 | color-contrast |
| 404 | 1 · 3 | 1 · 3 | color-contrast |

All violations are impact **serious**; **no critical** axe violations. Raw per-page JSON: `data/axe__<page>__<viewport>.json`.

### B. Lighthouse scores

| Run | Perf | LCP | CLS | TBT | FCP | SI | Weight |
|---|---|---|---|---|---|---|---|
| en-home mobile | **57** | **4849 ms** ❌ | **0.330** ❌ | 136 ms | 3512 ms | 3636 ms | 344 KB |
| en-home desktop | 86 | 516 ms | **0.270** ❌ | 0 ms | 491 ms | 491 ms | 344 KB |
| blog-crm mobile | **98** | 1743 ms ✓ | 0.016 ✓ | 146 ms | 1549 ms | — | 282 KB |
| blog-crm desktop | **100** | 467 ms ✓ | 0.003 ✓ | 0 ms | 446 ms | — | 282 KB |

Raw: `data/lh__<page>__<mode>.json` · summary `data/lighthouse-summary.json`. (Best-practices/TLS audit excluded — see environment caveat.)

### C. Confirmed contrast failures
Solid-background, scanner-verified failures in `data/contrast-refined.json` (gradient/dark-section false-positives excluded after manual verification — those are white-on-dark and pass). Headline pairs are tabulated in **H1** above.

### D. Screenshot index (`audit/screens/`)
- **Naming:** `<page>__<viewport>__fold.png` (above the fold) and `__full.png` (full page) for all 7 pages × 5 viewports = 70, plus:
  - `en-home__desktop__focus-ring.png` — keyboard focus ring
  - `en-home__desktop__reduced-motion__full.png` — prefers-reduced-motion render
  - `verify__contact__buttonsubmitbtn.png` — the invisible submit button (C1)
  - `verify__blog-crm__breadcrumb.png`, `verify__blog-crm-author__authorbox.png`
- **Key exhibits:** C1 → `verify__contact__buttonsubmitbtn.png` + `contact__desktop__fold.png`; C2 → `en-home__*__full.png`; H3 → `en-home__mobile-ios__fold.png`, `vs__mobile-ios__fold.png`; first impression → `en-home__desktop__fold.png`.

### E. Reproduce
Scripts in `audit/scripts/` (`audit.mjs`, `interactions.mjs`, `links.mjs`, `lighthouse.mjs`, `refine-contrast.mjs`, `capture-cls.mjs`, `verify.mjs`, `digest.mjs`). `cd audit && npm install && npx playwright install chromium`, then run each with `node scripts/<file>.mjs`. `node_modules/` is git-ignored.

---

**Branch:** `ui-ux-audit` · **Report:** `audit/UX-AUDIT.md` · **Screenshots:** `audit/screens/` (75 PNGs) · **Raw data:** `audit/data/` (axe, Lighthouse, contrast, interactions, links, results JSON).

**Headline:** edamame-jp.com presents as a genuinely well-built, enterprise-credible site — disciplined brand typography (all four custom fonts, no Inter), a strong desktop first impression, rich valid structured data, a blog template that scores 98–100 on Lighthouse, flawless responsive integrity (no overflow anywhere), and an interaction-polish layer that does exactly what it claims including correct reduced-motion behavior. What holds it back is concentrated and fixable: the flagship **homepage fails Core Web Vitals on mobile** (CLS 0.33 + LCP 4.85 s) entirely because of hero font-swap reflow; the **brand's own sage and gold fail AA as small text** across every page (axe: serious, up to 54 nodes on `/vs/`); and two sharp conversion/credibility cuts — an **invisible "Send Message" button** on the contact form and a stray **"best Kintone partner worldwide"** claim that contradicts the otherwise-careful award positioning. None require a redesign; the top five fixes are mostly CSS and copy.
