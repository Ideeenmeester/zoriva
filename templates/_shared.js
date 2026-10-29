// Gedeelde bouwstenen voor alle sjablonen. Stijl afgeleid van de Zoriva-site:
// Poppins, diep paars verloop, lavendel vlakken, witte kaarten met paarse bovenrand.
const path = require('path');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// *woord* wordt uitgelicht, \n wordt een nieuwe regel
const md = s => esc(s).replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/\n/g, '<br>');

const W = 1200, H = 627, BALK = 92, VLAK = H - BALK;

function css(b, root) {
  const k = b.kleuren, f = n => 'file://' + path.join(root, 'brand/fonts', n);
  return `
@font-face{font-family:P;font-weight:400;src:url(${f('Poppins-Regular.ttf')})}
@font-face{font-family:P;font-weight:500;src:url(${f('Poppins-Medium.ttf')})}
@font-face{font-family:P;font-weight:700;src:url(${f('Poppins-Bold.ttf')})}
:root{--diep:${k.diep};--paars:${k.paars};--logo:${k.logo};--magenta:${k.magenta};--accent:${k.accent};
--lavendel:${k.lavendel};--pil:${k.pil};--rand:${k.rand};--wit:${k.wit}}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:P,sans-serif;-webkit-font-smoothing:antialiased;background:#fff}
.c{position:relative;width:${W}px;height:${H}px;overflow:hidden}
.vlak{position:absolute;left:0;top:0;width:${W}px;height:${VLAK}px;overflow:hidden}
.donker{background:linear-gradient(115deg,var(--diep) 0%,#4F1B58 50%,#6A2873 80%,var(--magenta) 130%);color:#fff}
.licht{background:var(--lavendel);color:var(--diep)}
.grad{background:linear-gradient(110deg,var(--diep) 0%,#6A2873 60%,var(--magenta) 100%)}
h1{font-weight:700;letter-spacing:-.03em;line-height:1.04}
h1 em{font-style:normal}
.donker h1 em,.split h1 em{color:var(--accent)} .licht h1 em{color:var(--paars)}
.kicker{font-size:20px;font-weight:500}
.donker .kicker{color:#F1E6F4} .licht .kicker{color:var(--paars)}
.labels{position:absolute;left:72px;bottom:46px;display:flex;gap:12px;z-index:3}
.label{font-size:18px;font-weight:400;padding:8px 20px;border-radius:999px;white-space:nowrap}
.donker .label{background:rgba(255,255,255,.13);color:#F6EEF8}
.licht .label{background:#fff;color:var(--paars)}
.kaart{background:#fff;border:1.5px solid var(--rand);border-top:5px solid var(--paars);border-radius:26px}
.balk{position:absolute;left:0;right:0;bottom:0;height:${BALK}px;background:var(--wit);
      display:flex;align-items:center;justify-content:space-between;padding:0 60px}
.balk img{height:64px;width:auto;display:block}
.url{font-size:19px;font-weight:500;color:var(--paars)}
`;
}

const labels = l => !l?.length ? '' :
  `<div class="labels">${l.map(x => `<span class="label">${esc(x)}</span>`).join('')}</div>`;
const kicker = k => k ? `<div class="kicker">${esc(k)}</div>` : '';

// Het logo wordt alleen geschaald weergegeven, nooit bewerkt, en staat op wit (de achtergrond van het logobestand).
const balk = (b, root) =>
  `<div class="balk"><img src="file://${path.join(root, b.logo)}"><span class="url">${esc(b.url)}</span></div>`;

// Los vormelement met stippen en schuine strepen, verwijst naar het beeldmerk zonder het logo te gebruiken.
function motief(kleur, opacity, right = 40, top = 70, schaal = 1) {
  const s = [...Array(4)].map((_, i) =>
    `<line x1="${40 + i * 46}" y1="330" x2="${230 + i * 46}" y2="140" stroke="${kleur}" stroke-width="22" stroke-linecap="round"/>`).join('');
  const d = [[250, 70, 14], [300, 112, 18], [318, 56, 11], [352, 160, 13], [200, 40, 8]]
    .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${kleur}"/>`).join('');
  return `<svg width="${400 * schaal}" height="${380 * schaal}" viewBox="0 0 400 380" style="position:absolute;right:${right}px;top:${top}px;opacity:${opacity}">${s}${d}</svg>`;
}

// Twee partijen rechtstreeks verbonden, zonder schakel ertussen
const verbinding = (licht = false, w = 400, h = 535) => {
  const c = licht ? 'var(--paars)' : '#fff', vul = licht ? 'var(--paars)' : '#fff';
  const cy = h / 2, x1 = w / 2 - 90, x2 = w / 2 + 90;
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <line x1="${x1 + 50}" y1="${cy}" x2="${x2 - 50}" y2="${cy}" stroke="${c}" stroke-width="4" opacity=".85"/>
  <circle cx="${x1}" cy="${cy}" r="50" fill="none" stroke="${c}" stroke-width="4"/>
  <circle cx="${x2}" cy="${cy}" r="50" fill="${vul}"/>
  <circle cx="${w / 2}" cy="${cy}" r="10" fill="var(--accent)"/></svg>`;
};

const check = (kleur) => `<svg width="26" height="26" viewBox="0 0 24 24" style="flex:none"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="${kleur}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

module.exports = { esc, md, css, labels, kicker, balk, motief, verbinding, check, W, H, VLAK };
