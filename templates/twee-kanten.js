// Opdrachtgever en zelfstandige rechtstreeks verbonden. links/rechts: korte namen onder de bollen.
const {md,esc,labels,kicker}=require('./_shared');
module.exports=p=>`<div class="vlak donker" style="padding:60px 72px">
  <div style="position:absolute;left:72px;top:60px;width:600px">${kicker(p.kicker)}<h1 style="font-size:${p.kopgrootte||62}px;margin-top:22px">${md(p.kop)}</h1></div>
  <div style="position:absolute;right:70px;top:120px;width:400px;height:260px">
    <svg width="400" height="200" viewBox="0 0 400 200"><line x1="120" y1="100" x2="280" y2="100" stroke="#fff" stroke-width="4" opacity=".85"/>
    <circle cx="80" cy="100" r="62" fill="none" stroke="#fff" stroke-width="4"/><circle cx="320" cy="100" r="62" fill="#fff"/>
    <circle cx="200" cy="100" r="11" fill="var(--accent)"/></svg>
    <div style="display:flex;justify-content:space-between;font-size:20px;font-weight:500;color:#F1E6F4;margin-top:12px">
      <span style="width:160px;text-align:center">${esc(p.links)}</span><span style="width:160px;text-align:center">${esc(p.rechts)}</span></div></div>
  ${labels(p.labels)}</div>`;
