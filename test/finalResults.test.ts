import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  createInitialState,
  resolveBracket,
  resolveLiveBracket,
  championOf,
  KO_MATCHES,
} from '../utils/bracket';
import { orderGroupByLive, type LiveMatch } from '../utils/liveTable';
import { scorePrediction, POINTS } from '../utils/score';
import { encodeBracket, decodeBracket } from '../utils/shareCode';
import { GROUPS } from '../data/groups';
import type { GroupStanding } from '../types';

// Regression tests against the committed final-tournament snapshot: the live
// bracket must resolve all the way to the champion, and a prediction matching
// reality must earn the maximum score and survive a share-link round-trip.

const snapshot = JSON.parse(
  readFileSync(fileURLToPath(new URL('../public/liveResults.json', import.meta.url)), 'utf8'),
) as { matches: LiveMatch[] };
const matches = snapshot.matches;

const MAX_POINTS =
  GROUPS.length * (POINTS.groupWinner + POINTS.groupRunnerUp) +
  8 * POINTS.thirdAdvances +
  16 * POINTS.r32 +
  8 * POINTS.r16 +
  4 * POINTS.qf +
  2 * POINTS.sf +
  POINTS.thirdPlaceMatch +
  POINTS.champion;

/** A prediction that matches the real tournament exactly. */
function perfectPrediction() {
  const live = resolveLiveBracket(matches);
  const s = createInitialState();
  const views = GROUPS.map((g) => ({ id: g.id, view: orderGroupByLive(g.teamIds, matches) }));
  for (const { id, view } of views) s.groups[id] = view.order as GroupStanding;
  s.thirdPlaceQualifiers = views
    .map(({ id, view }) => ({ id, s: view.table[view.order[2]] }))
    .sort((a, b) => b.s.pts - a.s.pts || b.s.gd - a.s.gd || b.s.gf - a.s.gf || (a.id < b.id ? -1 : 1))
    .slice(0, 8)
    .map((e) => e.id);
  for (const m of KO_MATCHES) {
    const w = live.matches[m.id]?.winner;
    if (w) s.winners[m.id] = w;
  }
  return s;
}

describe('final tournament snapshot', () => {
  it('contains every one of the 104 matches, all finished', () => {
    expect(matches).toHaveLength(104);
    expect(matches.every((m) => m.status === 'finished')).toBe(true);
  });

  it('resolves every knockout match, with Spain as champion', () => {
    const live = resolveLiveBracket(matches);
    expect(KO_MATCHES.filter((m) => !live.matches[m.id]?.winner)).toEqual([]);
    expect(championOf(live)).toBe('spain');
  });

  it('awards the maximum score to a perfect prediction', () => {
    const s = perfectPrediction();
    expect(championOf(resolveBracket(s))).toBe('spain');
    const score = scorePrediction(s, matches);
    expect(score.possible).toBe(MAX_POINTS);
    expect(score.total).toBe(MAX_POINTS);
  });

  it('keeps every pick of a perfect prediction through a share link', () => {
    const s = perfectPrediction();
    const back = decodeBracket(encodeBracket(s))!;
    expect(back.groups).toEqual(s.groups);
    expect([...back.thirdPlaceQualifiers].sort()).toEqual([...s.thirdPlaceQualifiers].sort());
    expect(back.winners).toEqual(s.winners);
    expect(scorePrediction(back, matches).total).toBe(MAX_POINTS);
  });
});
