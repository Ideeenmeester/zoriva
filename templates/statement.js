// Eén sterke uitspraak. thema: split (standaard, diagonaal zoals de hero), donker of licht.
const {md,labels,kicker,motief}=require('./_shared');
module.exports=p=>{
  const t=p.thema||'split', size=p.kopgrootte||72;
  const kop=`${kicker(p.kicker)}<h1 style="font-size:${size}px;margin-top:26px;max-width:${t==='split'?700:900}px">${md(p.kop)}</h1>`;
  if(t==='split') return `<div class="vlak split">
    <div style="position:absolute;inset:0;background:linear-gradient(160deg,var(--lavendel),#E6DCEB)">${motief('#7E3682',.55,40,70)}</div>
    <div class="donker" style="position:absolute;inset:0;clip-path:polygon(0 0,78% 0,64% 100%,0 100%);padding:60px 72px">${kop}${labels(p.labels)}</div></div>`;
  return `<div class="vlak ${t}" style="padding:60px 72px">${motief(t==='donker'?'#ffffff':'#7E3682',t==='donker'?.10:.18,40,60)}<div style="position:relative;z-index:2">${kop}</div>${labels(p.labels)}</div>`;
};
