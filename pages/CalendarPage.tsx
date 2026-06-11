import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Match, SlotRef, Stage } from '../types';
import { MATCHES } from '../data/schedule';
import { VENUES } from '../data/venues';
import { getTeam } from '../data/teams';
import { Flag } from '../components/Flag';
import { slotLabel } from '../components/MatchCard';
import { useClock } from '../components/settingsStore';
import { dayKeyOf, dayHeadingOf } from '../utils/time';

const STAGES: (Stage | 'All')[] = [
  'All',
  'Group',
  'Round of 32',
  'Round of 16',
  'Quarter-final',
  'Semi-final',
  'Third place',
  'Final',
];

const Side: React.FC<{ refSlot: SlotRef; align: 'left' | 'right' }> = ({ refSlot, align }) => {
  const team = refSlot.kind === 'team' ? getTeam(refSlot.teamId) : undefined;
  const justify = align === 'right' ? 'justify-end text-right' : '';
  if (team) {
    return (
      <Link to={`/team/${team.id}`} className={`flex items-center gap-2 ${justify} hover:text-pitch-300`}>
        {align === 'right' && <span className="truncate font-semibold text-slate-100">{team.name}</span>}
        <Flag team={team} size={18} />
        {align === 'left' && <span className="truncate font-semibold text-slate-100">{team.name}</span>}
      </Link>
    );
  }
  return (
    <span className={`flex items-center text-sm italic text-slate-500 ${justify}`}>
      {slotLabel(refSlot)}
    </span>
  );
};

export const CalendarPage: React.FC = () => {
  const [stage, setStage] = useState<Stage | 'All'>('All');
  const clock = useClock();

  const days = useMemo(() => {
    const filtered = MATCHES.filter((m) => stage === 'All' || m.stage === stage);
    const byDay = new Map<string, Match[]>();
    for (const m of filtered) {
      const key = dayKeyOf(m.kickoff, clock.tz);
      (byDay.get(key) ?? byDay.set(key, []).get(key)!).push(m);
    }
    return [...byDay.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, matches]) => ({
        key,
        heading: dayHeadingOf(matches[0].kickoff, clock.tz),
        matches: matches.sort((a, b) => a.kickoff.localeCompare(b.kickoff)),
      }));
  }, [stage, clock.tz]);

  return (
    <section className="animate-fade-in">
      <div className="mb-2">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Match calendar
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          All 104 fixtures — kickoff times shown in your selected zone{' '}
          <span className="font-semibold text-pitch-300">({clock.short})</span>. Change it
          from the menu in the top bar.
        </p>
      </div>

      {/* Stage filter */}
      <div className="mb-5 flex flex-wrap gap-2">
        {STAGES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStage(s)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              stage === s
                ? 'bg-pitch-600 text-white'
                : 'border border-white/10 text-slate-300 hover:bg-white/5'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {days.map((day) => (
          <div key={day.key}>
            <h2 className="sticky top-16 z-10 mb-2 bg-ink-900/90 py-1 font-display text-sm font-bold text-pitch-300 backdrop-blur">
              {day.heading}
            </h2>
            <div className="space-y-2">
              {day.matches.map((m) => {
                const v = VENUES[m.venueId];
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-ink-850/70 px-3 py-2"
                  >
                    <div className="w-14 shrink-0 text-center">
                      <div className="font-display text-base font-extrabold text-white tabular-nums">
                        {clock.time(m.kickoff)}
                      </div>
                      <div className="text-[9px] uppercase tracking-wide text-slate-500">
                        {clock.short}
                      </div>
                    </div>
                    <div className="grid flex-1 grid-cols-[1fr_auto_1fr] items-center gap-2">
                      <Side refSlot={m.home} align="right" />
                      <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                        {m.group ? `Grp ${m.group}` : 'v'}
                      </span>
                      <Side refSlot={m.away} align="left" />
                    </div>
                    <div className="hidden w-40 shrink-0 text-right text-[11px] text-slate-500 sm:block">
                      <div className="font-semibold text-slate-400">{m.stage} · M{m.id}</div>
                      <div className="truncate">
                        {v?.stadium}, {v?.city}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
