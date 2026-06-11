import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  DEFAULT_TZ,
  dateOf,
  dayHeadingOf,
  dayKeyOf,
  fullOf,
  localTz,
  timeOf,
  tzShort,
} from '../utils/time';

const STORAGE_KEY = 'wc2026-timezone';

interface Settings {
  timeZone: string;
  setTimeZone: (tz: string) => void;
}

const Ctx = createContext<Settings | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timeZone, setTimeZoneState] = useState<string>(() => {
    // Default to the visitor's own zone ("Your time"); fall back to the
    // configured default only if detection fails. A saved choice wins.
    try {
      return localStorage.getItem(STORAGE_KEY) || localTz() || DEFAULT_TZ;
    } catch {
      return localTz() || DEFAULT_TZ;
    }
  });

  const setTimeZone = useCallback((tz: string) => {
    setTimeZoneState(tz);
    try {
      localStorage.setItem(STORAGE_KEY, tz);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => ({ timeZone, setTimeZone }), [timeZone, setTimeZone]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useSettings(): Settings {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}

/** Time formatters bound to the currently selected zone. */
export function useClock() {
  const { timeZone } = useSettings();
  return useMemo(
    () => ({
      tz: timeZone,
      short: tzShort(timeZone),
      time: (iso: string) => timeOf(iso, timeZone),
      date: (iso: string) => dateOf(iso, timeZone),
      full: (iso: string) => fullOf(iso, timeZone),
      dayKey: (iso: string) => dayKeyOf(iso, timeZone),
      dayHeading: (iso: string) => dayHeadingOf(iso, timeZone),
    }),
    [timeZone],
  );
}

/** Lets effects re-run when the zone changes without using the formatters. */
export function useTimeZone(): string {
  return useSettings().timeZone;
}
