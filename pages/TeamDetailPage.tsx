import React from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import type { PlayerPosition } from '../types';
import { getTeam, mylineupsUrl } from '../data/teams';
import { MATCHES } from '../data/schedule';
import { VENUES } from '../data/venues';
import { Jersey } from '../components/Jersey';
import { Flag } from '../components/Flag';
import { PlayerAvatar } from '../components/PlayerAvatar';
import { RecentForm, ResultBadge } from '../components/RecentForm';
import { useClock } from '../components/settingsStore';
import { useLive } from '../components/liveStore';
import { resultForPair, resultFor, scoreText, liveStatusLabel } from '../utils/liveTable';

const POSITION_ORDER: PlayerPosition[] = ['GK', 'DF', 'MF', 'FW'];
const POSITION_LABEL: Record<PlayerPosition, string> = {
  GK: 'Goalkeepers',
  DF: 'Defenders',
  MF: 'Midfielders',
  FW: 'Forwards',
};

const CONF_LABEL: Record<string, string> = {
  UEFA: 'UEFA · Europe',
  CONMEBOL: 'CONMEBOL · South America',
  CONCACAF: 'CONCACAF · North America',
  CAF: 'CAF · Africa',
  AFC: 'AFC · Asia',
  OFC: 'OFC · Oceania',
};

export const TeamDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const clock = useClock();
  const { matches: liveMatches } = useLive();
  const team = getTeam(id);

  // Go back to wherever the user came from (Calendar, Teams, Bracket); fall
  // back to the Teams list when the team page was opened directly.
  const goBack = () => {
    if (location.key && location.key !== 'default') navigate(-1);
    else navigate('/teams');
  };

  if (!team) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-slate-300">Team not found.</p>
        <Link to="/teams" className="mt-3 inline-block text-pitch-400 hover:underline">
          ← Back to all teams
        </Link>
      </div>
    );
  }

  const fixtures = MATCHES.filter(
    (m) =>
      m.stage === 'Group' &&
      ((m.home.kind === 'team' && m.home.teamId === team.id) ||
        (m.away.kind === 'team' && m.away.teamId === team.id)),
  ).sort((a, b) => a.kickoff.localeCompare(b.kickoff));

  return (
    <section className="animate-fade-in">
      <button
        type="button"
        onClick={goBack}
        className="mb-4 inline-block text-sm text-slate-400 hover:text-white"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-r from-pitch-900/40 to-transparent p-5">
        <Flag team={team} size={46} />
        <div className="flex-1">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">
            {team.name}
          </h1>
          <p className="text-sm text-slate-400">
            Group {team.group} · {CONF_LABEL[team.confederation]} · FIFA #{team.fifaRank}
          </p>
          {team.coach && (
            <p className="mt-1 text-sm text-slate-300">
              <span className="text-slate-500">Head coach:</span> {team.coach}
            </p>
          )}
          {team.note && (
            <span className="mt-2 inline-block rounded-full bg-pitch-600/20 px-2.5 py-0.5 text-xs font-semibold text-pitch-300">
              {team.note}
            </span>
          )}
        </div>
        <a
          href={mylineupsUrl(team)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-pitch-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pitch-500"
        >
          Live starting XI ↗
        </a>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column: kits, form, fixtures */}
        <div className="space-y-6">
          {/* Kits */}
          {team.kits && (
            <div className="rounded-xl border border-white/10 bg-ink-850/70 p-4">
              <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-slate-400">
                Kits
              </h2>
              <div className="flex items-start justify-around">
                {(['home', 'away'] as const).map((k) => (
                  <div key={k} className="flex flex-col items-center gap-1">
                    <Jersey kit={team.kits![k]} size={92} />
                    <span className="text-xs font-semibold capitalize text-slate-300">{k}</span>
                    <span className="text-[11px] text-slate-500">{team.kits![k].label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent form */}
          <div className="rounded-xl border border-white/10 bg-ink-850/70 p-4">
            <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-slate-400">
              Form before world cup
            </h2>
            <RecentForm form={team.recentForm} max={6} />
          </div>

          {/* Group fixtures */}
          <div className="rounded-xl border border-white/10 bg-ink-850/70 p-4">
            <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-slate-400">
              Group fixtures ({clock.short})
            </h2>
            <ul className="space-y-2">
              {fixtures.map((m) => {
                const isHome = m.home.kind === 'team' && m.home.teamId === team.id;
                const oppRef = isHome ? m.away : m.home;
                const oppId = oppRef.kind === 'team' ? oppRef.teamId : undefined;
                const opp = getTeam(oppId);
                const v = VENUES[m.venueId];
                const live = oppId ? resultForPair(liveMatches, team.id, oppId) : undefined;
                const played = live && live.status !== 'scheduled';
                const r = played ? resultFor(live, team.id) : null;
                return (
                  <li key={m.id} className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">{isHome ? 'vs' : '@'}</span>
                      {opp && <Flag team={opp} size={16} />}
                      <Link
                        to={`/team/${opp?.id}`}
                        className="font-semibold text-slate-100 hover:text-pitch-300"
                      >
                        {opp?.name}
                      </Link>
                      {played && (
                        <span className="ml-auto flex items-center gap-1.5">
                          {live?.status === 'live' && (
                            <span className="text-[10px] font-bold uppercase text-rose-400">
                              {liveStatusLabel(live)}
                            </span>
                          )}
                          <span className="font-bold tabular-nums text-white">
                            {scoreText(live)}
                          </span>
                          {r && <ResultBadge r={r} size="sm" />}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {clock.date(m.kickoff)} · {clock.time(m.kickoff)} · {v?.stadium}, {v?.city}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Right: squad */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-white/10 bg-ink-850/70 p-4">
            <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-slate-400">
              World Cup squad
            </h2>
            {team.squad && team.squad.length > 0 ? (
              <div className="space-y-5">
                {POSITION_ORDER.map((pos) => {
                  const players = team.squad!.filter((p) => p.position === pos);
                  if (players.length === 0) return null;
                  return (
                    <div key={pos}>
                      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-pitch-400">
                        {POSITION_LABEL[pos]}
                      </h3>
                      <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                        {players.map((p) => (
                          <li
                            key={p.name}
                            className="flex items-center gap-2.5 rounded-lg bg-white/[0.03] px-2.5 py-1.5"
                          >
                            <PlayerAvatar player={p} kit={team.kits?.home} size={40} />
                            <span className="w-5 text-center text-xs font-bold text-slate-500 tabular-nums">
                              {p.number ?? '–'}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-slate-100">
                                {p.name}
                                {p.captain && (
                                  <span className="ml-1.5 rounded bg-amber-400/20 px-1 text-[9px] font-bold text-amber-300">
                                    C
                                  </span>
                                )}
                              </p>
                              <p className="truncate text-[11px] text-slate-500">{p.club}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-white/15 p-6 text-center">
                <p className="text-sm text-slate-300">
                  Full 26-player squad list is being verified for this team.
                </p>
                <a
                  href={mylineupsUrl(team)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-pitch-400 hover:underline"
                >
                  See the latest starting XI on mylineups.app ↗
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
