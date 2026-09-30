// Re-check contrast with gradient/background-image awareness so we separate
// REAL solid-background failures from scanner artifacts (white text on dark
// gradient/image sections the simple scanner reads as the off-white fallback).
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const OUT = new URL('../', import.meta.url).pathname;
const PAGES = {
  'en-home': 'https://edamame-jp.com/kintone-philippines/en/',
  'ja-home': 'https://edamame-jp.com/kintone-philippines/ja/',
  'vs': 'https://edamame-jp.com/kintone-philippines/en/vs/',
  'case-mscorp': 'https://edamame-jp.com/kintone-philippines/en/customers/ms-corp/',
  'blog-crm': 'https://edamame-jp.com/kintone-philippines/en/blog/best-crm-software-philippines-2026/',
  'contact': 'https://edamame-jp.com/kintone-philippines/en/contact/',
};

function scan() {
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map(s=>parseFloat(s.trim())); return { r:p[0],g:p[1],b:p[2],a:p.length>3?p[3]:1 }; };
  const over = (f,b)=>({ r:f.r*f.a+b.r*(1-f.a), g:f.g*f.a+b.g*(1-f.a), b:f.b*f.a+b.b*(1-f.a), a:1 });
  const lum = ({r,g,b})=>{const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)};
  const ratio=(a,b)=>{const L1=lum(a),L2=lum(b),hi=Math.max(L1,L2),lo=Math.min(L1,L2);return (hi+0.05)/(lo+0.05)};
  const vis=(el)=>{const r=el.getBoundingClientRect();const s=getComputedStyle(el);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'&&+s.opacity>0.05;};
  const path=(el)=>{const p=[];let n=el;for(let i=0;n&&n.nodeType===1&&i<4;i++){let s=n.tagName.toLowerCase();const c=n.className&&n.className.toString().trim().split(/\s+/).filter(Boolean).slice(0,2).join('.');if(c)s+='.'+c;p.unshift(s);n=n.parentElement;}return p.join(' > ');};

  // effective bg: walk up; note if a gradient/image background sits above before an opaque solid
  const effBg=(el)=>{
    let node=el, stack=[], gradient=false, gradStr='';
    while(node&&node.nodeType===1){
      const cs=getComputedStyle(node);
      const bi=cs.backgroundImage;
      if(bi&&bi!=='none'){ gradient=true; if(!gradStr) gradStr=bi.slice(0,60); }
      const bg=parse(cs.backgroundColor);
      if(bg&&bg.a>0){ stack.push(bg); if(bg.a>=0.999) break; }
      node=node.parentElement;
    }
    let base={r:250,g:250,b:248,a:1};
    for(let i=stack.length-1;i>=0;i--) base=stack[i].a>=0.999?stack[i]:over(stack[i],base);
    return { bg:base, gradient, gradStr, reachedOpaque: stack.some(s=>s.a>=0.999) };
  };

  const out=[];
  document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a,span,li,button,strong,em,small,label,td,th,summary').forEach(el=>{
    if(!vis(el))return;
    if(![...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim().length>1))return;
    const s=getComputedStyle(el);
    const fg=parse(s.color); if(!fg) return;
    const e=effBg(el);
    const fgC=fg.a<1?over(fg,e.bg):fg;
    const fsize=parseFloat(s.fontSize), bold=+s.fontWeight>=700;
    const large=fsize>=24||(fsize>=18.66&&bold);
    const need=large?3:4.5;
    const cr=ratio(fgC,e.bg);
    if(cr>=need) return; // only failures
    out.push({
      ratio:+cr.toFixed(2), need, large,
      fg:`rgb(${Math.round(fgC.r)},${Math.round(fgC.g)},${Math.round(fgC.b)})`,
      bg:`rgb(${Math.round(e.bg.r)},${Math.round(e.bg.g)},${Math.round(e.bg.b)})`,
      onGradientOrImage:e.gradient, gradStr:e.gradStr,
      fontSize:Math.round(fsize)+'px', weight:s.fontWeight,
      sample:(el.textContent||'').trim().slice(0,40), sel:path(el),
    });
  });
  // dedup by colors+size
  const seen=new Map();
  for(const o of out){ const k=`${o.fg}|${o.bg}|${o.fontSize}|${o.weight}|${o.onGradientOrImage}`; if(!seen.has(k)) seen.set(k,o); }
  return [...seen.values()];
}

const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const all={};
for(const [id,url] of Object.entries(PAGES)){
  const ctx=await browser.newContext({ ignoreHTTPSErrors:true, viewport:{width:1440,height:900} });
  const pg=await ctx.newPage();
  await pg.goto(url,{waitUntil:'networkidle'});
  await pg.waitForTimeout(700);
  await pg.evaluate(async()=>{await new Promise(r=>{let y=0;const t=setInterval(()=>{window.scrollBy(0,900);y+=900;if(y>document.body.scrollHeight){clearInterval(t);r();}},40);});});
  await pg.evaluate(()=>window.scrollTo(0,0)); await pg.waitForTimeout(300);
  const fails=await pg.evaluate(scan);
  all[id]=fails;
  await ctx.close();
}
await browser.close();
writeFileSync(`${OUT}data/contrast-refined.json`, JSON.stringify(all,null,2));

// summarize
for(const [id,fails] of Object.entries(all)){
  const solid=fails.filter(f=>!f.onGradientOrImage);
  const grad=fails.filter(f=>f.onGradientOrImage);
  console.log(`\n## ${id}: ${solid.length} CONFIRMED solid-bg fail(s), ${grad.length} on gradient/image (scanner can't read bg -> verify via screenshot)`);
  solid.sort((a,b)=>a.ratio-b.ratio).forEach(f=>console.log(`  REAL ${f.ratio}:1 (need ${f.need}) ${f.large?'[lg]':'[body]'} ${f.fg} on ${f.bg} ${f.fontSize} w${f.weight} "${f.sample}" | ${f.sel}`));
  if(grad.length) console.log(`   gradient/image pairs (likely white-on-dark, OK): ` + grad.slice(0,6).map(f=>`${f.ratio}:1 "${f.sample.slice(0,18)}"`).join(' · '));
}
