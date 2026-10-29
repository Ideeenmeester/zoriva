// Twee kolommen naast elkaar, rechts uitgelicht. links/rechts: {titel, regels: [max 2-3 korte regels]}
// Links krijgt kruisjes; zet links.positief: true voor vinkjes.
const {md,esc,labels,kicker,check}=require('./_shared');
const kol=(k,uit)=>`<div style="flex:1;border-radius:26px;padding:30px 34px;${uit?'background:linear-gradient(120deg,var(--diep),#6A2873 70%,var(--magenta));color:#fff':'background:#fff;border:1.5px solid var(--rand);color:var(--diep)'}">
  <div style="font-weight:700;font-size:26px;letter-spacing:-.01em">${esc(k.titel)}</div>
  ${(k.regels||[]).map(r=>`<div style="display:flex;gap:12px;align-items:center;margin-top:16px;font-size:21px;${uit?'':'color:#5A4660'}">${uit?check('#E9A6F1'):k.positief?check('#63256C'):'<span style="width:26px;text-align:center;font-weight:700;color:#B49ABC">×</span>'}${esc(r)}</div>`).join('')}</div>`;
module.exports=p=>`<div class="vlak licht" style="padding:56px 72px">${kicker(p.kicker)}
  <h1 style="font-size:${p.kopgrootte||54}px;margin-top:18px">${md(p.kop)}</h1>
  <div style="display:flex;gap:22px;margin-top:34px">${kol(p.links||{},false)}${kol(p.rechts||{},true)}</div>${labels(p.labels)}</div>`;
