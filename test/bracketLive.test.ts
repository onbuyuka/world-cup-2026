import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  resolveBracket,
  KO_COLUMNS,
  KO_MATCHES,
} from '../utils/bracket';
import type { LiveMatch } from '../utils/liveTable';

// A knockout tie level after extra time is settled by a penalty shootout.
// TheSportsDB reports the goals level (e.g. 1–1) plus the shootout score in
// intHomeScoreExtra/intAwayScoreExtra, which we carry as hp/ap. The bracket must
// advance the shootout winner — regression test for penalty winners (e.g.
// Germany 1–1 Paraguay, Paraguay 4–3 on pens) failing to move to the next round.

/** A state whose R32 slots all resolve (winners, runners-up and thirds). */
function seededState() {
  const s = createInitialState();
  s.thirdPlaceQualifiers = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  return s;
}

/** The first R32 match whose both sides resolve to a concrete team. */
function firstDecidableR32(): { id: number; home: string; away: string } {
  const base = resolveBracket(seededState());
  for (const id of KO_COLUMNS[0].ids) {
    const m = base.matches[id];
    if (m?.home && m?.away) return { id, home: m.home, away: m.away };
  }
  throw new Error('no fully-resolved R32 match');
}

/** A finished knockout fixture level 1–1 on goals, decided on penalties. */
const penMatch = (home: string, away: string, hp: number, ap: number): LiveMatch => ({
  id: 'pen-test',
  date: '2026-06-29', // >= KNOCKOUT_START_DATE
  round: '32',
  homeId: home,
  awayId: away,
  home,
  away,
  hs: 1,
  as: 1,
  hp,
  ap,
  status: 'finished',
  rawStatus: 'AP',
});

describe('resolveBracket: penalty-shootout winner advances', () => {
  it('advances the team that won on penalties (level on goals)', () => {
    const { id, home, away } = firstDecidableR32();
    // Goals 1–1; the away team wins the shootout 4–2.
    const resolved = resolveBracket(seededState(), [penMatch(home, away, 2, 4)]);
    expect(resolved.matches[id].winner).toBe(away);
  });

  it('respects home/away orientation from the live feed', () => {
    const { id, home, away } = firstDecidableR32();
    // Same fixture reported with the teams swapped; the away team still wins 4–2.
    const resolved = resolveBracket(seededState(), [penMatch(away, home, 4, 2)]);
    expect(resolved.matches[id].winner).toBe(away);
  });

  it('carries the shootout winner into the next round', () => {
    const { id, home, away } = firstDecidableR32();
    const resolved = resolveBracket(seededState(), [penMatch(home, away, 2, 4)]);
    const parent = KO_MATCHES.find(
      (m) =>
        (m.home.kind === 'matchWinner' && m.home.match === id) ||
        (m.away.kind === 'matchWinner' && m.away.match === id),
    );
    expect(parent, 'R32 match should feed a next-round match').toBeDefined();
    const next = resolved.matches[parent!.id];
    expect([next.home, next.away]).toContain(away);
  });

  it('stays undecided when level on goals and no shootout score is known', () => {
    const { id, home, away } = firstDecidableR32();
    const noPens: LiveMatch = { ...penMatch(home, away, 2, 4), hp: null, ap: null };
    const resolved = resolveBracket(seededState(), [noPens]);
    expect(resolved.matches[id].winner).toBeNull();
  });
});
