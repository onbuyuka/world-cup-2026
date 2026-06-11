// Fetches 2026 FIFA World Cup results from TheSportsDB (free public key "123")
// and writes a compact, normalized snapshot to public/liveResults.json.
//
// Why a script (run by a GitHub Action) instead of fetching in the browser?
//  - The site is a static GitHub Pages app, and TheSportsDB's free tier
//    rate-limits bursts (a quick run of ~40 day-calls trips a 429, which the
//    browser surfaces as a CORS error). Running server-side with spaced
//    requests is reliable, keeps one fetch for all visitors, and needs no
//    secret (the "123" key is public). The app just reads the JSON same-origin.
//
// Usage:  node scripts/fetchLiveResults.mjs
// Output: public/liveResults.json  { updated, season, source, matches: [...] }

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const LEAGUE_ID = 4429; // TheSportsDB "FIFA World Cup" (Soccer)
const SEASON = '2026';
const KEY = '123';
const BASE = `https://www.thesportsdb.com/api/v1/json/${KEY}`;
const FIRST_DAY = '2026-06-11';
const LAST_DAY = '2026-07-19';
const GAP_MS = 2600; // ~23 req/min, under TheSportsDB's 30/min free limit

const __dirname = dirname(fileURLToPath(import.meta.url));
// Output path: defaults to public/liveResults.json for local/dev builds; the
// auto-refresh GitHub Action overrides it (LIVE_OUT) to write straight to the
// gh-pages branch root so the live site updates without a full rebuild.
const OUT = process.env.LIVE_OUT
  ? resolve(process.env.LIVE_OUT)
  : resolve(__dirname, '..', 'public', 'liveResults.json');

// TheSportsDB country spelling (normalized) -> our team id. Anything not listed
// is mapped by normalizing the name itself (e.g. "Brazil" -> "brazil").
const ALIASES = {
  southafrica: 'south-africa',
  southkorea: 'south-korea',
  czechrepublic: 'czechia',
  czechia: 'czechia',
  bosniaherzegovina: 'bosnia-and-herzegovina',
  bosniaandherzegovina: 'bosnia-and-herzegovina',
  usa: 'usa',
  unitedstates: 'usa',
  unitedstatesofamerica: 'usa',
  turkey: 'turkiye',
  turkiye: 'turkiye',
  ivorycoast: 'ivory-coast',
  cotedivoire: 'ivory-coast',
  newzealand: 'new-zealand',
  capeverde: 'cape-verde',
  saudiarabia: 'saudi-arabia',
  drcongo: 'dr-congo',
  democraticrepublicofthecongo: 'dr-congo',
  congodr: 'dr-congo',
  curacao: 'curacao',
};

// Our 48 team ids (used to accept a direct normalized-name match).
const TEAM_IDS = new Set([
  'mexico', 'south-africa', 'south-korea', 'czechia', 'canada',
  'bosnia-and-herzegovina', 'qatar', 'switzerland', 'brazil', 'morocco',
  'haiti', 'scotland', 'usa', 'paraguay', 'australia', 'turkiye', 'germany',
  'curacao', 'ivory-coast', 'ecuador', 'netherlands', 'japan', 'sweden',
  'tunisia', 'belgium', 'egypt', 'iran', 'new-zealand', 'spain', 'cape-verde',
  'saudi-arabia', 'uruguay', 'france', 'senegal', 'iraq', 'norway', 'argentina',
  'algeria', 'austria', 'jordan', 'portugal', 'dr-congo', 'uzbekistan',
  'colombia', 'england', 'croatia', 'ghana', 'panama',
]);

