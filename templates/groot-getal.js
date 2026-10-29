// Een getal of datum dat moet opvallen. Rechts een paneel met verloop (figuur: motief of verbinding).
const {md,esc,labels,kicker,motief,verbinding}=require('./_shared');
module.exports=p=>{
  const fig=p.figuur==='verbinding'?verbinding(false):motief('#ffffff',.22,20,80);
  return `<div class="vlak licht">
  <div style="position:absolute;left:72px;top:60px;right:440px">${kicker(p.kicker)}
    <div style="font-weight:700;font-size:${p.getalgrootte||150}px;line-height:1;letter-spacing:-.04em;color:var(--paars);margin-top:22px;white-space:nowrap">${esc(p.getal)}</div>
    <h1 style="font-size:40px;margin-top:10px;color:var(--diep)">${md(p.kop)}</h1></div>
  ${labels(p.labels)}
  <div class="grad" style="position:absolute;right:0;top:0;bottom:0;width:400px">${fig}</div></div>`;
};
