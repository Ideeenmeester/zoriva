# zoriva-socials

De LinkedIn-content van Zoriva op één plek: tekst, beeld, planning en de export naar Metricool. Elk bestand in `posts/` is één complete post. GitHub maakt er automatisch een beeld van (1200×627, Zoriva-huisstijl, origineel logo), controleert de regels, publiceert een overzichtspagina en zet de Metricool-planning klaar.

Dit project staat los van zzpinhetmkb. Alleen de werkwijze is hetzelfde.

## Zo loopt een post van idee tot LinkedIn

1. **Contentverzoek.** Maak een issue met het sjabloon *Nieuwe post*: onderwerp, doel, doelgroep, reeks en eventueel een datum.
2. **Schrijven.** Claude schrijft de post en het beeld en zet ze in een nieuwe branch met een pull request.
3. **Review in de PR.** De Action draait de controle en rendert de beelden. Daarna zet hij alle beelden en teksten als reactie in de PR. Fout gevonden? Dan faalt de Action en wordt er niets samengevoegd.
4. **Goedkeuren.** Keur de PR goed en voeg hem samen. Op `main` worden de beelden opnieuw gemaakt, en de overzichtspagina en `output/metricool.json` worden bijgewerkt.
5. **Inplannen.** Claude plant de goedgekeurde posts definitief in, in Metricool-brand Zoriva (blogId 5128723), alleen op LinkedIn. Bulkimport via `output/metricool.csv` kan ook.

## Vaste regels (de controle bewaakt ze)

- Alleen LinkedIn. Elke post heeft een eigen beeld met weinig tekst: een kop, hooguit 3 labels en een korte kicker.
- Open met een sterke hook en begin nooit flauw. De tekst telt 70 tot 140 woorden en is een vloeiend verhaal, dus geen opsomming en geen hakkelige korte zinnen.
- De spreektaal is je, jij en jouw, nooit u of uw.
- Geen link, url, hashtags of emoji in de tekst. De laatste regel is exact: **Bekijk onze website.**
- Geen AI-stijl. Dat betekent:
  - geen gedachtestreepjes
  - alleen de rechte apostrof (')
  - geen vaste afsluiters zoals "Ik ben benieuwd", "Mijn vraag:" of "Herkenbaar?"
  - niet steeds "Niet X. Maar Y."
- Labels in gewone letters, alleen uit `kernwoorden` in `brand/brand.yml`.
- Juridisch precies. Feiten over Wtta, Wet DBA, de Zelfstandigenwet, btw, Wkkgz of BIG eerst nagaan bij de overheid. Geen garanties en geen boetebedragen zonder officiële bron.
- Bedragen alleen als ze in `prijzen.toegestaan` staan. Oude prijzen zet je in `prijzen.verouderd`, dan keurt de controle ze af.
- Twee reeksen, elk met een eigen ritme. Elke volgende post in een reeks komt een uur later, tussen 08:00 en 20:00, en na 20:00 begint het weer om 08:00.
  - `risico`: risico en urgentie, op ma, wo en vr, start 08:00
  - `gerust`: het geruststellende alternatief, op di en do, start 10:00. Rechtstreeks, zonder gezag, zonder strijkstok, transparant, met respect voor opdrachtgever en zzp'er.
- Advertentieposts krijgen `advertentie: true` en geen datum of tijd.
- Het logo wordt **nooit** aangepast. De controle vergelijkt het bestand met een vingerafdruk (`logo_sha256`).

## Een post-bestand

```yaml
nr: 7
datum: "2026-11-10"
tijd: "12:00"
reeks: gerust            # risico | gerust
doelgroep: zelfstandigen # opdrachtgevers | zelfstandigen | sector | beide
onderwerp: "Jij onderhandelt, jij factureert, jij houdt alles"
linkedin: |
  Openingszin met een sterke hook ...

  Bekijk onze website.
sjabloon: twee-kanten
kicker: Voor zelfstandigen
kop: "Jouw tarief,\n*helemaal van jou*"
labels: [autonomie, rechtstreeks, tarief]
```

`*woord*` licht een woord uit. `\n` zet de rest van de kop op een nieuwe regel. Met `kopgrootte: 64` maak je een lange kop kleiner.

## Sjablonen

| Sjabloon | Waarvoor | Extra velden | Voorbeeld |
| --- | --- | --- | --- |
| `statement` | Eén sterke uitspraak, diagonaal zoals de hero | `thema: split / donker / licht` | `posts/03-...` |
| `groot-getal` | Een getal of datum dat opvalt | `getal`, `figuur: verbinding` | `posts/02-...` |
| `tijdlijn` | Data of stappen op een rij | `stappen: [{datum, tekst}]` | `posts/01-...` |
| `vergelijking` | Twee kolommen, rechts uitgelicht | `links`, `rechts: {titel, regels}` | `posts/10-...` |
| `doorgestreept` | Wat je niet meer betaalt | `items` | `posts/05-...` |
| `checklist` | Afvinklijst in een witte kaart | `items` | `posts/12-...` |
| `twee-kanten` | Opdrachtgever en zelfstandige rechtstreeks verbonden | `links`, `rechts` | `posts/07-...` |

## Wat GitHub automatisch doet

- **Controle als poortwachter.** De workflow *Controle, beelden en overzicht* draait bij elke wijziging in `posts/`, `templates/`, `brand/` of `scripts/`. Hij stopt bij de eerste regelovertreding, zodat er niets fouts doorkomt.
- **Beelden.** Na de controle komen de beelden in `output/linkedin/`. Ze staan ook als zip onder Actions.
- **Overzichtspagina.** GitHub Pages toont alle posts met beeld, datum, tijd, kopieerknop en filters per maand, reeks en doelgroep. Je zet het eenmalig aan via *Settings → Pages → Source: GitHub Actions*. De link is daarna `https://ideeenmeester.github.io/zoriva/`.
- **Pull requests.** De beelden van alle gewijzigde posts verschijnen als reactie in de PR.
- **Metricool-export.** Dit levert `output/metricool.json` op: per post de tekst, de openbare raw-url van het beeld en de datum en tijd in Europe/Amsterdam met de juiste zomer- of wintertijd. Daarnaast komt er `output/metricool.csv` voor de bulkimport.
- **n8n (optioneel).** Zet het geheim `N8N_WEBHOOK_URL` en start daarna *Planning naar n8n* onder Actions.

Openbare link van een beeld: `https://raw.githubusercontent.com/Ideeenmeester/zoriva/main/output/linkedin/<bestandsnaam>.png`

## Lokaal draaien (optioneel)

```bash
npm install
npx playwright install chromium
npm run controle            # regels controleren, maakt output/planning.csv
npm run render              # alle beelden
npm run render:een -- 05    # alleen posts die met 05 beginnen
npm run overzicht           # overzichtspagina in site/
npm run metricool           # Metricool-payload
```

Lettertype: Poppins (SIL Open Font License 1.1), zie `brand/fonts/`.
