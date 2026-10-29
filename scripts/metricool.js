// Maakt per post de payload om in Metricool in te plannen (brand Zoriva, alleen LinkedIn):
// tekst, openbare raw-url van het beeld en datum/tijd in Europe/Amsterdam met de juiste zomer- of wintertijd.
// Uitvoer: output/metricool.json (alle posts) en output/metricool.csv (voor de bulkimport in Metricool).
// Gebruik: npm run metricool           -> alle posts met datum
//          npm run metricool -- --vanaf 2026-11-10
const fs = require('fs'), path = require('path'), yaml = require('js-yaml');
const root = path.join(__dirname, '..');
const brand = yaml.load(fs.readFileSync(path.join(root, 'brand/brand.yml'), 'utf8'));
const { blogId, netwerk, tijdzone } = brand.metricool, { repo, branch } = brand.github;
const i = process.argv.indexOf('--vanaf'), vanaf = i > -1 ? process.argv[i + 1] : '';

// UTC-offset van een lokale tijd in een tijdzone, bv. "+01:00" in de winter en "+02:00" in de zomer
function offset(datum, tijd, tz) {
  const guess = new Date(`${datum}T${tijd}:00Z`);
  const delen = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    .formatToParts(guess).map(p => [p.type, p.value]));
  const lokaal = Date.UTC(+delen.year, +delen.month - 1, +delen.day, +delen.hour, +delen.minute);
  const min = Math.round((lokaal - guess.getTime()) / 60000), s = min >= 0 ? '+' : '-', a = Math.abs(min);
  return `${s}${String(Math.floor(a / 60)).padStart(2, '0')}:${String(a % 60).padStart(2, '0')}`;
}

const posts = fs.readdirSync(path.join(root, 'posts')).filter(f => /\.ya?ml$/.test(f)).sort().map(f => {
  const p = yaml.load(fs.readFileSync(path.join(root, 'posts', f), 'utf8')), id = f.replace(/\.ya?ml$/, '');
  return { id, p };
}).filter(({ p }) => p.datum && !p.advertentie && p.datum >= vanaf);

const uit = posts.map(({ id, p }) => {
  const beeld = `https://raw.githubusercontent.com/${repo}/${branch}/output/linkedin/${encodeURIComponent(id)}.png`;
  const tekst = String(p.linkedin).trim();
  return {
    id, nr: p.nr, onderwerp: p.onderwerp,
    blogId: String(blogId),
    date: `${p.datum}T${p.tijd}:00${offset(p.datum, p.tijd, tijdzone)}`,
    info: {
      text: tekst, media: [beeld], mediaAltText: [p.kop ? String(p.kop).replace(/[*]/g, '').replace(/\n/g, ' ') : ''],
      providers: [{ network: netwerk }], publicationDate: { dateTime: `${p.datum}T${p.tijd}:00`, timezone: tijdzone },
      autoPublish: true, draft: false, shortener: false, firstCommentText: '', descendants: [], smartLinkData: { ids: [] },
      linkedinData: { type: 'post', previewIncluded: true, publishImagesAsPDF: false }
    }
  };
});

fs.mkdirSync(path.join(root, 'output'), { recursive: true });
fs.writeFileSync(path.join(root, 'output/metricool.json'), JSON.stringify(uit, null, 2) + '\n');
const q = s => `"${String(s).replace(/"/g, '""')}"`;
fs.writeFileSync(path.join(root, 'output/metricool.csv'),
  ['Text,Date,Time,LinkedIn,Picture Url 1', ...uit.map(u => [q(u.info.text), u.info.publicationDate.dateTime.slice(0, 10), u.info.publicationDate.dateTime.slice(11, 16), 'TRUE', u.info.media[0]].join(','))].join('\n') + '\n');
console.log(`${uit.length} posts klaargezet voor Metricool (blogId ${blogId}, ${netwerk}, ${tijdzone}) in output/metricool.json en output/metricool.csv`);
