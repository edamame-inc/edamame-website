#!/usr/bin/env python3
"""Builds the Philippine Kintone templates pages (EN + JA) from data/templates-ph.json.
Chrome is inherited from existing live pages so brand, nav and footer stay identical."""
import json, re, html, datetime
T = json.load(open('data/templates-ph.json', encoding='utf-8'))
P = json.load(open('data/pricing.json', encoding='utf-8'))
BASE = 'https://edamame-jp.com'
today = datetime.date.today().isoformat()
esc = lambda s: html.escape(s, quote=False)

def chrome(src):
    s = open(src, encoding='utf-8').read()
    g = lambda pat: (re.search(pat, s, re.S) or [None, ''])[1] if re.search(pat, s, re.S) else ''
    css = '\n'.join(re.findall(r'<link[^>]+rel="stylesheet"[^>]*>', s))
    fonts = '\n'.join(re.findall(r'<link[^>]+fonts\.(?:googleapis|gstatic)[^>]*>', s))
    styles = '\n'.join(re.findall(r'<style>.*?</style>', s, re.S))
    nav = (re.search(r'(<nav.*?</nav>)', s, re.S) or [None, ''])[1] if re.search(r'(<nav.*?</nav>)', s, re.S) else ''
    foot = (re.search(r'(<footer.*?</footer>)', s, re.S) or [None, ''])[1] if re.search(r'(<footer.*?</footer>)', s, re.S) else ''
    return fonts, css, styles, nav, foot

