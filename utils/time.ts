// ---------------------------------------------------------------------------
// Time helpers. Every match `kickoff` is an offset-aware ISO instant; these
// convert it to a chosen IANA time zone for display. The selected zone lives
// in settings (see components/settingsStore.tsx); Turkish time is the default.
// ---------------------------------------------------------------------------

export const DEFAULT_TZ = 'Europe/Istanbul';

export interface TimeZoneOption {
  /** IANA zone id. */
  tz: string;
  /** Menu label (offset is appended dynamically). */
  label: string;
}

/** Curated zones: World Cup hosts, big football markets, and the default TRT. */
export const TIME_ZONES: TimeZoneOption[] = [
  { tz: 'Europe/Istanbul', label: 'Türkiye' },
  { tz: 'Europe/London', label: 'UK / Ireland' },
  { tz: 'Europe/Paris', label: 'Central Europe' },
  { tz: 'Europe/Moscow', label: 'Moscow' },
  { tz: 'Africa/Lagos', label: 'West Africa' },
  { tz: 'Asia/Dubai', label: 'Gulf (UAE)' },
  { tz: 'Asia/Tehran', label: 'Iran' },
  { tz: 'Asia/Tokyo', label: 'Japan' },
  { tz: 'Asia/Seoul', label: 'Korea' },
  { tz: 'Australia/Sydney', label: 'Australia (East)' },
  { tz: 'America/New_York', label: 'US Eastern' },
  { tz: 'America/Chicago', label: 'US Central' },
  { tz: 'America/Denver', label: 'US Mountain' },
  { tz: 'America/Los_Angeles', label: 'US Pacific' },
  { tz: 'America/Mexico_City', label: 'Mexico City' },
  { tz: 'America/Toronto', label: 'Toronto' },
  { tz: 'America/Vancouver', label: 'Vancouver' },
  { tz: 'America/Sao_Paulo', label: 'Brazil' },
  { tz: 'America/Argentina/Buenos_Aires', label: 'Argentina' },
  { tz: 'America/Bogota', label: 'Colombia / Peru' },
];

const partsOf = (iso: string, tz: string): Record<string, string> => {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return Object.fromEntries(
    fmt.formatToParts(new Date(iso)).map((x) => [x.type, x.value]),
  ) as Record<string, string>;
};

/** "22:00" in the given zone. */
export const timeOf = (iso: string, tz: string): string => {
  const p = partsOf(iso, tz);
  return `${p.hour}:${p.minute}`;
};

/** "Thu, 11 Jun" in the given zone. */
export const dateOf = (iso: string, tz: string): string => {
  const p = partsOf(iso, tz);
  return `${p.weekday}, ${p.day} ${p.month}`;
};

/** "Thu, 11 Jun 2026 · 22:00" in the given zone. */
export const fullOf = (iso: string, tz: string): string => {
  const p = partsOf(iso, tz);
  return `${p.weekday}, ${p.day} ${p.month} ${p.year} · ${p.hour}:${p.minute}`;
};

/** Stable day key (yyyy-mm-dd) in the given zone — used to group fixtures. */
export const dayKeyOf = (iso: string, tz: string): string => {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return fmt.format(new Date(iso)); // en-CA → yyyy-mm-dd
};

/** Long heading, e.g. "Thursday, 11 June 2026" in the given zone. */
export const dayHeadingOf = (iso: string, tz: string): string =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso));

/** Short zone label like "GMT+3" for the current offset. */
export const tzShort = (tz: string, iso = '2026-06-15T12:00:00Z'): string => {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      timeZoneName: 'shortOffset',
    }).formatToParts(new Date(iso));
    return parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
  } catch {
    return '';
  }
};

/** The browser's detected IANA zone (or the default if unavailable). */
export const localTz = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TZ;
  } catch {
    return DEFAULT_TZ;
  }
};
