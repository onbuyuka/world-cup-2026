import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { TIME_ZONES, localTz, tzShort } from '../utils/time';
import { useSettings } from './settingsStore';

const NAV = [
  { to: '/', label: 'Bracket', end: true },
  { to: '/teams', label: 'Teams' },
  { to: '/calendar', label: 'Calendar' },
];

const TimezonePicker: React.FC<{ className?: string }> = ({ className }) => {
  const { timeZone, setTimeZone } = useSettings();
  const detected = localTz();

  return (
    <label
      className={`flex min-w-0 items-center gap-1.5 rounded-lg border border-white/10 bg-ink-850 px-2 py-1 ${
        className ?? ''
      }`}
    >
      <span aria-hidden className="text-xs text-slate-400">🕑</span>
      <span className="sr-only">Time zone</span>
      <select
        value={timeZone}
        onChange={(e) => setTimeZone(e.target.value)}
        className="min-w-0 max-w-[8rem] bg-transparent text-xs font-semibold text-slate-100 outline-none sm:max-w-[9.5rem]"
        title="Show all kickoff times in this time zone"
      >
        {/* The visitor's own zone is the default. */}
        <option value={detected} className="bg-ink-900">
          Your time ({tzShort(detected)})
        </option>
        {TIME_ZONES.filter((z) => z.tz !== detected).map((z) => (
          <option key={z.tz} value={z.tz} className="bg-ink-900">
            {z.label} ({tzShort(z.tz)})
          </option>
        ))}
      </select>
    </label>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { timeZone } = useSettings();
  const detected = localTz();
  const selected = TIME_ZONES.find((z) => z.tz === timeZone);
  const zoneLabel =
    timeZone === detected ? 'your local time' : selected ? selected.label : 'your time';

  return (
    <div className="min-h-screen bg-ink-900">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-900/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
          <Link to="/" className="order-1 flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <span className="font-display text-lg font-extrabold tracking-tight text-white">
              WC<span className="text-pitch-500">26</span>
              <span className="ml-1.5 hidden text-sm font-semibold text-slate-400 lg:inline">
                Bracket Predictor
              </span>
            </span>
          </Link>
          <nav className="order-3 flex w-full items-center justify-center gap-1 sm:order-2 sm:ml-auto sm:w-auto sm:justify-end">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-pitch-600 text-white'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <TimezonePicker className="order-2 ml-auto sm:order-3 sm:ml-0" />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>

      <footer className="mt-12 border-t border-white/10 px-4 py-6 text-center text-xs text-slate-500">
        <p>
          FIFA World Cup 2026 · 11 Jun – 19 Jul 2026 · Kickoff times shown in{' '}
          {zoneLabel} ({tzShort(timeZone)}).
        </p>
        <p className="mt-1">
          Live starting XIs &amp; player photos via{' '}
          <a
            href="https://mylineups.app/world-cup-2026/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pitch-400 hover:underline"
          >
            mylineups.app
          </a>
          . An independent fan project — not affiliated with FIFA.
        </p>
      </footer>
    </div>
  );
};
