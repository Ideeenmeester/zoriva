// Maakt de openbare overzichtspagina (GitHub Pages) in site/: alle posts met beeld, datum, tijd,
// kopieerknop en filters per maand, reeks en doelgroep.
// Gebruik: npm run overzicht   (draai eerst npm run render)
const fs = require('fs'), path = require('path'), yaml = require('js-yaml');
const root = path.join(__dirname, '..'), site = path.join(root, 'site');
const brand = yaml.load(fs.readFileSync(path.join(root, 'brand/brand.yml'), 'utf8'));
const k = brand.kleuren;

fs.rmSync(site, { recursive: true, force: true });
fs.mkdirSync(path.join(site, 'beelden'), { recursive: true });
fs.copyFileSync(path.join(root, brand.logo), path.join(site, 'logo.png'));

const posts = fs.readdirSync(path.join(root, 'posts')).filter(f => /\.ya?ml$/.test(f)).sort().map(f => {
  const p = yaml.load(fs.readFileSync(path.join(root, 'posts', f), 'utf8')), id = f.replace(/\.ya?ml$/, '');
  const png = path.join(root, 'output/linkedin', id + '.png');
  if (fs.existsSync(png)) fs.copyFileSync(png, path.join(site, 'beelden', id + '.png'));
  return { id, nr: p.nr ?? null, datum: p.datum || '', tijd: p.tijd || '', reeks: p.advertentie ? 'advertentie' : p.reeks,
    doelgroep: p.doelgroep || '', onderwerp: p.onderwerp, tekst: String(p.linkedin || '').trim(), beeld: `beelden/${id}.png` };
}).sort((a, b) => (a.datum || '9999') + a.tijd < (b.datum || '9999') + b.tijd ? -1 : 1);

const html = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Zoriva LinkedIn-planning</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet">
<style>
:root{--diep:${k.diep};--paars:${k.paars};--magenta:${k.magenta};--accent:${k.accent};--lavendel:${k.lavendel};--pil:${k.pil};--rand:${k.rand}}
*{box-sizing:border-box;margin:0}
body{font-family:Poppins,system-ui,sans-serif;background:var(--lavendel);color:var(--diep)}
header{background:linear-gradient(115deg,var(--diep),#6A2873 70%,var(--magenta));color:#fff;padding:36px 16px 30px}
.wrap{max-width:1180px;margin:0 auto;padding:0 16px}
header img{height:44px;background:#fff;padding:6px 12px;border-radius:10px}
h1{font-size:clamp(26px,4vw,40px);letter-spacing:-.02em;margin-top:18px}
header p{opacity:.85;margin-top:6px}
.filters{display:flex;flex-wrap:wrap;gap:10px;margin:22px 0 6px}
select{font:inherit;font-size:15px;padding:9px 14px;border-radius:999px;border:1.5px solid var(--rand);background:#fff;color:var(--paars)}
.teller{font-size:14px;color:#6B5672;margin:6px 0 18px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:20px;padding-bottom:60px}
.post{background:#fff;border:1.5px solid var(--rand);border-radius:22px;overflow:hidden;display:flex;flex-direction:column}
.post img{width:100%;display:block;aspect-ratio:1200/627;object-fit:cover;background:var(--pil)}
.meta{display:flex;flex-wrap:wrap;gap:8px;padding:16px 18px 0;font-size:13px}
.pil{background:var(--pil);color:var(--paars);padding:4px 12px;border-radius:999px}
.pil.r-risico{background:var(--diep);color:#fff}.pil.r-advertentie{background:var(--magenta);color:#fff}
h2{font-size:18px;padding:10px 18px 0;letter-spacing:-.01em}
.tekst{white-space:pre-wrap;font-size:14px;line-height:1.55;color:#4A3A50;padding:10px 18px;flex:1}
.knoppen{display:flex;gap:8px;padding:0 18px 18px}
button,a.knop{font:inherit;font-size:14px;border:0;border-radius:12px;padding:10px 16px;cursor:pointer;text-decoration:none}
button{background:var(--paars);color:#fff}a.knop{background:var(--pil);color:var(--paars)}
@media(max-width:400px){.grid{grid-template-columns:1fr}}
</style></head><body>
<header><div class="wrap"><img src="logo.png" alt="Zoriva"><h1>LinkedIn-planning</h1><p>Alle posts met beeld, datum en tijd (Europe/Amsterdam). Bijgewerkt ${new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam', dateStyle: 'long', timeStyle: 'short' })}.</p></div></header>
<main class="wrap">
<div class="filters"><select id="maand"><option value="">Alle maanden</option></select>
<select id="reeks"><option value="">Alle reeksen</option><option value="risico">Risico (ma-wo-vr)</option><option value="gerust">Geruststellend (di-do)</option><option value="advertentie">Advertenties</option></select>
<select id="doel"><option value="">Alle doelgroepen</option><option value="opdrachtgevers">Opdrachtgevers</option><option value="zelfstandigen">Zelfstandigen</option><option value="sector">Sector</option><option value="beide">Beide</option></select></div>
<div class="teller" id="teller"></div><div class="grid" id="grid"></div></main>
<script>
const POSTS=${JSON.stringify(posts)};
const M=['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];
const D=['zo','ma','di','wo','do','vr','za'];
const fmt=p=>{if(!p.datum)return 'zonder datum';const d=new Date(p.datum+'T12:00:00');return D[d.getDay()]+' '+d.getDate()+' '+M[d.getMonth()].slice(0,3)+' · '+p.tijd};
const sel=id=>document.getElementById(id);
[...new Set(POSTS.filter(p=>p.datum).map(p=>p.datum.slice(0,7)))].forEach(m=>{const o=document.createElement('option');o.value=m;o.textContent=M[+m.slice(5)-1]+' '+m.slice(0,4);sel('maand').append(o)});
function toon(){const m=sel('maand').value,r=sel('reeks').value,d=sel('doel').value;
 const lijst=POSTS.filter(p=>(!m||p.datum.startsWith(m))&&(!r||p.reeks===r)&&(!d||p.doelgroep===d));
 sel('teller').textContent=lijst.length+' van '+POSTS.length+' posts';
 sel('grid').innerHTML='';
 for(const p of lijst){const a=document.createElement('article');a.className='post';
  a.innerHTML='<img loading="lazy" alt=""><div class="meta"><span class="pil">'+(p.nr?'#'+p.nr+' · ':'')+fmt(p)+'</span><span class="pil r-'+p.reeks+'">'+p.reeks+'</span>'+(p.doelgroep?'<span class="pil">'+p.doelgroep+'</span>':'')+'</div><h2></h2><div class="tekst"></div><div class="knoppen"><button>Kopieer tekst</button><a class="knop" download>Beeld</a></div>';
  a.querySelector('img').src=p.beeld;a.querySelector('h2').textContent=p.onderwerp;a.querySelector('.tekst').textContent=p.tekst;
  const k=a.querySelector('a');k.href=p.beeld;k.setAttribute('download',p.id+'.png');
  const b=a.querySelector('button');b.onclick=async()=>{try{await navigator.clipboard.writeText(p.tekst);b.textContent='Gekopieerd'}catch(e){b.textContent='Kopiëren lukt niet'}setTimeout(()=>b.textContent='Kopieer tekst',1600)};
  sel('grid').append(a)}}
['maand','reeks','doel'].forEach(i=>sel(i).onchange=toon);toon();
</script></body></html>`;
fs.writeFileSync(path.join(site, 'index.html'), html);
console.log(`Overzicht gemaakt met ${posts.length} posts in site/index.html`);
