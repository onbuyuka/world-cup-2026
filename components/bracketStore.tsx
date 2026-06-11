import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import type { BracketState, GroupId, GroupStanding } from '../types';
import {
  createInitialState,
  loadState,
  saveState,
  resolveBracket,
  type ResolvedBracket,
} from '../utils/bracket';
import { GROUP_IDS } from '../data/groups';
import { useLive } from './liveStore';
import { orderGroupByLive, type TeamStat } from '../utils/liveTable';

interface GroupView {
  /** Effective order shown & used to resolve the bracket (live or predicted). */
  order: GroupStanding;
  /** Live points table for the group (zeros when no results yet). */
  table: Record<string, TeamStat>;
  /** True when the bracket is in Live mode. */
  live: boolean;
  /** True when this group's live order was manually overridden ("what-if"). */
  manual: boolean;
  /** Finished matches counted within the group. */
  playedMatches: number;
}

interface Store {
  state: BracketState;
  resolved: ResolvedBracket;
  thirdCount: number;
  /** True when Live mode is on (independent of whether results exist yet). */
  liveActive: boolean;
  /** Group ids whose third-placed team currently advances (live or predicted). */
  effectiveThirds: GroupId[];
  /** True in live mode once the group stage is complete (best-8 is real). */
  groupStageComplete: boolean;
  /** True when the live best-3rds selection has been hand-edited. */
  liveThirdsCustomized: boolean;
  /** Per-group effective order + live table. */
  groupView: (group: GroupId) => GroupView;
  moveTeam: (group: GroupId, teamId: string, dir: -1 | 1) => void;
  toggleThird: (group: GroupId) => void;
  pickWinner: (matchId: number, teamId: string) => void;
  /** Discard a group's live what-if order, snapping back to real results. */
  resetLiveGroup: (group: GroupId) => void;
  /** Discard the live best-3rds override, snapping back to the real best 8. */
  resetLiveThirds: () => void;
  resetAll: () => void;
}

const Ctx = createContext<Store | null>(null);