const norm = (s) =>
  (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

function toTeamId(name) {
  const n = norm(name);
  if (ALIASES[n]) return ALIASES[n];
  if (TEAM_IDS.has(n)) return n; // e.g. "brazil"
  // hyphenated ids whose normalized form drops the hyphen
  const hy = [...TEAM_IDS].find((id) => norm(id) === n);
  return hy || null;
}

function normStatus(raw) {
  const s = (raw || '').toUpperCase();
  if (['FT', 'AET', 'PEN', 'AP', 'MATCH FINISHED', 'FINISHED'].includes(s)) return 'finished';
  if (/^\d+'?$/.test(s) || ['1H', '2H', 'HT', 'ET', 'LIVE', 'P', 'IN PROGRESS', 'BREAK'].includes(s))
    return 'live';
  return 'scheduled';
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getDay(date) {
  const url = `${BASE}/eventsday.php?d=${date}&l=${LEAGUE_ID}`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'wc2026-bracket/1.0' } });
      if (res.status === 429) {
        await sleep(GAP_MS * attempt * 2);
        continue;
      }
      if (!res.ok) return [];
      const json = await res.json();
      return json?.events || [];
    } catch {
      await sleep(GAP_MS * attempt);
    }
  }
  return [];
}

function* eachDay(first, last) {
  for (let t = Date.parse(first + 'T00:00:00Z'); t <= Date.parse(last + 'T00:00:00Z'); t += 86400000) {
    yield new Date(t).toISOString().slice(0, 10);
  }
}

async function main() {
  const matches = [];
  const unmapped = new Set();
  let scanned = 0;

  for (const day of eachDay(FIRST_DAY, LAST_DAY)) {
    const events = await getDay(day);
    scanned++;
    for (const e of events) {
      const homeId = toTeamId(e.strHomeTeam);
      const awayId = toTeamId(e.strAwayTeam);
      if (!homeId) unmapped.add(e.strHomeTeam);
      if (!awayId) unmapped.add(e.strAwayTeam);
      const hs = e.intHomeScore == null || e.intHomeScore === '' ? null : Number(e.intHomeScore);
      const as = e.intAwayScore == null || e.intAwayScore === '' ? null : Number(e.intAwayScore);
      matches.push({
        id: e.idEvent || null,
        date: e.dateEvent || day,
        round: e.intRound || null,
        homeId,
        awayId,
        home: e.strHomeTeam || null,
        away: e.strAwayTeam || null,
        hs,
        as,
        status: normStatus(e.strStatus),
        rawStatus: e.strStatus || null,
        ts: e.strTimestamp || null,
      });
    }
    await sleep(GAP_MS);
  }

  // Stable ordering (date, then numeric event id) so identical data always
  // serializes identically — that keeps the no-change check below reliable and
  // avoids noisy commits from same-day matches arriving in a different order.
  const idNum = (m) => (m.id != null && /^\d+$/.test(String(m.id)) ? Number(m.id) : Infinity);
  matches.sort(
    (a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0) || idNum(a) - idNum(b),
  );

  // Skip rewriting (and so avoid an empty commit) when only the timestamp would
  // change — i.e. the match data is byte-for-byte identical to what's on disk.
  const matchesJson = JSON.stringify(matches);
  if (existsSync(OUT)) {
    try {
      const prev = JSON.parse(readFileSync(OUT, 'utf8'));
      if (JSON.stringify(prev.matches ?? []) === matchesJson) {
        console.log(`No change (${matches.length} matches) -> left ${OUT} untouched`);
        if (unmapped.size) console.warn('Unmapped team names:', [...unmapped].join(', '));
        return;
      }
    } catch {
      /* fall through and rewrite */
    }
  }

  const payload = {
    updated: new Date().toISOString(),
    season: SEASON,
    source: 'TheSportsDB',
    leagueId: LEAGUE_ID,
    matchCount: matches.length,
    matches,
  };

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(payload, null, 2) + '\n');

  const finished = matches.filter((m) => m.status === 'finished').length;
  console.log(
    `Scanned ${scanned} days · ${matches.length} matches (${finished} finished) -> ${OUT}`,
  );
  if (unmapped.size) console.warn('Unmapped team names:', [...unmapped].join(', '));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
