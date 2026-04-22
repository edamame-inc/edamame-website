## 2026-04-22 — Brand Guidelines v2.0

Major brand system upgrade codifying patterns from homepage v2 review.

**New:**
- Three sanctioned layout modes: **Field Notes** (editorial documentary), **Data Atelier** (proof-first), **Pod & Bean** (mark-driven organic)
- **JetBrains Mono** added as data & label face (for stats, section numbers, uppercase labels, timestamps)
- **Asymmetric pod-corner radius** system (`80px 16px 80px 16px` for side beans, elliptical for center)
- **Dot markers** (sage/gold circles) replace bullet lists
- **Pod divider** SVG as canonical section separator
- **Three-bean service structure** — any group-of-three maps to left-sage / center-gold / right-sage
- **Floating pod decorations** (6% opacity, rotated) for Pod & Bean mode
- **Live data panel** pattern (ink bg + gold border + sage→gold→sage top rule) for Data Atelier mode

**Added rules:**
- **Homepage contract** — 10 mandatory structural elements every homepage must include. Prevents the v1→v2 regression that dropped blog links from 19 to 1 and caused organic traffic decline.
- **Blog surfacing rules** — minimum 6 article links from homepage; never use shorthand `/blog/` (caused 404s); always full `/kintone-philippines/{lang}/blog/{slug}/`
- **Pricing** — "₱1,000/user/month (5-user minimum)" standard phrasing; subtle (55% opacity) on marketing pages, explicit in FAQ

**Files:**
- `brand-guidelines.html` — replaced with v2.0
- `_backups/brand-guidelines-v1-2026-04.html` — v1.0 archived

---

# Edamame Website Changelog

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