export const BracketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<BracketState>(() => loadState());
  const { matches, liveMode } = useLive();

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Live mode shows the standings view (points) and lets the user reorder for
  // "what-if" scenarios. Even with zero results everyone simply sits on 0 pts.
  const liveActive = liveMode;

  // Latest auto-computed best-8 thirds, kept in a ref so toggleThird can seed
  // from it without being recreated on every standings change.
  const autoThirdsRef = useRef<GroupId[]>([]);

  const moveTeam = useCallback(
    (group: GroupId, teamId: string, dir: -1 | 1) => {
      if (liveActive) {
        // Reorder the live "what-if" order; never touch the prediction.
        setState((prev) => {
          const current =
            prev.liveOverrides?.[group] ??
            (orderGroupByLive(prev.groups[group], matches).order as GroupStanding);
          const order = [...current];
          const i = order.indexOf(teamId);
          const j = i + dir;
          if (i < 0 || j < 0 || j > 3) return prev;
          [order[i], order[j]] = [order[j], order[i]];
          return {
            ...prev,
            liveOverrides: { ...prev.liveOverrides, [group]: order as GroupStanding },
          };
        });
        return;
      }
      setState((prev) => {
        const order = [...prev.groups[group]];
        const i = order.indexOf(teamId);
        const j = i + dir;
        if (i < 0 || j < 0 || j > 3) return prev;
        [order[i], order[j]] = [order[j], order[i]];
        return { ...prev, groups: { ...prev.groups, [group]: order as GroupStanding } };
      });
    },
    [liveActive, matches],
  );

  const toggleThird = useCallback(
    (group: GroupId) => {
      setState((prev) => {
        if (liveActive) {
          // Edit the live "what-if" best-3rds set, seeded from the real best 8
          // (or the user's existing custom set). Never touches the prediction.
          const base = prev.liveThirds ?? autoThirdsRef.current;
          const has = base.includes(group);
          let next: GroupId[];
          if (has) next = base.filter((g) => g !== group);
          else if (base.length < 8) next = [...base, group];
          else return prev; // already 8 selected
          return { ...prev, liveThirds: next };
        }
        const has = prev.thirdPlaceQualifiers.includes(group);
        let next = prev.thirdPlaceQualifiers;
        if (has) {
          next = next.filter((g) => g !== group);
        } else if (next.length < 8) {
          next = [...next, group];
        } else {
          return prev; // already 8 selected
        }
        return { ...prev, thirdPlaceQualifiers: next };
      });
    },
    [liveActive],
  );

  const pickWinner = useCallback(
    (matchId: number, teamId: string) => {
      setState((prev) => {
        if (liveActive) {
          // Live "what-if": toggle an override on the live knockout. Clicking
          // the current pick again reverts to the real (auto-advanced) result.
          const cur = prev.liveWinners?.[matchId];
          const next = { ...prev.liveWinners };
          if (cur === teamId) delete next[matchId];
          else next[matchId] = teamId;
          return { ...prev, liveWinners: next };
        }
        // Predict mode: a new winner clears downstream picks via re-resolution.
        return { ...prev, winners: { ...prev.winners, [matchId]: teamId } };
      });
    },
    [liveActive],
  );

  const resetLiveGroup = useCallback((group: GroupId) => {
    setState((prev) => {
      if (!prev.liveOverrides?.[group]) return prev;
      const next = { ...prev.liveOverrides };
      delete next[group];
      return { ...prev, liveOverrides: next };
    });
  }, []);

  const resetLiveThirds = useCallback(() => {
    setState((prev) => (prev.liveThirds === undefined ? prev : { ...prev, liveThirds: undefined }));
  }, []);

  const resetAll = useCallback(() => setState(createInitialState()), []);

  const groupViews = useMemo(() => {
    const out = {} as Record<GroupId, GroupView>;
    (Object.keys(state.groups) as GroupId[]).forEach((g) => {
      const predicted = state.groups[g];
      const computed = orderGroupByLive(predicted, matches);
      const manual = Boolean(state.liveOverrides?.[g]);
      const liveOrder = (state.liveOverrides?.[g] ?? computed.order) as GroupStanding;
      out[g] = {
        order: liveActive ? liveOrder : predicted,
        table: computed.table,
        live: liveActive,
        manual: liveActive && manual,
        playedMatches: computed.playedMatches,
      };
    });
    return out;
  }, [state.groups, state.liveOverrides, matches, liveActive]);

  // Group stage is "complete" once every group has all six of its matches
  // finished — only then is the best-third-placed ranking real (not provisional).
  const groupStageComplete = useMemo(() => {
    if (!liveActive) return false;
    return GROUP_IDS.every((g) => {
      const ids = new Set(state.groups[g]);
      const finished = matches.filter(
        (m) =>
          m.status === 'finished' &&
          m.homeId &&
          m.awayId &&
          ids.has(m.homeId) &&
          ids.has(m.awayId),
      ).length;
      return finished >= 6;
    });
  }, [liveActive, state.groups, matches]);

  // The real best 8 third-placed groups, ranked by the live table
  // (points → goal difference → goals for → group letter). Empty until the
  // group stage is complete, so it never auto-fills with provisional noise.
  const autoThirds = useMemo<GroupId[]>(() => {
    if (!liveActive || !groupStageComplete) return [];
    const entries = GROUP_IDS.map((g) => {
      const thirdId = groupViews[g].order[2];
      return { g, s: groupViews[g].table[thirdId] };
    });
    entries.sort(
      (a, b) =>
        b.s.pts - a.s.pts || b.s.gd - a.s.gd || b.s.gf - a.s.gf || (a.g < b.g ? -1 : 1),
    );
    return entries.slice(0, 8).map((e) => e.g);
  }, [liveActive, groupStageComplete, groupViews]);
  autoThirdsRef.current = autoThirds;

  // Which thirds advance right now: the user's live override if set, else the
  // real best 8 (live mode); the saved prediction otherwise.
  const effectiveThirds = useMemo<GroupId[]>(
    () => (liveActive ? (state.liveThirds ?? autoThirds) : state.thirdPlaceQualifiers),
    [liveActive, state.liveThirds, autoThirds, state.thirdPlaceQualifiers],
  );

  // The state used to resolve the knockout bracket: effective group orders,
  // best-3rds and live "what-if" knockout picks in live mode; raw predictions otherwise.
  const effectiveState = useMemo<BracketState>(() => {
    if (!liveActive) return state;
    const groups = {} as Record<GroupId, GroupStanding>;
    (Object.keys(groupViews) as GroupId[]).forEach((g) => {
      groups[g] = groupViews[g].order;
    });
    return {
      ...state,
      groups,
      thirdPlaceQualifiers: effectiveThirds,
      winners: state.liveWinners ?? {},
    };
  }, [state, groupViews, effectiveThirds, liveActive]);

  // In live mode, real decisive knockout results auto-advance (cascading);
  // `liveWinners` overrides them for hypotheticals. Predict mode ignores results.
  const resolved = useMemo(
    () => resolveBracket(effectiveState, liveActive ? matches : undefined),
    [effectiveState, liveActive, matches],
  );

  const groupView = useCallback((group: GroupId) => groupViews[group], [groupViews]);

  const value = useMemo<Store>(
    () => ({
      state,
      resolved,
      thirdCount: effectiveThirds.length,
      liveActive,
      effectiveThirds,
      groupStageComplete,
      liveThirdsCustomized: liveActive && state.liveThirds !== undefined,
      groupView,
      moveTeam,
      toggleThird,
      pickWinner,
      resetLiveGroup,
      resetLiveThirds,
      resetAll,
    }),
    [
      state,
      resolved,
      effectiveThirds,
      liveActive,
      groupStageComplete,
      groupView,
      moveTeam,
      toggleThird,
      pickWinner,
      resetLiveGroup,
      resetLiveThirds,
      resetAll,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useBracket(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useBracket must be used within BracketProvider');
  return ctx;
}
