# ADR 0001 — Homepage positioning & brand direction

- **Status:** Proposed (live on `homepage-redesign` branch → Cloudflare Pages preview, pending review)
- **Date:** 2026-06-21
- **Scope:** `/kintone-philippines/en/` (primary buyer entry page). JA + secondary pages to follow.
- **Deciders:** Tom Arai (owner), with implementation by the rebuild brief.

## Context

edamame is the official Kintone (Cybozu) partner in the Philippines, 2024 Cybozu
Global Award — Asia, with the a strong Philippine enterprise client base in Southeast
Asia. The EN homepage is the page PH buyers actually land on. The buyer is a PH
corporate decision-maker (IT manager, ops head, executive) choosing a
business-critical system. They are afraid of failure (50–75% of PH ERP projects
fail/overrun), distrust unknown vendors, and must feel **safe** choosing us.

Two strategic threats define the page's job:

1. **Platform alternatives**, not other Kintone partners, are the enemy: SAP,
   Oracle NetSuite, Odoo, ERPNext, monday.com, Microsoft Power Apps, Zoho, and
   Excel/custom dev.
2. **Disintermediation:** Cybozu now has a direct Manila presence, so the site
   must claim the "official PH Kintone partner" identity unmistakably and justify
   a partner over going direct.

The previous homepage ("Data Atelier" v2) had real craft but converted weakly
against this buyer:

- **Voice undercut authority.** "Hi — we're a small studio in Pasig" and
  "field notes / three beans / atelier" signal boutique craft, the opposite of
  the safe-enterprise-IT signal this buyer needs.
- **No problem agitation / loss aversion.** Nothing on the cost of manual/Excel
  work, the lock-in/overrun of SAP/Oracle, or the PH ERP failure rate.
- **No disintermediation defense.** Didn't explain why a partner beats buying
  Kintone direct.
- **Weak proof framing.** Client names as plain text; case studies buried; no
  testimonial slot; Partner-of-the-Year reduced to a kicker; "highest client
  count in SE Asia" not stated.
- **No risk-reversal block.** Free consult / 30-day trial / migration / start-
  small / same-day support existed in prose but weren't packaged as "you're safe."
- **Comparison too narrow.** Compared only Odoo/Airtable/monday/Salesforce/
  HubSpot; omitted the actual enemies (SAP, NetSuite, ERPNext, Power Apps, Zoho,
  Excel).
- **CTA inconsistent.** "Book demo" / "Book 30-min demo" vs. the real low-
  friction offer, a **free consultation** (the Calendly slug is
  `freekintoneappconsultation`).
- **Factual error.** JSON-LD + BUSINESS_NAP said founded **2020**; the SEC
  registration is **September 16, 2019 (CS20190000095)**.

## Decision

### 1. Positioning

> For Philippine enterprises choosing a business-critical operations platform,
> **edamame is the official Kintone partner that makes the safe choice the
> obvious one** — 2024 Cybozu Global Award — Asia, the highest Kintone
> client count in Southeast Asia, delivering on the ground in Metro Manila in
> English, Filipino, and Japanese. We beat the 50–75% PH ERP failure rate by
> deploying in days, starting small, and standing behind every build locally.

**Core value proposition (hero):** *The official Kintone partner in the
Philippines — the safe way to run your business on custom software.* Skip the
50–75% ERP failure rate. Deploy custom apps in **days, not months.**

### 2. Page architecture (conversion order)

Nav → **Hero** (one dominant value prop + Partner-of-the-Year badge + authority
credential card; primary CTA + "Compare platforms") → **Trust/logo wall** →
**Problem/loss-aversion** ("too little / too much / the safe middle") →
**Solution** (build / migrate / run) → **Why a partner** (disintermediation
defense) → **Proof** (MSCorp + Guhring case files + flagged testimonial
placeholder) → **Kintone vs the alternatives** (decision table → funnels into
`/vs/` + comparison blogs) → **Risk reversal** (6 guarantees) → **Transparent
PHP pricing** → **Founder/human trust** (Tom Arai) → **FAQ** → **Final CTA** →
Footer (NAP).

