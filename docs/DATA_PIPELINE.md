# Data Completion Handbook (squads, photos, kits, form)

Working notes for populating team data in this app. Read this first if resuming.

## Project facts
- App: `c:\Users\onbuyuka\Documents\GitHub\world-cup-2026` — Vite + React 19 + TS, Tailwind CDN, HashRouter, base `/world-cup-2026/`.
- Dev server usually already running. Build: `npm --prefix "c:\Users\onbuyuka\Documents\GitHub\world-cup-2026" run build`.
- Browser page id for localhost app is shared in context; reuse it (do not open new unless needed).
- Validator: `npm run validate:table` (Annex C third-place table; keep passing).

## Where data lives
- `data/teams.ts` — 48 teams (metadata, group, rank, coach, mylineupsSlug). At bottom it MERGES:
  - `data/kits.ts` `KIT_OVERRIDES` → `t.kits` (DONE for all 48).
  - `data/squads.ts` `SQUADS` → `t.squad` (+ sets `dataVerified`) ONLY if no inline squad.
  - Argentina squad + recentForm are inline in `data/teams.ts` (do not overwrite).
- `types.ts` — `SquadPlayer { name, position:'GK'|'DF'|'MF'|'FW', club, number?, captain?, fmId? }`. `fmId` = mylineups photo id.
- `components/PlayerAvatar.tsx` — renders `https://mylineups.app/builder-assets/players/fm-<fmId>.webp`, falls back to kit-coloured number badge.

## Team id mapping (Wikipedia name → our id)
Most are lowercase-hyphenated. Non-obvious ones:
`Czech Republic→czechia`, `South Korea→south-korea`, `South Africa→south-africa`,
`United States→usa`, `Türkiye/Turkey→turkiye`, `Ivory Coast→ivory-coast`, `Curaçao→curacao`,
`DR Congo→dr-congo`, `Cape Verde→cape-verde`, `Bosnia and Herzegovina→bosnia-and-herzegovina`,
`New Zealand→new-zealand`, `Saudi Arabia→saudi-arabia`. Full list of slugs in `data/teams.ts`.

## PROVEN PIPELINE (browser-only; subagents CANNOT do this — Google + mylineups photos need a real browser)

### Step 1 — squad names + clubs + positions (ALL teams from ONE page)
Navigate `https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_squads`, then `page.evaluate`:
- Squad tables have header `[No., Pos., Player, DOB, Caps, Goals, Club]`.
- Per row: `c[0]`=number, `c[1]`=pos (strip leading digits → GK/DF/MF/FW), `c[2]`=player (may contain `(captain)`), `c[6]`=club.
- Team name = nearest preceding `h2/h3/h4` text (strip `[edit]`).
- Filter to the group's team names (`want=[...]`) to keep output small.

Extractor that works (returns names+clubs):
```js
page.evaluate(() => {
  const norm = s => (s||'').replace(/\s+/g,' ').trim();
  const want = ['Canada','Bosnia and Herzegovina','Qatar','Switzerland']; // change per group
  const out = {};
  for (const t of Array.from(document.querySelectorAll('table'))) {
    const head = norm(t.querySelector('tr')?.textContent||'');
    if (!/No\./.test(head) || !/Club/.test(head) || !/Pos/.test(head)) continue;
    let el = t, team = '';
    while (el && !team) { el = el.previousElementSibling; if (!el) break;
      if (/^H[234]$/.test(el.tagName)) team = norm(el.textContent).replace(/\[edit\]/i,'');
      else { const h = el.querySelector?.('h2,h3,h4'); if (h) team = norm(h.textContent).replace(/\[edit\]/i,''); } }
    if (!want.includes(team) || out[team]) continue;
    const players = [];
    for (const tr of Array.from(t.querySelectorAll('tr'))) {
      const c = Array.from(tr.querySelectorAll('th,td')); if (c.length < 7) continue;
      const num = norm(c[0].textContent); if (!/^\d+$/.test(num)) continue;
      players.push({ n:+num, pos: norm(c[1].textContent).replace(/[^A-Za-z]/g,''), name: norm(c[2].textContent), club: norm(c[6].textContent) });
    }
    if (players.length) out[team] = players;
  }
  return out;
});
```

### Step 2 — photo ids (per team) from mylineups
For each team slug, navigate `https://mylineups.app/world-cup-2026/teams/<slug>`, wait ~2s, `page.evaluate`:
```js
async function squad(slug){
  await page.goto('https://mylineups.app/world-cup-2026/teams/'+slug,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(2000);
  return page.evaluate(()=>{const out=[];const seen=new Set();
    for(const img of Array.from(document.querySelectorAll('img')).filter(i=>(i.currentSrc||i.src).includes('/players/fm-'))){
      const row=img.closest('li')||img.parentElement?.parentElement; const text=row?row.textContent.replace(/\s+/g,' ').trim():'';
      const m=(img.currentSrc||img.src).match(/fm-(\d+)\.webp/); const id=m?m[1]:null; if(!id||seen.has(id))continue; seen.add(id);
      const mm=text.match(/^(GK|DEF|MID|ATT)\s+(\d+)\s+(.+)$/); if(mm)out.push({num:+mm[2],fmId:id});}
    return out;});
}
```
Can loop a few slugs in one call (return `{slug:[...]}`).

