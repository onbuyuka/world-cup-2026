import type { GroupId } from '../types';
import { lookupThirdPlaceTable } from '../data/thirdPlaceTable';

// ---------------------------------------------------------------------------
// Best-third-placed-team allocation for the Round of 32.
//
// FIFA rule (2026): the top two of each group plus the eight best third-placed
// teams advance. Eight Round-of-32 matches put a group winner against a third-
// placed team, and each of those matches may only receive a third-placed team
// from a fixed set of groups (below).
//
// The exact slotting for each of the 495 possible combinations (12 choose 8)
// is published in Annex C of the FIFA regulations. We use that table verbatim
// (see data/thirdPlaceTable.ts) so the bracket matches FIFA exactly. The
// deterministic solver below is kept only as a safety fallback in case a
// combination is ever missing from the table; it respects every allowed-group
// constraint but may pick a different valid permutation where Annex C leaves a
// genuine choice.
// ---------------------------------------------------------------------------

/** Winner-vs-third matches and the groups each slot may receive. */
export const THIRD_PLACE_SLOTS: { match: number; winner: GroupId; allow: GroupId[] }[] = [
  { match: 74, winner: 'E', allow: ['A', 'B', 'C', 'D', 'F'] },
  { match: 77, winner: 'I', allow: ['C', 'D', 'F', 'G', 'H'] },
  { match: 79, winner: 'A', allow: ['C', 'E', 'F', 'H', 'I'] },
  { match: 80, winner: 'L', allow: ['E', 'H', 'I', 'J', 'K'] },
  { match: 81, winner: 'D', allow: ['B', 'E', 'F', 'I', 'J'] },
  { match: 82, winner: 'G', allow: ['A', 'E', 'H', 'I', 'J'] },
  { match: 85, winner: 'B', allow: ['E', 'F', 'G', 'I', 'J'] },
  { match: 87, winner: 'K', allow: ['D', 'E', 'I', 'J', 'L'] },
];

/**
 * Assign each qualifying third-placed group to one winner-vs-third match,
 * using FIFA's exact Annex C table, falling back to the constraint solver only
 * if the combination is somehow not found.
 * @param qualifiers exactly 8 distinct group ids whose third-placed team advances
 * @returns map of match id -> group id (whose 3rd-placed team plays there),
 *          or null if the combination is invalid (not 8 distinct groups).
 */
export function assignThirdPlaces(
  qualifiers: GroupId[],
): Record<number, GroupId> | null {
  const groups = Array.from(new Set(qualifiers));
  if (groups.length !== 8) return null;
  return lookupThirdPlaceTable(groups) ?? assignThirdPlacesBySolver(groups);
}

/**
 * Deterministic exact-cover fallback. Assigns groups to slots respecting every
 * allowed-group constraint (most-constrained-slot first, alphabetical order).
 */
export function assignThirdPlacesBySolver(
  qualifiers: GroupId[],
): Record<number, GroupId> | null {
  const groups = Array.from(new Set(qualifiers));
  if (groups.length !== 8) return null;

  const remaining = new Set(groups);
  const result: Record<number, GroupId> = {};

  // Order slots by how many candidates each currently has (MRV heuristic) and
  // recurse; candidates are tried in alphabetical order for determinism.
  const solve = (slots: typeof THIRD_PLACE_SLOTS): boolean => {
    if (slots.length === 0) return remaining.size === 0;

    let bestIdx = 0;
    let bestCandidates: GroupId[] | null = null;
    slots.forEach((slot, idx) => {
      const candidates = slot.allow
        .filter((g) => remaining.has(g))
        .sort();
      if (bestCandidates === null || candidates.length < bestCandidates.length) {
        bestCandidates = candidates;
        bestIdx = idx;
      }
    });

    const slot = slots[bestIdx];
    const rest = slots.filter((_, i) => i !== bestIdx);
    for (const g of bestCandidates ?? []) {
      result[slot.match] = g;
      remaining.delete(g);
      if (solve(rest)) return true;
      remaining.add(g);
      delete result[slot.match];
    }
    return false;
  };

  return solve(THIRD_PLACE_SLOTS) ? result : null;
}