L = {
 'en': dict(src='kintone-philippines/en/blog/kintone-vs-odoo/index.html', lang='en',
   path='/kintone-philippines/en/kintone-templates-philippines/',
   alt='/kintone-philippines/ja/kintone-templates-philippines/',
   about='/kintone-philippines/en/about/', contact='/kintone-philippines/en/contact/',
   title='Kintone Templates for Philippine Businesses (BIR, Payroll, Leave)',
   desc='Kintone app templates built for Philippine operations: BIR-ready expenses, DTR, 13th-month pay, SSS/PhilHealth/Pag-IBIG, Labor Code leave, and more.',
   h1='Kintone app templates built for Philippine businesses',
   byline='By <a href="{about}">Tom Arai, Founder &amp; CEO, Edamame Inc.</a> · Updated {d}',
   bluf=('<strong>Short answer:</strong> Kintone ships with a general-purpose template library, but generic templates do not know '
         'about BIR receipts, 13th-month pay, SSS, PhilHealth and Pag-IBIG contributions, or Labor Code leave rules. '
         'Edamame Inc., the official Kintone partner in the Philippines and recipient of the 2024 Cybozu Global Award — Asia, '
         'deploys the ten Philippine-ready templates below as starting points and adapts each to how your company actually runs.'),
   intro_h='Why Philippine companies need local templates, not generic ones',
   intro=('Kintone is a no-code business application platform by Cybozu. Its standard templates cover universal needs such as '
          'CRM and task tracking. What they do not cover is the compliance layer every Philippine employer operates under: '
          'Official Receipts and TINs for the BIR, the Daily Time Record, 13th-month pay, mandatory government contributions, and '
          'statutory leave. The templates on this page start from that layer, so the app fits local business rules from day one '
          'rather than being retrofitted after go-live.'),
   who='Who uses it', list_h='The ten Philippine-ready Kintone templates',
   faq_h='Frequently asked questions about Kintone templates in the Philippines',
   faq=[('Does Kintone have templates for Philippine businesses?',
         'Kintone includes a general-purpose template library covering needs such as CRM and task tracking. Philippine-specific templates for BIR receipts, DTR, 13th-month pay, SSS, PhilHealth and Pag-IBIG contributions, and Labor Code leave are deployed and adapted by Edamame Inc., the official Kintone partner in the Philippines.'),
        ('Can Kintone track 13th-month pay?',
         'Yes. A Kintone 13th-month pay tracker accumulates each employee\'s basic salary across the calendar year to support computation under Presidential Decree No. 851, which requires payment on or before 24 December, including pro-rated amounts for mid-year joiners and leavers.'),
        ('Can Kintone manage SSS, PhilHealth and Pag-IBIG contributions?',
         'Yes. A Kintone contribution tracker stores each employee\'s SSS, PhilHealth and Pag-IBIG numbers and monthly contributions with remittance status per period. Because contribution schedules change, the rate table is kept as editable data rather than hard-coded.'),
        ('Can Kintone replace our paper DTR?',
         'Yes. The Kintone DTR app records time in and out and separates overtime, night-shift, rest-day and holiday hours, which Philippine payroll treats differently, with supervisor approval of corrections inside the record.'),
        ('Are these templates available in Japanese?',
         'Yes. Every template can run with English and Japanese labels, which Japanese-affiliated companies in the Philippines typically need for mixed-language teams.'),
        ('How much does it cost to deploy these templates?',
         'Kintone licensing starts {price}. Adapting templates to your process is scoped per engagement and quoted after a free consultation.')],
   cta_h='Start from a template that already knows Philippine rules',
   cta='Bring the process you run on spreadsheets today. In a free 30-minute consultation we will show which template fits, what we would adapt, and a fixed quote. Kintone licensing starts {price}; implementation is scoped per engagement.',
   cta_btn='Book a free consultation →', crumbs=('Home','Kintone templates'), home='/kintone-philippines/en/',
   price=P['kintone_from']['display_en']),
 'ja': dict(src='kintone-philippines/ja/what-is-kintone/index.html', lang='ja',
   path='/kintone-philippines/ja/kintone-templates-philippines/',
   alt='/kintone-philippines/en/kintone-templates-philippines/',
   about='/kintone-philippines/ja/about/', contact='/kintone-philippines/ja/contact/',
   title='フィリピン向けKintoneテンプレート｜BIR・給与・休暇対応',
   desc='フィリピンの業務に合わせたKintoneアプリテンプレート。BIR対応経費、DTR、13ヶ月給与、SSS・PhilHealth・Pag-IBIG、労働法上の休暇など。',
   h1='フィリピン企業向けKintoneアプリテンプレート',
   byline='著者：<a href="{about}">Tom Arai（枝豆株式会社 代表取締役・創業者）</a>　最終更新：{d}',
   bluf=('<strong>結論から言うと、</strong>Kintoneには汎用テンプレートが用意されていますが、BIRの領収書、13ヶ月給与、'
         'SSS・PhilHealth・Pag-IBIGの拠出金、労働法上の休暇といったフィリピン特有のルールには対応していません。'
         'フィリピンにおけるKintone公式パートナーであり「2024 Cybozu Global Award — Asia」受賞企業の枝豆株式会社は、'
         '以下の10種類のフィリピン対応テンプレートを出発点として導入し、各社の実際の業務に合わせて調整します。'),
   intro_h='汎用テンプレートではなく、フィリピン向けテンプレートが必要な理由',
   intro=('Kintoneはサイボウズが提供するノーコードの業務アプリプラットフォームです。標準テンプレートはCRMやタスク管理などの'
          '共通業務をカバーしますが、フィリピンの雇用主が必ず対応するコンプライアンス領域、すなわちBIR向けの公式領収書とTIN、'
          'Daily Time Record、13ヶ月給与、政府拠出金、法定休暇には対応していません。本ページのテンプレートはその領域から設計されて'
          'いるため、稼働後に後付けするのではなく、初日から現地の業務ルールに合致します。'),
   who='利用部門', list_h='フィリピン対応Kintoneテンプレート10種',
   faq_h='フィリピンのKintoneテンプレートに関するよくある質問',
   faq=[('Kintoneにフィリピン企業向けのテンプレートはありますか？',
         'Kintoneには CRM やタスク管理などの汎用テンプレートがあります。BIR領収書、DTR、13ヶ月給与、SSS・PhilHealth・Pag-IBIG拠出金、労働法上の休暇といったフィリピン特有のテンプレートは、フィリピンのKintone公式パートナーである枝豆株式会社が導入・調整します。'),
        ('Kintoneで13ヶ月給与を管理できますか？',
         'はい。Kintoneの13ヶ月給与管理アプリは従業員ごとの年間基本給を積み上げ、12月24日までの支給を定めた大統領令第851号に基づく計算を支援します。年途中の入社・退職者の按分にも対応します。'),
        ('SSS・PhilHealth・Pag-IBIGの拠出金を管理できますか？',
         'はい。拠出金管理アプリは従業員ごとの番号と月次拠出額、各期の納付状況を記録します。拠出率は改定されるため、率表はハードコードせず編集可能なデータとして保持します。'),
        ('紙のDTRをKintoneに置き換えられますか？',
         'はい。KintoneのDTRアプリは出退勤を記録し、フィリピンの給与計算で扱いが異なる残業・深夜・休日・祝日の時間を区分し、修正は上長がレコード内で承認します。'),
        ('テンプレートは日本語で使えますか？',
         'はい。すべてのテンプレートは英語と日本語のラベルで運用でき、フィリピンの日系企業に多い日英混在チームに対応します。'),
        ('テンプレート導入の費用はどのくらいですか？',
         'Kintoneのライセンスは{price}からです。業務に合わせた調整は案件ごとにお見積りし、無料相談の後にご案内します。')],
   cta_h='フィリピンのルールを理解したテンプレートから始める',
   cta='現在スプレッドシートで運用している業務をお持ちください。30分の無料相談で、適したテンプレート、調整内容、確定見積りをご案内します。Kintoneのライセンスは{price}から、導入費用は案件ごとのお見積りです。',
   cta_btn='無料相談を予約する →', crumbs=('ホーム','Kintoneテンプレート'), home='/kintone-philippines/ja/',
   price=P['kintone_from']['display_ja'])
}

