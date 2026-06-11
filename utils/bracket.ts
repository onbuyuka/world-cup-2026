import type { BracketState, GroupId, GroupStanding, SlotRef } from '../types';
import { GROUPS } from '../data/groups';
import { MATCHES, MATCHES_BY_ID } from '../data/schedule';
import { assignThirdPlaces } from './thirdPlace';

/** All knockout matches (Round of 32 → Final). */
export const KO_MATCHES = MATCHES.filter((m) => m.stage !== 'Group');

const STORAGE_KEY = 'wc2026-bracket-v1';

/** Fresh state: group standings default to draw order, no picks yet. */
export function createInitialState(): BracketState {
  const groups = {} as Record<GroupId, GroupStanding>;
  for (const g of GROUPS) {
    groups[g.id] = [...g.teamIds] as GroupStanding;
  }
  return { groups, thirdPlaceQualifiers: [], winners: {}, liveOverrides: {} };
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
 */
export function resolveBracket(state: BracketState): ResolvedBracket {
  const thirdMap =
    state.thirdPlaceQualifiers.length === 8
      ? assignThirdPlaces(state.thirdPlaceQualifiers)
      : null;

  const cache: Record<number, ResolvedMatch> = {};

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
    const winner = pick && (pick === home || pick === away) ? pick : null;
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
