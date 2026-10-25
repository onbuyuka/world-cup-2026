import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
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
import { GROUP_IDS } from '../data/groups';
import { useLive } from './liveStore';
import { orderGroupByLive, type TeamStat } from '../utils/liveTable';
import { decodeBracket, readShareCodeFromHash, shareUrl } from '../utils/shareCode';
import { scorePrediction, type ScoreBreakdown } from '../utils/score';

interface GroupView {
  /** Effective order shown & used to resolve the bracket (live or predicted). */
  order: GroupStanding;
  /** Live points table for the group (zeros when no results yet). */
  table: Record<string, TeamStat>;
  /** True when the bracket is in Live mode. */
  live: boolean;
  /** Finished matches counted within the group. */
  playedMatches: number;
}

interface Store {
  state: BracketState;
  resolved: ResolvedBracket;
  thirdCount: number;
  /**
   * True when Live mode is on (independent of whether results exist yet). Live
   * mode is a read-only view of real results; edits only apply to the prediction.
   */
  liveActive: boolean;
  /** Group ids whose third-placed team currently advances (live or predicted). */
  effectiveThirds: GroupId[];
  /** True in live mode once the group stage is complete (best-8 is real). */
  groupStageComplete: boolean;
  /** Per-group effective order + live table. */
  groupView: (group: GroupId) => GroupView;
  /**
   * Move a team within its group by drag-and-drop: `activeId` is dropped onto
   * `overId`'s position. Ignored in Live mode.
   */
  reorderGroup: (group: GroupId, activeId: string, overId: string) => void;
  toggleThird: (group: GroupId) => void;
  pickWinner: (matchId: number, teamId: string) => void;
  resetAll: () => void;
  /** Live score of the current prediction vs real results. */
  score: ScoreBreakdown;
  /** Build a shareable link encoding the current prediction. */
  buildShareUrl: () => string;
  /** True when viewing a bracket opened from a shared link (not yet saved). */
  sharedView: boolean;
  /** Persist the shared bracket as the viewer's own and exit shared view. */
  saveSharedAsMine: () => void;
  /** Discard the shared bracket and return to the viewer's own saved bracket. */
  dismissShared: () => void;
}

const Ctx = createContext<Store | null>(null);

