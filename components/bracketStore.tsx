import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
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
  /** Per-group effective order + live table. */
  groupView: (group: GroupId) => GroupView;
  moveTeam: (group: GroupId, teamId: string, dir: -1 | 1) => void;
  toggleThird: (group: GroupId) => void;
  pickWinner: (matchId: number, teamId: string) => void;
  /** Discard a group's live what-if override, snapping back to real results. */
  resetLiveGroup: (group: GroupId) => void;
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

  // Effective live order for a group: a manual override if the user dragged it,
  // otherwise the order computed from real results (predicted order breaks ties).
  const liveOrderOf = useCallback(
    (group: GroupId): GroupStanding => {
      const override = state.liveOverrides?.[group];
      if (override) return override;
      return orderGroupByLive(state.groups[group], matches).order as GroupStanding;
    },
    [state.liveOverrides, state.groups, matches],
  );

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

  const toggleThird = useCallback((group: GroupId) => {
    setState((prev) => {
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
  }, []);

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

  // The state used to resolve the knockout bracket: effective group orders +
  // live "what-if" knockout picks in live mode, raw predictions otherwise.
  const effectiveState = useMemo<BracketState>(() => {
    if (!liveActive) return state;
    const groups = {} as Record<GroupId, GroupStanding>;
    (Object.keys(groupViews) as GroupId[]).forEach((g) => {
      groups[g] = groupViews[g].order;
    });
    return { ...state, groups, winners: state.liveWinners ?? {} };
  }, [state, groupViews, liveActive]);

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
      thirdCount: state.thirdPlaceQualifiers.length,
      liveActive,
      groupView,
      moveTeam,
      toggleThird,
      pickWinner,
      resetLiveGroup,
      resetAll,
    }),
    [
      state,
      resolved,
      liveActive,
      groupView,
      moveTeam,
      toggleThird,
      pickWinner,
      resetLiveGroup,
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
