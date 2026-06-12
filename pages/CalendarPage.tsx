import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Match, SlotRef, Stage } from '../types';
import { MATCHES } from '../data/schedule';
import { VENUES } from '../data/venues';
import { getTeam } from '../data/teams';
import { Flag } from '../components/Flag';
import { slotLabel } from '../components/MatchCard';
import { useClock, useT } from '../components/settingsStore';
import { useLive } from '../components/liveStore';
import { resultForPair, type LiveMatch } from '../utils/liveTable';
import { dayKeyOf, dayHeadingOf } from '../utils/time';
import { teamName, type StrKey } from '../utils/i18n';

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

const Side: React.FC<{ refSlot: SlotRef; align: 'left' | 'right'; outcome?: 'W' | 'D' | 'L' | null }> = ({
  refSlot,
  align,
  outcome,
}) => {
  const { lang } = useT();
  const team = refSlot.kind === 'team' ? getTeam(refSlot.teamId) : undefined;
  const justify = align === 'right' ? 'justify-end text-right' : '';
  if (team) {
    const nameClass = `truncate ${
      outcome === 'W'
        ? 'font-extrabold text-white'
        : outcome === 'L'
          ? 'font-semibold text-slate-400'
          : 'font-semibold text-slate-100'
    }`;
    return (
      <Link to={`/team/${team.id}`} className={`flex items-center gap-2 ${justify} hover:text-pitch-300`}>
        {align === 'right' && <span className={nameClass}>{teamName(team.id, team.name, lang)}</span>}
        <Flag team={team} size={18} />
        {align === 'left' && <span className={nameClass}>{teamName(team.id, team.name, lang)}</span>}
      </Link>
    );
  }
  return (
    <span className={`flex items-center text-sm italic text-slate-500 ${justify}`}>
      {slotLabel(refSlot, lang)}
    </span>
  );
};

/**
 * Final score for a calendar match, oriented to its home/away, or null.
 * Only group-stage fixtures (both sides resolved to real teams) can be matched
 * to live data; we show finished scores only (no in-progress games here).
 */
function finishedScore(m: Match, matches: LiveMatch[]): { home: number; away: number } | null {
  if (m.home.kind !== 'team' || m.away.kind !== 'team') return null;
  const homeId = m.home.teamId;
  const awayId = m.away.teamId;
  const lm = resultForPair(matches, homeId, awayId);
  if (!lm || lm.status !== 'finished' || lm.hs == null || lm.as == null) return null;
  // The live match's home may be our away team — orient the goals accordingly.
  const home = lm.homeId === homeId ? lm.hs : lm.as;
  const away = lm.homeId === homeId ? lm.as : lm.hs;
  return { home, away };
}

export const CalendarPage: React.FC = () => {
  const [stage, setStage] = useState<Stage | 'All'>('All');
  const clock = useClock();
  const { matches: liveMatches } = useLive();
  const { t } = useT();

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
          {t('cal.title')}
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          {t('cal.descPre')}
          <span className="font-semibold text-pitch-300">({clock.short})</span>
          {t('cal.descPost')}
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
            {t(`stage.${s}` as StrKey)}
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
                const fs = finishedScore(m, liveMatches);
                const homeOutcome = fs ? (fs.home > fs.away ? 'W' : fs.home < fs.away ? 'L' : 'D') : null;
                const awayOutcome = fs ? (fs.home > fs.away ? 'L' : fs.home < fs.away ? 'W' : 'D') : null;
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
                      <Side refSlot={m.home} align="right" outcome={homeOutcome} />
                      {fs ? (
                        <div className="flex flex-col items-center leading-none">
                          <span className="font-display text-base font-extrabold tabular-nums text-white">
                            {fs.home}–{fs.away}
                          </span>
                          <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-400">
                            {t('cal.ft')}
                          </span>
                        </div>
                      ) : (
                        <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                          {m.group ? t('cal.grp', { g: m.group }) : 'v'}
                        </span>
                      )}
                      <Side refSlot={m.away} align="left" outcome={awayOutcome} />
                    </div>
                    <div className="hidden w-40 shrink-0 text-right text-[11px] text-slate-500 sm:block">
                      <div className="font-semibold text-slate-400">{t(`stage.${m.stage}` as StrKey)} · M{m.id}</div>
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
