// Poortwachter: controleert alle posts op de vaste regels en maakt output/planning.csv.
// Bij één overtreding faalt dit script (en dus de GitHub Action), zodat er nooit iets fouts doorkomt.
// Gebruik: npm run controle
const fs = require('fs'), path = require('path'), crypto = require('crypto'), yaml = require('js-yaml');
const root = path.join(__dirname, '..');
const brand = yaml.load(fs.readFileSync(path.join(root, 'brand/brand.yml'), 'utf8'));
const DAG = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
const uur = t => +String(t).slice(0, 2);
let fout = 0; const meld = (f, m) => { fout++; console.log(`✗ ${f}: ${m}`); };

// Het logo mag nooit veranderen
const sha = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, brand.logo))).digest('hex');
if (sha !== brand.logo_sha256) meld('brand/logo.png', 'het logo is gewijzigd; zet het originele bestand terug');

const files = fs.readdirSync(path.join(root, 'posts')).filter(f => /\.ya?ml$/.test(f)).sort();
const koppen = {}, momenten = {}, nrs = {};
const rows = [['nr', 'datum', 'tijd', 'reeks', 'doelgroep', 'onderwerp', 'beeld', 'woorden']];
const SJ = fs.readdirSync(path.join(root, 'templates')).filter(f => !f.startsWith('_')).map(f => f.replace('.js', ''));

