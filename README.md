# Edamame Website — edamame-jp.com

**Owner:** Tom Arai, CEO — Edamame Inc.
**Stack:** Static HTML on GitHub Pages, custom domain via CNAME
**Analytics:** Google Analytics 4 (G-YF1198H5CL)
**Chatbot:** Camille Chatbot v2.1.0 (camille-chatbot.tom-arai.workers.dev)

---

## Architecture

```
edamame-jp.com/
├── index.html                    # Main Edamame corporate page
├── ja/                           # Japanese corporate pages
├── kintone-philippines/
│   ├── en/                       # English landing page + blog + tools
│   │   ├── index.html            # Main EN landing page
│   │   ├── blog/                 # SEO content hub (~30 articles)
│   │   ├── customers/            # Customer success stories
│   │   ├── events/
│   │   ├── industries/           # 8 vertical landing pages
│   │   ├── tools/                # App estimator, digital readiness quiz
│   │   └── privacy-policy/
│   ├── ja/                       # Japanese landing page
│   ├── sitemap.xml
│   └── llms.txt
├── robots.txt
└── sitemap.xml
```

## Contact Form Flow

```
Website form → POST camille-chatbot.tom-arai.workers.dev/api/contact
  → Kintone App 906 (credentials server-side only)
  → Telegram notification
  → Google Sheets backup
```

Security fix (Apr 4, 2026): Removed exposed Kintone credentials from client-side JS. Both EN and JA pages now proxy through Camille Worker.

---

## SEO Content Inventory (April 2026)

### Ranking Articles
| Article | Slug | Google Position |
|---|---|---|
| 15 Best CRM Software Philippines 2026 | best-crm-software-philippines-2026 | **#1** |
| Best Odoo Alternative Philippines 2026 | odoo-alternative-philippines | **#2** |

### New Articles (April 2026)
| Article | Slug |
|---|---|
| 12 Best Accounting Software Philippines 2026 | best-accounting-software-philippines-2026 |
| Salesforce Pricing Philippines 2026 | salesforce-pricing-philippines |

### All Published Articles
- **Comparison guides:** best-crm, best-accounting, best-hr, best-inventory, best-erp, best-hr-software
- **Pricing exposés:** salesforce-pricing, odoo-pricing, odoo-alternative, sap-alternative
- **Platform vs:** kintone-vs-salesforce, hubspot, monday, odoo, airtable, zoho, erpnext, notion, smartsheet
- **Topic guides:** no-code-app-development, workflow-automation, custom-crm, hr-system
- **Industry verticals:** manufacturing, logistics, real-estate, healthcare, bpo, construction, education, retail

### Planned Articles
- Best Project Management Software Philippines 2026
- How to Replace Excel Philippines
- HubSpot Pricing Philippines 2026
- Zoho CRM Review Philippines 2026

---

## SEO Strategy

**Goal:** Rank #1 for every "best [software category] Philippines 2026" keyword.

**Method:** Comprehensive comparison guides (10-15 platforms, real PHP pricing, Kintone as one strong option). CRM article proves the model — replicate across all categories.

**Architecture:**
- Landing page → conversion-focused (needs redesign — currently too dense)
- Blog articles → SEO workhorses
- Industry pages → targeted vertical landing pages

**Technical SEO:** Schema.org (Article, ItemList, FAQPage), OG tags, canonical URLs, sitemap

**Gaps:** Google Business Profile audit, backlink strategy, content freshness updates, internal cross-linking

---

## Changelog

- **2026-04-04:** Salesforce Pricing + Accounting Software articles. Contact form security fix. JA form wired to Kintone. Live agent chat shipped. Camille Chatbot v2.0→v2.1.
- **2026-04-03:** Industry pages SEO. Tools page fix.
- **2026-03:** Odoo articles. Logistics/Real Estate/Healthcare/BPO/Construction/Education articles.
- **2026-02:** Platform comparison batch. Industry verticals. No-code/Workflow/CRM/HR guides.
- **2026-01:** CRM rankings article (#1 Google). Blog infrastructure. Kintone vs Odoo.
