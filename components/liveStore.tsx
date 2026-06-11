import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { LiveMatch, LiveResults } from '../utils/liveTable';

// Loads the committed results snapshot (public/liveResults.json), exposes it to
// the app, and lets the user flip the bracket into "Live" mode. The snapshot is
// refreshed server-side by a scheduled GitHub Action; here we just read it and
// re-poll occasionally so an open tab picks up new commits during match days.

const LIVE_MODE_KEY = 'wc2026-live-mode';
const REFRESH_MS = 5 * 60 * 1000; // re-check the snapshot every 5 minutes

interface LiveStore {
  /** Normalized matches from the snapshot (empty until loaded). */
  matches: LiveMatch[];
  updated: string | null;
  loading: boolean;
  error: string | null;
  /** True if the snapshot has at least one played (live/finished) match. */
  hasResults: boolean;
  /** User toggle: order the bracket by real results. */
  liveMode: boolean;
  setLiveMode: (on: boolean) => void;
  refresh: () => void;
}

const Ctx = createContext<LiveStore | null>(null);

// Resolve the snapshot URL against Vite's base so it works under /world-cup-2026/.
function snapshotUrl(): string {
  const base = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/';
  return `${base.replace(/\/$/, '')}/liveResults.json`;
}

export const LiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [updated, setUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liveMode, setLiveModeState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LIVE_MODE_KEY) === '1';
    } catch {
      return false;
    }
  });

  const load = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`${snapshotUrl()}?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as LiveResults;
      setMatches(Array.isArray(data.matches) ? data.matches : []);
      setUpdated(data.updated ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === 'visible') load();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [load]);

  const setLiveMode = useCallback((on: boolean) => {
    setLiveModeState(on);
    try {
      localStorage.setItem(LIVE_MODE_KEY, on ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, []);

  const hasResults = useMemo(
    () => matches.some((m) => m.status === 'finished' || m.status === 'live'),
    [matches],
  );

  const value = useMemo<LiveStore>(
    () => ({
      matches,
      updated,
      loading,
      error,
      hasResults,
      liveMode,
      setLiveMode,
      refresh: load,
    }),
    [matches, updated, loading, error, hasResults, liveMode, setLiveMode, load],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useLive(): LiveStore {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLive must be used within LiveProvider');
  return ctx;
}
