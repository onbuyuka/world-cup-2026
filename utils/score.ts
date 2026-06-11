import type { BracketState, GroupId, GroupStanding } from '../types';
import { GROUP_IDS, GROUPS_BY_ID } from '../data/groups';
import { KO_MATCHES, resolveBracket } from './bracket';
import { computeGroupTable, type LiveMatch, type TeamStat } from './liveTable';

// Grade a saved prediction against real results. The "actual" world is derived
// from live matches: real group standings (once a group is complete) and real
// knockout winners (decisive results, auto-advanced). Points are awarded only
// for outcomes that have actually been decided, so the score climbs as the
// tournament progresses and is directly comparable between shared brackets.

export const POINTS = {
  groupWinner: 2,
  groupRunnerUp: 2,
  thirdAdvances: 2,
  // knockout: points for predicting the team that really advanced from a slot
  r32: 2,
  r16: 4,
  qf: 6,
  thirdPlaceMatch: 3,
  sf: 8,
  champion: 15,
} as const;

const KO_WEIGHT: Record<number, { label: string; pts: number }> = {};
for (const m of KO_MATCHES) {
  if (m.stage === 'Round of 32') KO_WEIGHT[m.id] = { label: 'R32', pts: POINTS.r32 };
  else if (m.stage === 'Round of 16') KO_WEIGHT[m.id] = { label: 'R16', pts: POINTS.r16 };
  else if (m.stage === 'Quarter-final') KO_WEIGHT[m.id] = { label: 'QF', pts: POINTS.qf };
  else if (m.stage === 'Semi-final') KO_WEIGHT[m.id] = { label: 'SF', pts: POINTS.sf };
  else if (m.stage === 'Third place')
    KO_WEIGHT[m.id] = { label: '3rd-place', pts: POINTS.thirdPlaceMatch };
  else if (m.stage === 'Final') KO_WEIGHT[m.id] = { label: 'Final', pts: POINTS.champion };
}

export interface ScoreBreakdown {
  total: number;
  /** Points available so far (sum of weights for decided outcomes). */
  possible: number;
  groupPoints: number;
  thirdsPoints: number;
  knockoutPoints: number;
  /** correct vs decided tallies for a friendly summary. */
  correct: number;
  decided: number;
  /** True once every group has finished all six matches. */
  groupStageComplete: boolean;
}

const empty: ScoreBreakdown = {
  total: 0,
  possible: 0,
  groupPoints: 0,
  thirdsPoints: 0,
  knockoutPoints: 0,
  correct: 0,
  decided: 0,
  groupStageComplete: false,
};

function sortTable(ids: string[], table: Record<string, TeamStat>): string[] {
  return [...ids].sort((a, b) => {
    const A = table[a];
    const B = table[b];
    if (B.pts !== A.pts) return B.pts - A.pts;
    if (B.gd !== A.gd) return B.gd - A.gd;
    if (B.gf !== A.gf) return B.gf - A.gf;
    return a < b ? -1 : 1; // deterministic final tiebreak
  });
}

/** Whether a group has all six of its matches finished. */
function groupComplete(teamIds: string[], matches: LiveMatch[]): boolean {
  const set = new Set(teamIds);
  const finished = matches.filter(
    (m) =>
      m.status === 'finished' && m.homeId && m.awayId && set.has(m.homeId) && set.has(m.awayId),
  );
  return finished.length >= 6;
}

/**
 * Compute the "actual" bracket state from live results: real group orders for
 * completed groups, the real best-8 thirds (when the group stage is done), and
 * auto-advanced knockout winners.
 */
function buildActual(matches: LiveMatch[]) {
  const completed: Record<GroupId, boolean> = {} as Record<GroupId, boolean>;
  const orders = {} as Record<GroupId, GroupStanding>;
  const tables = {} as Record<GroupId, Record<string, TeamStat>>;
  for (const g of GROUP_IDS) {
    const teamIds = GROUPS_BY_ID[g].teamIds;
    const table = computeGroupTable(teamIds, matches);
    tables[g] = table;
    completed[g] = groupComplete(teamIds, matches);
    orders[g] = sortTable(teamIds, table) as GroupStanding;
  }

  const allGroupsDone = GROUP_IDS.every((g) => completed[g]);

  // real best-8 thirds (only meaningful once the group stage is complete)
  let thirds: GroupId[] = [];
  if (allGroupsDone) {
    thirds = [...GROUP_IDS]
      .map((g) => ({ g, s: tables[g][orders[g][2]] }))
      .sort((a, b) => b.s.pts - a.s.pts || b.s.gd - a.s.gd || b.s.gf - a.s.gf || (a.g < b.g ? -1 : 1))
      .slice(0, 8)
      .map((e) => e.g);
  }

  const actualState: BracketState = {
    groups: orders,
    thirdPlaceQualifiers: thirds,
    winners: {},
  };
  // auto-advance real knockout winners from live results
  const resolved = resolveBracket(actualState, matches);

  return { orders, tables, completed, allGroupsDone, thirds, resolved };
}

/** Grade a prediction against the live results. */
export function scorePrediction(prediction: BracketState, matches: LiveMatch[]): ScoreBreakdown {
  const hasAny = matches.some((m) => m.status === 'finished');
  if (!hasAny) return empty;

  const actual = buildActual(matches);
  const predResolved = resolveBracket(prediction);

  let groupPoints = 0;
  let thirdsPoints = 0;
  let knockoutPoints = 0;
  let possible = 0;
  let correct = 0;
  let decided = 0;

  // group winners / runners-up — only for completed groups
  for (const g of GROUP_IDS) {
    if (!actual.completed[g]) continue;
    possible += POINTS.groupWinner + POINTS.groupRunnerUp;
    decided += 2;
    if (prediction.groups[g][0] === actual.orders[g][0]) {
      groupPoints += POINTS.groupWinner;
      correct++;
    }
    if (prediction.groups[g][1] === actual.orders[g][1]) {
      groupPoints += POINTS.groupRunnerUp;
      correct++;
    }
  }

  // best thirds — once the group stage is complete
  if (actual.allGroupsDone) {
    for (const g of actual.thirds) {
      possible += POINTS.thirdAdvances;
      decided++;
      if (prediction.thirdPlaceQualifiers.includes(g)) {
        thirdsPoints += POINTS.thirdAdvances;
        correct++;
      }
    }
  }

  // knockout: for each decided match, did we predict the team that advanced?
  for (const m of KO_MATCHES) {
    const actualWinner = actual.resolved.matches[m.id]?.winner ?? null;
    if (!actualWinner) continue; // not decided yet
    const w = KO_WEIGHT[m.id];
    possible += w.pts;
    decided++;
    if (predResolved.matches[m.id]?.winner === actualWinner) {
      knockoutPoints += w.pts;
      correct++;
    }
  }

  return {
    total: groupPoints + thirdsPoints + knockoutPoints,
    possible,
    groupPoints,
    thirdsPoints,
    knockoutPoints,
    correct,
    decided,
    groupStageComplete: actual.allGroupsDone,
  };
}