### Step 3 — JOIN by shirt number
Match Wikipedia player (by `n`) to mylineups `{num→fmId}`. If a number has no fmId, omit `fmId` (PlayerAvatar shows number badge). Convert `pos` GK/DF/MF/FW (Wikipedia already uses these). Mark `captain:true` when Wikipedia name had `(captain)` (then strip it from the name).

### Step 4 — write to `data/squads.ts`
Add a `SQUADS['<id>'] = [ ... ]` block. Order players GK, DF, MF, FW. Keep clubs as Wikipedia gives them. Build to verify.

## Recent form (harder)
- Google text scraping is NOISY/unreliable at scale — do NOT ship guessed scores.
- Only Argentina has verified recentForm so far (inline in teams.ts).
- Options when doing form: per-team Wikipedia "Results"/recent fixtures table, or skip (UI already degrades gracefully with a "recent results unavailable" note + live link).

## Progress tracker
- [x] Group A: mexico, south-africa, south-korea, czechia (squads done, photos verified)
- [x] Group B: canada, bosnia-and-herzegovina, qatar, switzerland (squads done)
- [x] Group C: brazil, morocco, haiti, scotland (squads done)
- [x] Group D: usa, paraguay, australia, turkiye (squads done)
- [x] Group E: germany, curacao, ivory-coast, ecuador (squads done)
- [x] Group F: netherlands, japan, sweden, tunisia (squads done; tunisia #1,#24 no photo)
- [x] Group G: belgium, egypt, iran, new-zealand (squads done; egypt #9 no photo)
- [x] Group H: spain, cape-verde, saudi-arabia, uruguay (squads done)
- [x] Group I: france, senegal, iraq, norway (squads done; iraq #24 no photo)
- [x] Group J: argentina(DONE inline), algeria, austria, jordan (squads done; jordan #4,#22,#25 no photo)
- [x] Group K: portugal, dr-congo, uzbekistan, colombia (squads done)
- [x] Group L: england, croatia, ghana, panama (squads done; england photos verified in browser)
- [x] Recent form — ALL 47 teams in data/recentForm.ts + argentina inline (browser-verified on Germany)

## RECENT FORM (data/recentForm.ts) — DONE
Source: each team's English Wikipedia "X national football team" page. Recent matches render as
`table.tmpl-football-box-collapsible` (vevent microformat). Extractor (run via run_playwright_code,
browser-only — fetch/subagents can't read these): walk `#mw-content-text .mw-parser-output` in document
order tracking the current year from the most recent H2-H4 heading containing a 4-digit year; for each
football box read the date cell (handles BOTH "DD Month" and US "Month DD"), find the score row (td text
matching `d–d`), capture home/score/away. Subject team = the side appearing in the most boxes (auto-
handles name variants e.g. Turkey/Türkiye, Czech Republic/Czechia — no manual mapping needed). Score is
converted to the team's perspective (reverse if away), result W/D/L, competition normalized
(Friendly/WCQ/Nations League/FIFA Series/Gold Cup/Asian Cup/AFCON). Club warm-ups filtered
(`\bII\b|\bU2[0-3]\b|reserve|Union II`). Keep last 5. Merged in teams.ts like SQUADS.
Special article names: USA=United_States_men's_national_soccer_team, Canada=Canada_men%27s_national_soccer_team,
Australia=Australia_men%27s_national_soccer_team, New Zealand=New_Zealand_men's_national_football_team
(the plain title is a disambiguation page), Türkiye=Turkey_national_football_team,
Czechia=Czech_Republic_national_football_team, Ivory Coast=Ivory_Coast_national_football_team.
Sweden's main page has NO football boxes → use Sweden_men%27s_national_football_team_results_(2020–present).
Note: a few teams' latest recorded match is March 2026 (e.g. sweden, uruguay) — faithful to source, not fabricated.

## ALL 48 SQUADS COMPLETE
47 teams in data/squads.ts (26 each) + Argentina inline in teams.ts = 48. Build clean (66 modules). Verified in browser: south-korea + england load all 26 mylineups photos, correct names/clubs/numbers/captain. Players without a mylineups photo (number-badge fallback): tunisia #1 Chamakh, #24 Chikhaoui; egypt #9 Abdelkarim; iraq #24 Z.Ismail; jordan #4 Abu Dahab, #22 A.Al-Fakhouri, #25 Al-Dawoud.

## Verify after each group
1. `npm run build` (expect clean).
2. Browser: navigate `http://localhost:3000/world-cup-2026/#/team/<id>`, scroll, check player photos load (`naturalWidth>0`) and names/clubs correct.