### 3. Trust / proof stack

- **Authority:** Partner-of-the-Year badge, #1 in SE Asia by client count, 50
  clients / 2,443 users / 8 sectors, SEC CS20190000095 (since 2019), Kintone
  SOC2 Type II / ISO 27001.
- **Social proof:** client wall (text wordmarks, logo permission UNCONFIRMED —
  flagged) + 2 published case files + 1 flagged testimonial placeholder.
- **Risk reversal:** free consultation, 30-day trial, start-small, migration
  handled, same-day local support, honest-fit promise.
- **Concreteness:** PHP pricing, "days not months," a global air-conditioning manufacturer 3-months→days, 100
  apps, "from ₱1,000/user/month."
- **Local resonance:** Metro Manila/Pasig, trilingual EN/FIL/JP, Japanese-
  affiliated firm fluency.

### 4. CTA strategy

ONE primary action repeated through the page — **Book a free consultation**
(`calendly.com/kintoneph/freekintoneappconsultation`). Secondary = **Compare
platforms** → `/vs/` for the still-evaluating buyer; phone as a tertiary trust
CTA. Semantic colour: **sage = the safe path and every CTA; red is reserved for
the danger** (the failure-rate stat) only.

### 5. Brand direction — **EVOLVE, do not replace**

Keep the equity that is genuinely distinctive and on-brand, and strip the
boutique tells that undercut "safe enterprise partner."

**Keep:** the sage `#4A7C59` / sage-deep `#3A6349` / gold `#C4A35A` / cream /
ink / forest palette (green = *edamame*, and it stands apart from generic SaaS
blue); the bean/pod logo mark; the type set **DM Serif Display · DM Sans ·
Noto Sans JP · JetBrains Mono** (already the only fonts live — no Inter outside
`_backups/`); JetBrains-Mono eyebrows (they read "engineering/precise," which
helps with IT buyers).

**Change:** demote DM Serif Display from *everything* to a controlled accent —
**DM Sans now carries headings** for corporate clarity, serif reserved for the
hero keyphrase, the founder quote, and the final CTA (human warmth, not fashion-
editorial). Retire the fake pulsing "● LIVE" data panel, the "studio / atelier /
field notes / three beans" voice, the organic blob border-radii, and the
sprinkled pod-ornament dividers. Replace with a disciplined radius scale,
authority furniture (badge, credential card, metric bands), and a confident
plural enterprise voice.

## Alternatives considered

- **Full rebrand (new palette/type).** Rejected: discards distinctive, name-
  meaningful equity (green) and SEO/brand recognition for no proven lift; the
  problem was execution and message, not the core palette.
- **Keep Data Atelier as-is, only rewrite copy.** Rejected: the boutique visual
  language (blob shapes, serif-everything, fake LIVE panel) is itself an
  authority liability for this buyer.
- **Generic enterprise SaaS template (blue, all-sans).** Rejected: maximally
  "safe" but indistinguishable from the competitors we want to stand against;
  the brief explicitly wants "enough character to stand out."

## Consequences

- The page now reads enterprise-credible while staying recognizably edamame.
- **SEO equity preserved:** homepage URL unchanged (`/kintone-philippines/en/`,
  no redirect needed); all blog/comparison/customer URLs untouched; internal
  links now actively elevate the ranking comparison content
  (`best-crm-software-philippines-2026` #1, `odoo-alternative-philippines` #2,
  `best-erp-software-philippines-2026`, `kintone-vs-erpnext`, `sap-alternative-
  philippines`, `/vs/` hub). All JSON-LD retained and corrected.
- **Open follow-ups:** client logos are text wordmarks pending written
  permission; the testimonial and the founder photo are flagged placeholders.
- **Brand drift to reconcile:** the JA homepage and secondary pages still run the
  old Data Atelier system; bringing them to this standard is the next workstream
  (ranked in the rebuild output). `brand-guidelines.html` should be updated to
  document v3 once this direction is approved.
- Founding date corrected to **2019-09-16 / SEC CS20190000095** in EN + JA
  homepage JSON-LD and `BUSINESS_NAP.md`.
