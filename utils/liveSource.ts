import type { LiveMatch, LiveStatus } from './liveTable';

// Client-side live fetch (Option B): polls TheSportsDB's "events on a day"
// endpoint directly from the browser for *today's* World Cup matches, so an
// open tab updates within ~1 minute — much fresher than waiting for the
// scheduled snapshot. This mirrors scripts/fetchLiveResults.mjs so the two
// sources are interchangeable; the committed snapshot remains the reliable
// baseline and this merges on top of it (and silently no-ops if the request
// fails or is rate-limited).

const LEAGUE_ID = 4429; // TheSportsDB "FIFA World Cup" (Soccer)
const KEY = '123'; // public free key
const BASE = `https://www.thesportsdb.com/api/v1/json/${KEY}`;

// TheSportsDB country spelling (normalized) -> our team id. Mirrors the script.
const ALIASES: Record<string, string> = {
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

const norm = (s: string): string =>
  (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

function toTeamId(name: string): string | null {
  const n = norm(name);
  if (ALIASES[n]) return ALIASES[n];
  if (TEAM_IDS.has(n)) return n;
  for (const id of TEAM_IDS) if (norm(id) === n) return id;
  return null;
}

function normStatus(raw: string): LiveStatus {
  const s = (raw || '').toUpperCase();
  if (['FT', 'AET', 'PEN', 'AP', 'MATCH FINISHED', 'FINISHED'].includes(s)) return 'finished';
  if (/^\d+\+?'?$/.test(s) || ['1H', '2H', 'HT', 'ET', 'BT', 'LIVE', 'P', 'IN PROGRESS', 'BREAK'].includes(s))
    return 'live';
  return 'scheduled';
}

function num(v: unknown): number | null {
  return v == null || v === '' ? null : Number(v);
}

/** UTC yyyy-mm-dd for "today" and "yesterday" (matches can span midnight UTC). */
function recentDays(): string[] {
  const now = Date.now();
  return [now, now - 86400000].map((t) => new Date(t).toISOString().slice(0, 10));
}

interface SportsDbEvent {
  idEvent?: string;
  dateEvent?: string;
  intRound?: string;
  strHomeTeam?: string;
  strAwayTeam?: string;
  intHomeScore?: string | number | null;
  intAwayScore?: string | number | null;
  strStatus?: string;
  strTimestamp?: string;
}

async function fetchDay(date: string): Promise<LiveMatch[]> {
  const res = await fetch(`${BASE}/eventsday.php?d=${date}&l=${LEAGUE_ID}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json()) as { events?: SportsDbEvent[] };
  const events = json?.events ?? [];
  const out: LiveMatch[] = [];
  for (const e of events) {
    out.push({
      id: e.idEvent ?? null,
      date: e.dateEvent ?? date,
      round: e.intRound ?? null,
      homeId: toTeamId(e.strHomeTeam ?? ''),
      awayId: toTeamId(e.strAwayTeam ?? ''),
      home: e.strHomeTeam ?? null,
      away: e.strAwayTeam ?? null,
      hs: num(e.intHomeScore),
      as: num(e.intAwayScore),
      status: normStatus(e.strStatus ?? ''),
      rawStatus: e.strStatus ?? null,
      ts: e.strTimestamp ?? null,
    });
  }
  return out;
}

/**
 * Fetch today's (and yesterday's, for late kickoffs) World Cup matches live.
 * Returns [] on any failure so callers can fall back to the baseline snapshot.
 */
export async function fetchTodayLive(): Promise<LiveMatch[]> {
  try {
    const days = recentDays();
    const results = await Promise.all(
      days.map((d) => fetchDay(d).catch(() => [] as LiveMatch[])),
    );
    return results.flat();
  } catch {
    return [];
  }
}

/**
 * Merge fresh live matches over a baseline set, keyed by event id (falling back
 * to a team-pair + date key). Fresh entries win; baseline fills the rest.
 */
export function mergeLive(baseline: LiveMatch[], fresh: LiveMatch[]): LiveMatch[] {
  if (fresh.length === 0) return baseline;
  const keyOf = (m: LiveMatch) =>
    m.id ? `id:${m.id}` : `pair:${m.date}:${m.homeId ?? m.home}:${m.awayId ?? m.away}`;
  const map = new Map<string, LiveMatch>();
  for (const m of baseline) map.set(keyOf(m), m);
  for (const m of fresh) map.set(keyOf(m), m);
  return [...map.values()].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}
