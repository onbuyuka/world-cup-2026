// Live World Cup results: shared types + pure helpers used by the live store,
// the bracket (live standings), hover cards and team pages.
//
// The snapshot file (public/liveResults.json) is produced by
// scripts/fetchLiveResults.mjs from TheSportsDB. Standings are computed only
// from FINISHED matches; in-progress scores are shown but never awarded points
// until full time, so the table stays stable.

import { translate, type Lang } from './i18n';

export type LiveStatus = 'scheduled' | 'live' | 'finished';

export interface LiveMatch {
  id: string | null;
  /** yyyy-mm-dd */
  date: string;
  /** TheSportsDB round ("1".."3" for the group stage). */
  round: string | null;
  /** Our team ids (null if a name could not be mapped). */
  homeId: string | null;
  awayId: string | null;
  /** Raw names from the source (for display/debugging). */
  home: string | null;
  away: string | null;
  /** Scores from each side's perspective (null until known). */
  hs: number | null;
  as: number | null;
  status: LiveStatus;
  rawStatus?: string | null;
  ts?: string | null;
}

export interface LiveResults {
  updated: string;
  season: string;
  source: string;
  leagueId?: number;
  matchCount?: number;
  matches: LiveMatch[];
}

export interface TeamStat {
  teamId: string;
  pld: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
  /** How many of the counted matches are still in progress (provisional). */
  inPlay: number;
}

const emptyStat = (teamId: string): TeamStat => ({
  teamId,
  pld: 0,
  w: 0,
  d: 0,
  l: 0,
  gf: 0,
  ga: 0,
  gd: 0,
  pts: 0,
  inPlay: 0,
});

/** True once a match has a usable final score. */
export function isPlayed(m: LiveMatch): boolean {
  return (m.status === 'finished' || m.status === 'live') && m.hs != null && m.as != null;
}

/** The most relevant live match for an unordered pair of teams. */
export function resultForPair(
  matches: LiveMatch[],
  aId: string,
  bId: string,
  minDate?: string,
): LiveMatch | undefined {
  const cands = matches.filter(
    (m) =>
      ((m.homeId === aId && m.awayId === bId) || (m.homeId === bId && m.awayId === aId)) &&
      (!minDate || m.date >= minDate),
  );
  if (cands.length === 0) return undefined;
  const rank = (m: LiveMatch) => (m.status === 'finished' ? 0 : m.status === 'live' ? 1 : 2);
  return [...cands].sort((x, y) => rank(x) - rank(y) || (x.date < y.date ? -1 : 1))[0];
}

/** All matches involving a team, oldest first. */
export function matchesForTeam(matches: LiveMatch[], teamId: string): LiveMatch[] {
  return matches
    .filter((m) => m.homeId === teamId || m.awayId === teamId)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

/**
 * Build a points table from matches played *among* `teamIds`. Counts both
 * finished and in-progress (live) matches that have a score, so the table
 * reflects current live points; `inPlay` records how many of a team's counted
 * matches are still live, letting the UI flag provisional points.
 */
export function computeGroupTable(
  teamIds: string[],
  matches: LiveMatch[],
): Record<string, TeamStat> {
  const table: Record<string, TeamStat> = {};
  for (const id of teamIds) table[id] = emptyStat(id);
  const set = new Set(teamIds);

  for (const m of matches) {
    if (!m.homeId || !m.awayId) continue;
    if (!set.has(m.homeId) || !set.has(m.awayId)) continue;
    if (!isPlayed(m)) continue; // finished OR live with both scores

    const home = table[m.homeId];
    const away = table[m.awayId];
    home.pld++;
    away.pld++;
    if (m.status === 'live') {
      home.inPlay++;
      away.inPlay++;
    }
    home.gf += m.hs!;
    home.ga += m.as!;
    away.gf += m.as!;
    away.ga += m.hs!;
    if (m.hs! > m.as!) {
      home.w++;
      away.l++;
      home.pts += 3;
    } else if (m.hs! < m.as!) {
      away.w++;
      home.l++;
      away.pts += 3;
    } else {
      home.d++;
      away.d++;
      home.pts++;
      away.pts++;
    }
  }
  for (const id of teamIds) table[id].gd = table[id].gf - table[id].ga;
  return table;
}

export interface LiveGroupView {
  /** Team ids ordered by the live table; ties keep the predicted order. */
  order: string[];
  table: Record<string, TeamStat>;
  /** Matches counted within the group (finished + in-progress). */
  playedMatches: number;
}

/**
 * Order a group's predicted standing by real results. Points, then goal
 * difference, then goals for; teams not yet separated keep the user's
 * predicted order, so the bracket stays sensible before/while games are played.
 */
export function orderGroupByLive(predicted: string[], matches: LiveMatch[]): LiveGroupView {
  const table = computeGroupTable(predicted, matches);
  const idx = (id: string) => predicted.indexOf(id);
  const order = [...predicted].sort((a, b) => {
    const A = table[a];
    const B = table[b];
    if (B.pts !== A.pts) return B.pts - A.pts;
    if (B.gd !== A.gd) return B.gd - A.gd;
    if (B.gf !== A.gf) return B.gf - A.gf;
    return idx(a) - idx(b);
  });
  const playedMatches = predicted.reduce((n, id) => n + table[id].pld, 0) / 2;
  return { order, table, playedMatches };
}

/** "2–1", or "—" if not yet played. */
export function scoreText(m: LiveMatch | undefined): string {
  if (!m || m.hs == null || m.as == null) return '—';
  return `${m.hs}–${m.as}`;
}

/**
 * Human-readable label for a live/just-finished match status. Maps
 * TheSportsDB's terse codes (1H, HT, 2H, ET, PEN…) to friendly text; a bare
 * minute like "67" becomes "67'". Falls back to a sensible default.
 */
export function liveStatusLabel(m: LiveMatch | undefined, lang: Lang = 'en'): string {
  if (!m) return '';
  const T = (k: Parameters<typeof translate>[1]) => translate(lang, k);
  const raw = (m.rawStatus || '').trim();
  if (m.status === 'finished') {
    if (/^(AET)$/i.test(raw)) return T('status.aet');
    if (/^(PEN|AP)$/i.test(raw)) return T('status.onPens');
    return T('status.ft');
  }
  if (m.status === 'live') {
    if (/^\d+\+?'?$/.test(raw)) return raw.replace(/'?$/, "'"); // "67" -> "67'"
    const up = raw.toUpperCase();
    const map: Record<string, Parameters<typeof translate>[1]> = {
      '1H': 'status.1h',
      '2H': 'status.2h',
      HT: 'status.ht',
      ET: 'status.et',
      BT: 'status.break',
      BREAK: 'status.break',
      P: 'status.pens',
      PEN: 'status.pens',
      LIVE: 'status.live',
      'IN PROGRESS': 'status.live',
    };
    return map[up] ? T(map[up]) : T('status.live');
  }
  return '';
}

/** Result (W/D/L) for `teamId` in match `m`, or null if not decided. */
export function resultFor(m: LiveMatch | undefined, teamId: string): 'W' | 'D' | 'L' | null {
  if (!m || m.hs == null || m.as == null) return null;
  const isHome = m.homeId === teamId;
  const mine = isHome ? m.hs : m.as;
  const theirs = isHome ? m.as : m.hs;
  if (mine > theirs) return 'W';
  if (mine < theirs) return 'L';
  return 'D';
}
