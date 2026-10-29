// Stuurt output/metricool.json naar een n8n-webhook (optioneel). Leest de url uit N8N_WEBHOOK_URL.
const fs = require('fs'), path = require('path');
const url = process.env.N8N_WEBHOOK_URL;
if (!url) { console.log('Geen N8N_WEBHOOK_URL ingesteld, niets verstuurd.'); process.exit(0); }
const posts = JSON.parse(fs.readFileSync(path.join(__dirname, '../output/metricool.json'), 'utf8'));
fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ bron: 'zoriva-socials', posts }) })
  .then(r => { console.log(`n8n antwoordde ${r.status} op ${posts.length} posts`); if (!r.ok) process.exit(1); })
  .catch(e => { console.error('Versturen mislukt:', e.message); process.exit(1); });