for (const f of files) {
  const p = yaml.load(fs.readFileSync(path.join(root, 'posts', f), 'utf8')) || {};
  const id = f.replace(/\.ya?ml$/, ''), e = m => meld(f, m);
  const t = String(p.linkedin || '').trim();
  const beeldtekst = [p.kop, p.kicker, p.getal, p.links, p.rechts, ...(p.items || []), ...(p.labels || []),
    ...(p.stappen || []).map(s => `${s.datum} ${s.tekst}`), JSON.stringify(p.links || ''), JSON.stringify(p.rechts || '')].join(' ');
  const alles = t + ' ' + beeldtekst;

  // Tekst
  if (!t) e('geen linkedin-tekst');
  const regels = t.split('\n').map(s => s.trim()).filter(Boolean);
  if (regels.at(-1) !== 'Bekijk onze website.') e('laatste regel is niet exact "Bekijk onze website."');
  if ((t.match(/Bekijk onze website\./g) || []).length !== 1) e('"Bekijk onze website." moet precies één keer voorkomen');
  const w = t.split(/\s+/).filter(Boolean).length;
  if (!p.advertentie && (w < 70 || w > 140)) e(`${w} woorden, moet tussen 70 en 140 liggen`);
  if (/https?:|www\.|\b[\w-]+\.(nl|com|eu|org|io)\b/i.test(t)) e('bevat een link of url');
  if (/[—–]|\s-\s/.test(alles)) e('bevat een gedachtestreepje');
  if (/[’‘“”]/.test(alles)) e('gekrulde aanhalingstekens of apostrof; gebruik de rechte \'');
  if (/#\w/.test(t)) e('bevat een hashtag');
  if (/\p{Extended_Pictographic}/u.test(alles)) e('bevat een emoji');
  if (/Ik ben benieuwd|Mijn vraag:|Herkenbaar\?|Wat vind jij\?|Laat het weten|Deel je ervaring/i.test(t)) e('vaste AI-afsluiter');
  if ((t.match(/\bNiet [^.?!]{1,60}\.\s+Maar\b/g) || []).length) e('"Niet X. Maar Y."-constructie');
  if (/^\s*([-*•]|\d+[.)])\s/m.test(t)) e('bevat een opsomming; schrijf het als lopend verhaal');
  if (/\b(u|uw|U|Uw)\b/.test(alles.replace(/\bU-bocht\b/g, ''))) e('aanspreekvorm "u/uw"; de spreektaal is je/jij/jouw');

  // Prijzen
  for (const b of alles.match(/€\s?\d[\d.,]*/g) || []) {
    const n = b.replace(/\s/g, '');
    if ((brand.prijzen.verouderd || []).some(v => v.replace(/\s/g, '') === n)) e(`oude prijs ${b}`);
    else if (!(brand.prijzen.toegestaan || []).some(v => v.replace(/\s/g, '') === n)) e(`bedrag ${b} staat niet in brand.yml (prijzen.toegestaan)`);
  }

  // Beeld
  if (!SJ.includes(p.sjabloon)) e(`onbekend sjabloon "${p.sjabloon}"`);
  if (!p.kop) e('geen kop voor het beeld');
  if (p.kop && koppen[p.kop]) e(`dubbele kop, zelfde als ${koppen[p.kop]}`); else koppen[p.kop] = f;
  if ((p.labels || []).length > 3) e('meer dan 3 labels');
  for (const l of p.labels || []) if (!brand.kernwoorden.includes(l)) e(`label "${l}" staat niet in de kernwoorden van brand.yml`);
  if (p.kicker && p.kicker.split(/\s+/).length > 5) e('kicker te lang (max 5 woorden)');
  if (p.kop && p.kop.replace(/[*\\n]/g, ' ').split(/\s+/).filter(Boolean).length > 9) e('kop te lang voor een beeld (max 9 woorden)');

  // Planning
  if (p.advertentie) { if (p.datum || p.tijd) e('advertentiepost hoort geen datum of tijd te hebben'); }
  else {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(p.datum || '')) e('datum ontbreekt of is niet JJJJ-MM-DD');
    if (!/^\d{2}:00$/.test(p.tijd || '')) e('tijd ontbreekt of is geen heel uur (UU:00)');
    const r = brand.reeksen[p.reeks];
    if (!r) e(`onbekende reeks "${p.reeks}"`);
    else if (p.datum) { const d = DAG[new Date(p.datum + 'T12:00:00Z').getUTCDay()]; if (!r.dagen.includes(d)) e(`reeks ${p.reeks} hoort op ${r.dagen.join('-')}, niet op ${d}`); }
    if (p.tijd && (uur(p.tijd) < uur(brand.venster.van) || uur(p.tijd) > uur(brand.venster.tot))) e(`tijd ${p.tijd} valt buiten ${brand.venster.van}-${brand.venster.tot}`);
    const m = `${p.datum} ${p.tijd}`; if (momenten[m]) e(`zelfde moment als ${momenten[m]}`); else momenten[m] = f;
    if (nrs[p.nr]) e(`zelfde nr als ${nrs[p.nr]}`); else nrs[p.nr] = f;
  }
  rows.push([p.nr ?? '', p.datum ?? '', p.tijd ?? '', p.reeks ?? 'advertentie', p.doelgroep ?? '', `"${String(p.onderwerp).replace(/"/g, '""')}"`, `output/linkedin/${id}.png`, w]);
}

// Ritme: binnen elke reeks schuift de tijd per post een uur op (na 20:00 weer 08:00)
for (const [naam] of Object.entries(brand.reeksen)) {
  const lijst = files.map(f => [f, yaml.load(fs.readFileSync(path.join(root, 'posts', f), 'utf8'))]).filter(([, p]) => p.reeks === naam && !p.advertentie)
    .sort((a, b) => (a[1].datum + a[1].tijd).localeCompare(b[1].datum + b[1].tijd));
  for (let i = 1; i < lijst.length; i++) {
    const vorig = uur(lijst[i - 1][1].tijd), nu = uur(lijst[i][1].tijd), verwacht = vorig >= uur(brand.venster.tot) ? uur(brand.venster.van) : vorig + 1;
    if (nu !== verwacht) meld(lijst[i][0], `tijd ${lijst[i][1].tijd} volgt niet het ritme van reeks ${naam} (verwacht ${String(verwacht).padStart(2, '0')}:00)`);
  }
}

fs.mkdirSync(path.join(root, 'output'), { recursive: true });
fs.writeFileSync(path.join(root, 'output/planning.csv'), rows.map(r => r.join(',')).join('\n') + '\n');
console.log(`${files.length} posts gecontroleerd, ${fout} problemen.`);
if (fout) process.exit(1);
