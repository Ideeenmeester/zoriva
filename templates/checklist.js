// Afvinklijst in een witte kaart met paarse bovenrand, zoals de kaarten op de site.
const {md,esc,labels,kicker,check}=require('./_shared');
module.exports=p=>`<div class="vlak licht">
  <div style="position:absolute;left:72px;top:60px;width:540px">${kicker(p.kicker)}<h1 style="font-size:${p.kopgrootte||58}px;margin-top:22px">${md(p.kop)}</h1></div>
  ${labels(p.labels)}
  <div class="kaart" style="position:absolute;right:72px;top:64px;width:430px;padding:40px 38px">
  ${(p.items||[]).map((i,n)=>`<div style="display:flex;gap:16px;align-items:center;font-size:25px;font-weight:500;color:var(--diep);${n?'margin-top:30px':''}">${check('#63256C')}${esc(i)}</div>`).join('')}</div></div>`;
