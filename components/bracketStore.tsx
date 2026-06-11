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

interface Store {
  state: BracketState;
  resolved: ResolvedBracket;
  thirdCount: number;
  moveTeam: (group: GroupId, teamId: string, dir: -1 | 1) => void;
  toggleThird: (group: GroupId) => void;
  pickWinner: (matchId: number, teamId: string) => void;
  resetAll: () => void;
}

const Ctx = createContext<Store | null>(null);

export const BracketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<BracketState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const moveTeam = useCallback((group: GroupId, teamId: string, dir: -1 | 1) => {
    setState((prev) => {
      const order = [...prev.groups[group]];
      const i = order.indexOf(teamId);
      const j = i + dir;
      if (i < 0 || j < 0 || j > 3) return prev;
      [order[i], order[j]] = [order[j], order[i]];
      return { ...prev, groups: { ...prev.groups, [group]: order as GroupStanding } };
    });
  }, []);

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

  const pickWinner = useCallback((matchId: number, teamId: string) => {
    setState((prev) => {
      // Picking a new winner clears downstream picks that depended on the old one.
      const winners = { ...prev.winners, [matchId]: teamId };
      return { ...prev, winners };
    });
  }, []);

  const resetAll = useCallback(() => setState(createInitialState()), []);

  const resolved = useMemo(() => resolveBracket(state), [state]);

  const value = useMemo<Store>(
    () => ({
      state,
      resolved,
      thirdCount: state.thirdPlaceQualifiers.length,
      moveTeam,
      toggleThird,
      pickWinner,
      resetAll,
    }),
    [state, resolved, moveTeam, toggleThird, pickWinner, resetAll],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useBracket(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useBracket must be used within BracketProvider');
  return ctx;
}