for lang, c in L.items():
    fonts, css, styles, nav, foot = chrome(c['src'])
    items = T[lang]
    url = BASE + c['path']
    span = f'<span data-price="kintone-from">{c["price"]}</span>'
    faq = [(q, a.replace('{price}', c['price'])) for q, a in c['faq']]
    ld = [
      {"@context":"https://schema.org","@type":"Article","headline":c['title'],"description":c['desc'],
       "author":{"@type":"Person","name":"Tom Arai","jobTitle":"Founder & CEO","url":BASE+c['about']},
       "publisher":{"@type":"Organization","name":"Edamame Inc.","url":BASE+c['home']},
       "datePublished":today,"dateModified":today,"inLanguage":lang,"mainEntityOfPage":url},
      {"@context":"https://schema.org","@type":"ItemList","name":c['list_h'],"numberOfItems":len(items),
       "itemListElement":[{"@type":"ListItem","position":i+1,"name":t['name'],"url":f"{url}#{t['id']}"} for i,t in enumerate(items)]},
      {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
       {"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}} for q,a in faq]},
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
       {"@type":"ListItem","position":1,"name":c['crumbs'][0],"item":BASE+c['home']},
       {"@type":"ListItem","position":2,"name":c['crumbs'][1],"item":url}]}]
    sections = '\n'.join(
      f'<section id="{t["id"]}"><h3>{esc(t["name"])}</h3><p>{esc(t["body"])}</p>'
      f'<p class="who"><strong>{c["who"]}:</strong> {esc(t["who"])}</p></section>' for t in items)
    # visible FAQ: price must be a sourced span; JSON-LD keeps canonical plain text (markup not allowed there)
    faqs = '\n'.join(f'<details class="faq-item"><summary>{esc(q)}</summary><p>{esc(a).replace(esc(c["price"]), span)}</p></details>' for q,a in faq)
    page = f'''<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{esc(c['title'])}</title>
<meta name="description" content="{esc(c['desc'])}">
<link rel="canonical" href="{url}">
<link rel="alternate" hreflang="{lang}" href="{url}">
<link rel="alternate" hreflang="{'ja' if lang=='en' else 'en'}" href="{BASE+c['alt']}">
<link rel="alternate" hreflang="x-default" href="{BASE}/kintone-philippines/en/kintone-templates-philippines/">
<meta property="og:title" content="{esc(c['title'])}">
<meta property="og:description" content="{esc(c['desc'])}">
<meta property="og:url" content="{url}">
<meta property="og:type" content="article">
{fonts}
{css}
{chr(10).join('<script type="application/ld+json">'+json.dumps(o,ensure_ascii=False)+'</script>' for o in ld)}
{styles}
</head>
<body>
{nav}
<article class="post">
<header class="post-header">
<h1>{esc(c['h1'])}</h1>
<p class="post-meta">{c['byline'].format(about=c['about'], d=today)}</p>
</header>
<p class="lead">{c['bluf']}</p>
<h2>{esc(c['intro_h'])}</h2>
<p>{esc(c['intro'])}</p>
<h2>{esc(c['list_h'])}</h2>
{sections}
<h2>{esc(c['faq_h'])}</h2>
{faqs}
<section class="cta">
<h2>{esc(c['cta_h'])}</h2>
<p>{esc(c['cta']).replace(esc(c['price']), span)}</p>
<p><a class="btn" href="{c['contact']}">{c['cta_btn']}</a></p>
</section>
</article>
{foot}
</body>
</html>'''
    import os; os.makedirs('.'+c['path'], exist_ok=True)
    open('.'+c['path']+'index.html','w',encoding='utf-8').write(page)
    print('built', c['path'])