export const BracketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // If the URL carries a shared prediction (?p=), preview it without clobbering
  // the viewer's own saved bracket until they choose to save it.
  const sharedInitial = useMemo(() => {
    const code = readShareCodeFromHash();
    return code ? decodeBracket(code) : null;
  }, []);

  const [ownState, setOwnState] = useState<BracketState>(() => loadState());
  const [sharedState, setSharedState] = useState<BracketState | null>(sharedInitial);
  const sharedView = sharedState !== null;
  const state = sharedState ?? ownState;
  const setState: typeof setOwnState = (updater) => {
    if (sharedView) setSharedState(updater as never);
    else setOwnState(updater);
  };

  const { matches, liveMode, setLiveMode } = useLive();

  // A shared link always opens on the sender's prediction, not the viewer's
  // remembered Live view (which would show real results instead of their picks).
  useLayoutEffect(() => {
    if (sharedInitial) setLiveMode(false);
  }, [sharedInitial, setLiveMode]);

  // Only the viewer's own bracket is persisted; a previewed shared bracket is not.
  useEffect(() => {
    saveState(ownState);
  }, [ownState]);

  const saveSharedAsMine = useCallback(() => {
    setSharedState((shared) => {
      if (shared) {
        setOwnState(shared);
        // Strip the ?p= param so a refresh doesn't re-enter shared view.
        try {
          window.history.replaceState(null, '', `${window.location.pathname}#/`);
        } catch {
          /* ignore */
        }
      }
      return null;
    });
  }, []);

  const dismissShared = useCallback(() => {
    setSharedState(null);
    try {
      window.history.replaceState(null, '', `${window.location.pathname}#/`);
    } catch {
      /* ignore */
    }
  }, []);

  // Live mode is a read-only view of real results (points tables, real best 8
  // thirds, real knockout winners). Even with zero results everyone sits on 0 pts.
  const liveActive = liveMode;

  const reorderGroup = useCallback(
    (group: GroupId, activeId: string, overId: string) => {
      if (liveActive || activeId === overId) return;
      // Move activeId to overId's slot, shifting the rest (drag-and-drop).
      const apply = (order: GroupStanding): GroupStanding => {
        const from = order.indexOf(activeId);
        const to = order.indexOf(overId);
        if (from < 0 || to < 0) return order;
        const next = [...order];
        next.splice(to, 0, next.splice(from, 1)[0]);
        return next as GroupStanding;
      };
      setState((prev) => ({
        ...prev,
        groups: { ...prev.groups, [group]: apply(prev.groups[group]) },
      }));
    },
    [liveActive],
  );

  const toggleThird = useCallback(
    (group: GroupId) => {
      if (liveActive) return;
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
    },
    [liveActive],
  );

  const pickWinner = useCallback(
    (matchId: number, teamId: string) => {
      if (liveActive) return;
      // A new winner clears downstream picks via re-resolution.
      setState((prev) => ({ ...prev, winners: { ...prev.winners, [matchId]: teamId } }));
    },
    [liveActive],
  );

  const resetAll = useCallback(() => {
    if (sharedView) setSharedState(createInitialState());
    else setOwnState(createInitialState());
  }, [sharedView]);

  const groupViews = useMemo(() => {
    const out = {} as Record<GroupId, GroupView>;
    (Object.keys(state.groups) as GroupId[]).forEach((g) => {
      const predicted = state.groups[g];
      const computed = orderGroupByLive(predicted, matches);
      out[g] = {
        order: liveActive ? (computed.order as GroupStanding) : predicted,
        table: computed.table,
        live: liveActive,
        playedMatches: computed.playedMatches,
      };
    });
    return out;
  }, [state.groups, matches, liveActive]);

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

  // Which thirds advance right now: the real best 8 (live mode); the saved
  // prediction otherwise.
  const effectiveThirds = liveActive ? autoThirds : state.thirdPlaceQualifiers;

  // The state used to resolve the knockout bracket: real group orders and
  // best-3rds with no picks in live mode (so real results auto-advance); the
  // raw prediction otherwise.
  const effectiveState = useMemo<BracketState>(() => {
    if (!liveActive) return state;
    const groups = {} as Record<GroupId, GroupStanding>;
    (Object.keys(groupViews) as GroupId[]).forEach((g) => {
      groups[g] = groupViews[g].order;
    });
    return { groups, thirdPlaceQualifiers: autoThirds, winners: {} };
  }, [state, groupViews, autoThirds, liveActive]);

  // In live mode, real decisive knockout results auto-advance (cascading).
  // Predict mode ignores results.
  const resolved = useMemo(
    () => resolveBracket(effectiveState, liveActive ? matches : undefined),
    [effectiveState, liveActive, matches],
  );

  const groupView = useCallback((group: GroupId) => groupViews[group], [groupViews]);

  // Live score always grades the *prediction* (raw group orders, thirds,
  // winners) so it reflects "how good was your call". Uses the viewer's own
  // bracket, or the shared one when previewing.
  const score = useMemo<ScoreBreakdown>(
    () =>
      scorePrediction(
        {
          groups: state.groups,
          thirdPlaceQualifiers: state.thirdPlaceQualifiers,
          winners: state.winners,
        },
        matches,
      ),
    [state.groups, state.thirdPlaceQualifiers, state.winners, matches],
  );

  const buildShareUrl = useCallback(
    () =>
      shareUrl({
        groups: state.groups,
        thirdPlaceQualifiers: state.thirdPlaceQualifiers,
        winners: state.winners,
      }),
    [state.groups, state.thirdPlaceQualifiers, state.winners],
  );

  const value = useMemo<Store>(
    () => ({
      state,
      resolved,
      thirdCount: effectiveThirds.length,
      liveActive,
      effectiveThirds,
      groupStageComplete,
      groupView,
      reorderGroup,
      toggleThird,
      pickWinner,
      resetAll,
      score,
      buildShareUrl,
      sharedView,
      saveSharedAsMine,
      dismissShared,
    }),
    [
      state,
      resolved,
      effectiveThirds,
      liveActive,
      groupStageComplete,
      groupView,
      reorderGroup,
      toggleThird,
      pickWinner,
      resetAll,
      score,
      buildShareUrl,
      sharedView,
      saveSharedAsMine,
      dismissShared,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useBracket(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useBracket must be used within BracketProvider');
  return ctx;
}
