import type { BracketState, GroupId, GroupStanding, SlotRef } from '../types';
import { GROUPS } from '../data/groups';
import { MATCHES, MATCHES_BY_ID } from '../data/schedule';
import { assignThirdPlaces } from './thirdPlace';
import { resultForPair, type LiveMatch } from './liveTable';

/** All knockout matches (Round of 32 → Final). */
export const KO_MATCHES = MATCHES.filter((m) => m.stage !== 'Group');

/**
 * First day of the knockout stage. Used to ignore group-stage results when
 * matching a live knockout fixture by its team pair (two teams from the same
 * group could otherwise collide with their group meeting).
 */
export const KNOCKOUT_START_DATE = '2026-06-28';

const STORAGE_KEY = 'wc2026-bracket-v1';

/** Fresh state: group standings default to draw order, no picks yet. */
export function createInitialState(): BracketState {
  const groups = {} as Record<GroupId, GroupStanding>;
  for (const g of GROUPS) {
    groups[g.id] = [...g.teamIds] as GroupStanding;
  }
  return { groups, thirdPlaceQualifiers: [], winners: {}, liveOverrides: {}, liveWinners: {} };
}

export interface ResolvedMatch {
  home: string | null;
  away: string | null;
  winner: string | null;
}

export interface ResolvedBracket {
  thirdMap: Record<number, GroupId> | null;
  matches: Record<number, ResolvedMatch>;
}

/**
 * Resolve every knockout slot from the user's group standings, third-place
 * qualifiers and knockout winner picks. Returns the home/away/winner for each
 * knockout match (any of which may be null while still undecided).
 *
 * When `liveMatches` is supplied (Live mode), a knockout match with a decisive
 * real result auto-advances the actual winner — unless the user has set a
 * "what-if" pick in `state.winners`, which always takes precedence. Results
 * cascade automatically because resolution is recursive. Knockouts decided on
 * penalties (a draw after extra time) can't be inferred from the score alone,
 * so those stay undecided/pickable.
 */
export function resolveBracket(
  state: BracketState,
  liveMatches?: LiveMatch[],
): ResolvedBracket {
  const thirdMap =
    state.thirdPlaceQualifiers.length === 8
      ? assignThirdPlaces(state.thirdPlaceQualifiers)
      : null;

  const cache: Record<number, ResolvedMatch> = {};

  // Actual winner of a played knockout fixture between `home` and `away`, or
  // null if not played, drawn (penalties), or no live data.
  const liveWinner = (home: string | null, away: string | null): string | null => {
    if (!liveMatches || !home || !away) return null;
    const m = resultForPair(liveMatches, home, away, KNOCKOUT_START_DATE);
    if (!m || m.status !== 'finished' || m.hs == null || m.as == null || m.hs === m.as) {
      return null;
    }
    const homeIsHome = m.homeId === home;
    const homeGoals = homeIsHome ? m.hs : m.as;
    const awayGoals = homeIsHome ? m.as : m.hs;
    return homeGoals > awayGoals ? home : away;
  };

  const resolveRef = (ref: SlotRef, matchId: number): string | null => {
    switch (ref.kind) {
      case 'team':
        return ref.teamId;
      case 'winner':
        return state.groups[ref.group]?.[0] ?? null;
      case 'runnerUp':
        return state.groups[ref.group]?.[1] ?? null;
      case 'third': {
        const grp = thirdMap?.[matchId];
        return grp ? state.groups[grp]?.[2] ?? null : null;
      }
      case 'matchWinner':
        return resolveMatch(ref.match).winner;
      case 'matchLoser': {
        const m = resolveMatch(ref.match);
        if (!m.winner || !m.home || !m.away) return null;
        return m.winner === m.home ? m.away : m.home;
      }
    }
  };

  const resolveMatch = (id: number): ResolvedMatch => {
    if (cache[id]) return cache[id];
    cache[id] = { home: null, away: null, winner: null }; // guard
    const match = MATCHES_BY_ID[id];
    const home = resolveRef(match.home, id);
    const away = resolveRef(match.away, id);
    const pick = state.winners[id] ?? null;
    const validPick = pick && (pick === home || pick === away) ? pick : null;
    // User "what-if" pick wins; otherwise auto-advance a real decisive result.
    const winner = validPick ?? liveWinner(home, away);
    return (cache[id] = { home, away, winner });
  };

  for (const m of KO_MATCHES) resolveMatch(m.id);
  return { thirdMap, matches: cache };
}

/** The predicted champion (winner of the Final), or null. */
export const championOf = (b: ResolvedBracket): string | null =>
  b.matches[104]?.winner ?? null;

// --- Persistence ------------------------------------------------------------

export function loadState(): BracketState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as Partial<BracketState>;
    const base = createInitialState();
    return {
      groups: { ...base.groups, ...(parsed.groups ?? {}) },
      thirdPlaceQualifiers: parsed.thirdPlaceQualifiers ?? [],
      winners: parsed.winners ?? {},
      liveOverrides: parsed.liveOverrides ?? {},
      liveWinners: parsed.liveWinners ?? {},
      liveThirds: parsed.liveThirds,
    };
  } catch {
    return createInitialState();
  }
}

export function saveState(state: BracketState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / private-mode errors */
  }
}
