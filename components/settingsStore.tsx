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
import { translate, type Lang, type StrKey } from '../utils/i18n';

const STORAGE_KEY = 'wc2026-timezone';
const LANG_KEY = 'wc2026-lang';

/** Intl locale used for date formatting in each language. */
const LOCALE: Record<Lang, string> = { en: 'en-GB', tr: 'tr-TR' };

function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'en' || saved === 'tr') return saved;
  } catch {
    /* ignore */
  }
  try {
    return navigator.language?.toLowerCase().startsWith('tr') ? 'tr' : 'en';
  } catch {
    return 'en';
  }
}

interface Settings {
  timeZone: string;
  setTimeZone: (tz: string) => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
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
  const [lang, setLangState] = useState<Lang>(detectLang);

  const setTimeZone = useCallback((tz: string) => {
    setTimeZoneState(tz);
    try {
      localStorage.setItem(STORAGE_KEY, tz);
    } catch {
      /* ignore */
    }
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  // Reflect the language on <html lang> for correct hyphenation / casing.
  useEffect(() => {
    try {
      document.documentElement.lang = lang;
    } catch {
      /* ignore */
    }
  }, [lang]);

  const value = useMemo(
    () => ({ timeZone, setTimeZone, lang, setLang }),
    [timeZone, setTimeZone, lang, setLang],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useSettings(): Settings {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}

/** Translator bound to the current language. */
export function useT(): { t: (key: StrKey, vars?: Record<string, string | number>) => string; lang: Lang } {
  const { lang } = useSettings();
  const t = useCallback(
    (key: StrKey, vars?: Record<string, string | number>) => translate(lang, key, vars),
    [lang],
  );
  return { t, lang };
}

/** Time formatters bound to the currently selected zone and language. */
export function useClock() {
  const { timeZone, lang } = useSettings();
  const locale = LOCALE[lang];
  return useMemo(
    () => ({
      tz: timeZone,
      short: tzShort(timeZone),
      time: (iso: string) => timeOf(iso, timeZone),
      date: (iso: string) => dateOf(iso, timeZone, locale),
      full: (iso: string) => fullOf(iso, timeZone, locale),
      dayKey: (iso: string) => dayKeyOf(iso, timeZone),
      dayHeading: (iso: string) => dayHeadingOf(iso, timeZone, locale),
    }),
    [timeZone, locale],
  );
}

/** Lets effects re-run when the zone changes without using the formatters. */
export function useTimeZone(): string {
  return useSettings().timeZone;
}
