// Maakt van elk bestand in posts/ een LinkedIn-beeld (1200x627) in output/linkedin/.
// Gebruik: npm run render            -> alle posts
//          npm run render:een -- 05  -> alleen posts waarvan de naam met 05 begint
const fs = require('fs'), path = require('path'), yaml = require('js-yaml'), { chromium } = require('playwright');
const root = path.join(__dirname, '..');
const { css, balk } = require('../templates/_shared');
const brand = yaml.load(fs.readFileSync(path.join(root, 'brand/brand.yml'), 'utf8'));
const i = process.argv.indexOf('--alleen'), alleen = i > -1 ? process.argv[i + 1] : null;

(async () => {
  const files = fs.readdirSync(path.join(root, 'posts')).filter(f => /\.ya?ml$/.test(f) && (!alleen || f.startsWith(alleen))).sort();
  if (!files.length) { console.log('Geen posts gevonden.'); return; }
  const browser = await chromium.launch(); const page = await browser.newPage();
  const { breedte: w, hoogte: h } = brand.formaten.linkedin;
  await page.setViewportSize({ width: w, height: h });
  const out = path.join(root, 'output', 'linkedin'); fs.mkdirSync(out, { recursive: true });
  const tmp = path.join(root, '.render.html'); let fouten = 0;
  for (const file of files) {
    const id = file.replace(/\.ya?ml$/, '');
    try {
      const post = yaml.load(fs.readFileSync(path.join(root, 'posts', file), 'utf8'));
      const tpl = require(path.join(root, 'templates', post.sjabloon + '.js'));
      fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8"><style>${css(brand, root)}</style></head><body><div class="c">${tpl(post, brand)}${balk(brand, root)}</div></body></html>`);
      await page.goto('file://' + tmp); await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(out, `${id}.png`) });
      console.log('✓', id);
    } catch (e) { fouten++; console.error('✗', id, '-', e.message); }
  }
  fs.rmSync(tmp, { force: true }); await browser.close();
  if (fouten) process.exit(1);
})();
