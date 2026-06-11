import React from 'react';
import type { Match, SlotRef } from '../types';
import { MATCHES_BY_ID } from '../data/schedule';
import { getTeam } from '../data/teams';
import { useBracket } from './bracketStore';
import { useLive } from './liveStore';
import { useClock } from './settingsStore';
import { TeamHover } from './TeamHoverCard';
import { Flag } from './Flag';
import { KNOCKOUT_START_DATE } from '../utils/bracket';
import { resultForPair, scoreText, liveStatusLabel } from '../utils/liveTable';

/** Human label for an unresolved slot, e.g. "Winner E", "3rd C/E/F/H/I". */
export function slotLabel(ref: SlotRef): string {
  switch (ref.kind) {
    case 'team':
      return getTeam(ref.teamId)?.name ?? '—';
    case 'winner':
      return `Winner ${ref.group}`;
    case 'runnerUp':
      return `2nd ${ref.group}`;
    case 'third':
      return `3rd ${ref.groups.join('/')}`;
    case 'matchWinner':
      return `Winner M${ref.match}`;
    case 'matchLoser':
      return `Loser M${ref.match}`;
  }
}

const Slot: React.FC<{
  matchId: number;
  teamId: string | null;
  fallback: string;
  isWinner: boolean;
  canPick: boolean;
  goals?: number | null;
}> = ({ matchId, teamId, fallback, isWinner, canPick, goals }) => {
  const { pickWinner } = useBracket();
  const team = getTeam(teamId ?? undefined);

  if (!team) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-slate-500">
        <span className="italic">{fallback}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={!canPick}
      onClick={() => pickWinner(matchId, team.id)}
      className={`flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left transition ${
        isWinner
          ? 'bg-pitch-600/90 text-white'
          : canPick
            ? 'hover:bg-white/10'
            : 'cursor-default'
      }`}
    >
      <TeamHover team={team} className="flex min-w-0 items-center gap-1.5">
        <Flag team={team} size={15} />
        <span
          className={`truncate text-xs font-semibold ${
            isWinner ? 'text-white' : 'text-slate-100'
          }`}
        >
          {team.name}
        </span>
      </TeamHover>
      {goals != null && (
        <span
          className={`ml-auto text-xs font-bold tabular-nums ${
            isWinner ? 'text-white' : 'text-slate-300'
          }`}
        >
          {goals}
        </span>
      )}
    </button>
  );
};

export const MatchCard: React.FC<{ matchId: number; compact?: boolean }> = ({
  matchId,
  compact,
}) => {
  const { resolved, liveActive } = useBracket();
  const { matches: liveMatches } = useLive();
  const clock = useClock();
  const match: Match = MATCHES_BY_ID[matchId];
  const rm = resolved.matches[matchId];
  const home = rm?.home ?? null;
  const away = rm?.away ?? null;
  const bothKnown = Boolean(home && away);

  // In Live mode, surface the real scoreline for a played knockout fixture.
  const live =
    liveActive && home && away
      ? resultForPair(liveMatches, home, away, KNOCKOUT_START_DATE)
      : undefined;
  const played = live && live.status !== 'scheduled';
  const homeGoals =
    played && live ? (live.homeId === home ? live.hs : live.as) : null;
  const awayGoals =
    played && live ? (live.homeId === home ? live.as : live.hs) : null;

  return (
    <div className="w-44 overflow-hidden rounded-lg border border-white/10 bg-ink-850 shadow-sm">
      {!compact && (
        <div className="flex items-center justify-between bg-white/[0.04] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
          <span>M{match.id}</span>
          {played ? (
            <span className="font-bold text-rose-300">{liveStatusLabel(live)}</span>
          ) : (
            <span>
              {clock.date(match.kickoff)} · {clock.time(match.kickoff)}
            </span>
          )}
        </div>
      )}
      <div className="divide-y divide-white/5">
        <Slot
          matchId={matchId}
          teamId={home}
          fallback={slotLabel(match.home)}
          isWinner={rm?.winner === home && home !== null}
          canPick={bothKnown}
          goals={homeGoals}
        />
        <Slot
          matchId={matchId}
          teamId={away}
          fallback={slotLabel(match.away)}
          isWinner={rm?.winner === away && away !== null}
          canPick={bothKnown}
          goals={awayGoals}
        />
      </div>
    </div>
  );
};
