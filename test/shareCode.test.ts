import { describe, it, expect } from 'vitest';
import { encodeBracket, decodeBracket } from '../utils/shareCode';
import {
  createInitialState,
  resolveBracket,
  championOf,
  KO_MATCHES,
} from '../utils/bracket';
import type { GroupId, GroupStanding } from '../types';

// The share code packs a whole prediction into a URL with no backend, so the
// encode → decode round-trip must be exact, or shared links would corrupt
// brackets.

const ALL_GROUPS: GroupId[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

/** A prediction with reordered groups, 8 thirds and a full champion path. */
function buildFullPrediction() {
  const s = createInitialState();
  // Reorder a few groups (reverse their draw order).
  s.groups.A = [...s.groups.A].reverse() as GroupStanding;
  s.groups.F = [...s.groups.F].reverse() as GroupStanding;
  s.groups.L = [...s.groups.L].reverse() as GroupStanding;
  // Choose 8 best third-placed groups.
  s.thirdPlaceQualifiers = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  // Pick the home side of every knockout match, progressively, so the whole
  // bracket resolves to a champion.
  const koIds = KO_MATCHES.map((m) => m.id).sort((a, b) => a - b);
  for (const id of koIds) {
    const rm = resolveBracket(s).matches[id];
    if (rm?.home) s.winners[id] = rm.home;
  }
  return s;
}

describe('shareCode round-trip', () => {
  it('preserves an empty prediction', () => {
    const s = createInitialState();
    const back = decodeBracket(encodeBracket(s));
    expect(back).not.toBeNull();
    expect(back!.groups).toEqual(s.groups);
    expect(back!.thirdPlaceQualifiers).toEqual([]);
  });

  it('preserves group orders and thirds exactly', () => {
    const s = buildFullPrediction();
    const back = decodeBracket(encodeBracket(s))!;
    expect(back.groups).toEqual(s.groups);
    expect([...back.thirdPlaceQualifiers].sort()).toEqual(
      [...s.thirdPlaceQualifiers].sort(),
    );
  });

  it('preserves the knockout path and champion', () => {
    const s = buildFullPrediction();
    const back = decodeBracket(encodeBracket(s))!;
    expect(back.winners).toEqual(s.winners);
    expect(championOf(resolveBracket(back))).toBe(championOf(resolveBracket(s)));
    expect(championOf(resolveBracket(back))).toBeTruthy();
  });

  it('is idempotent (re-encoding a decoded code is stable)', () => {
    const code = encodeBracket(buildFullPrediction());
    expect(encodeBracket(decodeBracket(code)!)).toBe(code);
  });

  it('produces a compact URL-safe code', () => {
    const code = encodeBracket(buildFullPrediction());
    expect(code).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(code.length).toBeLessThan(48);
  });

  it('rejects malformed codes', () => {
    expect(decodeBracket('')).toBeNull();
    expect(decodeBracket('!!!notbase64!!!')).toBeNull();
    expect(decodeBracket('AAAA')).toBeNull(); // too short / wrong version
  });

  it('covers all 12 groups in encoding', () => {
    const s = createInitialState();
    expect(Object.keys(s.groups).sort()).toEqual([...ALL_GROUPS].sort());
  });
});
