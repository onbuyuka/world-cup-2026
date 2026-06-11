import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { LiveMatch, LiveResults } from '../utils/liveTable';
import { fetchTodayLive, mergeLive } from '../utils/liveSource';

// Loads the committed results snapshot (public/liveResults.json) as a reliable
// baseline, then polls TheSportsDB directly for *today's* matches and merges
// fresher scores on top — so an open tab updates within ~1 minute during games.
// The snapshot itself is also refreshed server-side by a scheduled GitHub
// Action; the direct poll is best-effort and silently falls back to the
// baseline if it fails or is rate-limited.

const LIVE_MODE_KEY = 'wc2026-live-mode';
const SNAPSHOT_MS = 5 * 60 * 1000; // re-read the committed snapshot every 5 min
const LIVE_POLL_MS = 60 * 1000; // poll TheSportsDB for today's scores every 60s

interface LiveStore {
  /** Normalized matches: committed baseline merged with fresh live scores. */
  matches: LiveMatch[];
  updated: string | null;
  loading: boolean;
  error: string | null;
  /** True if there is at least one played (live/finished) match. */
  hasResults: boolean;
  /** True once a direct live poll has merged in fresher data this session. */
  livePolling: boolean;
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
  const [livePolling, setLivePolling] = useState(false);
  const [liveMode, setLiveModeState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LIVE_MODE_KEY) === '1';
    } catch {
      return false;
    }
  });

  // Keep the committed baseline so the live poll can merge over it without
  // losing earlier matches not in "today's" window.
  const baselineRef = useRef<LiveMatch[]>([]);

  // Read the committed snapshot (reliable baseline).
  const loadSnapshot = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`${snapshotUrl()}?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as LiveResults;
      const base = Array.isArray(data.matches) ? data.matches : [];
      baselineRef.current = base;
      setUpdated(data.updated ?? null);
      // Merge over any live data already fetched this session.
      setMatches((prev) => mergeLive(base, prev));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll TheSportsDB directly for today's scores and merge over the baseline.
  const pollLive = useCallback(async () => {
    const fresh = await fetchTodayLive();
    if (fresh.length === 0) return; // failed / rate-limited: keep baseline
    setLivePolling(true);
    setUpdated(new Date().toISOString());
    setMatches(mergeLive(baselineRef.current, fresh));
  }, []);

  const refresh = useCallback(async () => {
    await loadSnapshot();
    await pollLive();
  }, [loadSnapshot, pollLive]);

  useEffect(() => {
    // Initial: baseline first (fast, reliable), then a live poll on top.
    loadSnapshot().then(pollLive);

    const snapId = setInterval(loadSnapshot, SNAPSHOT_MS);
    const liveId = setInterval(pollLive, LIVE_POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        loadSnapshot();
        pollLive();
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(snapId);
      clearInterval(liveId);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [loadSnapshot, pollLive]);

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
      livePolling,
      liveMode,
      setLiveMode,
      refresh,
    }),
    [matches, updated, loading, error, hasResults, livePolling, liveMode, setLiveMode, refresh],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useLive(): LiveStore {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLive must be used within LiveProvider');
  return ctx;
}
