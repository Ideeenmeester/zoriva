// Data of stappen op een rij, met genummerde bolletjes en een lijn zoals "Hoe het werk" op de site.
// stappen: [{datum: "1 januari 2027", tekst: "de Wtta gaat in"}]  (datum mag ook een cijfer zijn)
const {md,esc,labels,kicker}=require('./_shared');
module.exports=p=>{
  const st=p.stappen||[];
  const kol=st.map((s,i)=>`<div style="flex:1;position:relative">
    <div style="display:flex;align-items:center;gap:14px"><div style="width:56px;height:56px;border-radius:50%;background:${i===st.length-1&&p.laatste_uitlichten!==false&&st.length>1?'var(--magenta)':'var(--paars)'};color:#fff;font-weight:700;font-size:22px;display:flex;align-items:center;justify-content:center;flex:none">${i+1}</div>
    ${i<st.length-1?'<div style="flex:1;height:3px;background:var(--rand);margin-right:14px"></div>':''}</div>
    <div style="font-weight:700;font-size:${/^\d+$/.test(String(s.datum))?0:30}px;letter-spacing:-.02em;margin-top:22px;color:var(--diep)">${/^\d+$/.test(String(s.datum))?'':esc(s.datum)}</div>
    <div style="font-size:21px;line-height:1.35;margin-top:6px;color:#5A4660;max-width:330px">${md(s.tekst)}</div></div>`).join('');
  return `<div class="vlak" style="background:#fff;color:var(--diep);padding:58px 72px">${kicker(p.kicker).replace('class="kicker"','class="kicker" style="color:var(--paars)"')}
  <h1 style="font-size:${p.kopgrootte||56}px;margin-top:20px;max-width:900px">${md(p.kop).replace(/<em>/g,'<em style="color:var(--paars)">')}</h1>
  <div style="display:flex;gap:10px;margin-top:44px">${kol}</div>
  ${labels(p.labels).replace(/class="label"/g,'class="label" style="background:var(--pil);color:var(--paars)"')}</div>`;
};
