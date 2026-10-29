// Wat je niet meer hoeft te betalen. items: korte woorden die doorgestreept worden.
const {md,esc,labels,kicker,motief}=require('./_shared');
module.exports=p=>`<div class="vlak donker" style="padding:60px 72px">${motief('#ffffff',.10,40,60)}
  <div style="position:relative;z-index:2">${kicker(p.kicker)}<h1 style="font-size:${p.kopgrootte||68}px;margin-top:22px">${md(p.kop)}</h1>
  <div style="display:flex;flex-wrap:wrap;gap:16px 40px;margin-top:40px">${(p.items||[]).map(i=>`<span style="position:relative;font-size:34px;font-weight:500;color:#EBDDF0">${esc(i)}<span style="position:absolute;left:-4px;right:-4px;top:52%;height:4px;border-radius:2px;background:var(--accent)"></span></span>`).join('')}</div></div>
  ${labels(p.labels)}</div>`;
