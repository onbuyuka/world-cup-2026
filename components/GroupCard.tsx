import React from 'react';
import type { GroupId } from '../types';
import { getTeam } from '../data/teams';
import { useBracket } from './bracketStore';
import { TeamHover } from './TeamHoverCard';
import { Flag } from './Flag';
import { FormPips } from './RecentForm';

const POS_STYLE = [
  'border-l-emerald-500',
  'border-l-emerald-500',
  'border-l-amber-400',
  'border-l-slate-700',
];

export const GroupCard: React.FC<{ group: GroupId }> = ({ group }) => {
  const { thirdCount, moveTeam, toggleThird, groupView, liveActive, resetLiveGroup, effectiveThirds } =
    useBracket();
  const view = groupView(group);
  const order = view.order;
  const thirdTeamId = order[2];
  const thirdSelected = effectiveThirds.includes(group);
  const thirdDisabled = !thirdSelected && thirdCount >= 8;

  return (
    <div className="rounded-xl border border-white/10 bg-ink-850/70 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-display text-sm font-extrabold tracking-wide text-white">
          Group {group}
        </h3>
        {liveActive ? (
          view.manual ? (
            <button
              type="button"
              onClick={() => resetLiveGroup(group)}
              title="Discard your what-if order and snap back to live results"
              className="rounded bg-sky-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-300 hover:bg-sky-500/25"
            >
              ✎ custom · reset ↺
            </button>
          ) : (
            <span className="rounded bg-rose-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-300">
              ● Live · drag for what-if
            </span>
          )
        ) : (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            drag order with ▲▼
          </span>
        )}
      </div>

      <ul className="space-y-1">
        {order.map((teamId, idx) => {
          const team = getTeam(teamId);
          if (!team) return null;
          const stat = view.table[teamId];
          return (
            <li
              key={teamId}
              className={`flex items-center gap-2 rounded-lg border-l-4 bg-white/[0.03] py-1 pl-2 pr-1 ${POS_STYLE[idx]}`}
            >
              <span className="w-4 text-center text-xs font-bold text-slate-400">
                {idx + 1}
              </span>
              <TeamHover team={team} className="flex min-w-0 flex-1 items-center gap-1.5">
                <Flag team={team} size={16} />
                <span className="truncate text-sm font-semibold text-slate-100">
                  {team.name}
                </span>
              </TeamHover>

              {idx === 2 && (
                <button
                  type="button"
                  onClick={() => toggleThird(group)}
                  disabled={thirdDisabled}
                  title={
                    thirdDisabled
                      ? 'You already chose 8 best third-placed teams'
                      : 'Advance this third-placed team to the Round of 32'
                  }
                  className={`mr-1 rounded px-1.5 py-0.5 text-[10px] font-bold transition ${
                    thirdSelected
                      ? 'bg-amber-400 text-amber-950'
                      : thirdDisabled
                        ? 'cursor-not-allowed bg-white/5 text-slate-600'
                        : 'bg-white/10 text-amber-300 hover:bg-amber-400/20'
                  }`}
                >
                  {thirdSelected ? '3rd ✓' : '3rd +'}
                </button>
              )}

              {liveActive && (
                <span
                  className="w-14 text-right text-[11px] tabular-nums text-slate-400"
                  title={
                    stat?.inPlay
                      ? `Provisional — ${stat.inPlay} match in progress · Played ${stat.pld} · GD ${
                          stat.gd > 0 ? '+' : ''
                        }${stat.gd}`
                      : `Played ${stat?.pld ?? 0} · GD ${
                          stat ? (stat.gd > 0 ? '+' : '') + stat.gd : 0
                        }`
                  }
                >
                  <span className={`font-bold ${stat?.inPlay ? 'text-rose-300' : 'text-white'}`}>
                    {stat?.pts ?? 0}
                  </span>
                  {stat?.inPlay ? '*' : ''} pts
                </span>
              )}

              <div className="flex flex-col">
                <button
                  type="button"
                  aria-label={`Move ${team.name} up`}
                  disabled={idx === 0}
                  onClick={() => moveTeam(group, teamId, -1)}
                  className="px-1 text-xs leading-none text-slate-400 hover:text-white disabled:opacity-20"
                >
                  ▲
                </button>
                <button
                  type="button"
                  aria-label={`Move ${team.name} down`}
                  disabled={idx === 3}
                  onClick={() => moveTeam(group, teamId, 1)}
                  className="px-1 text-xs leading-none text-slate-400 hover:text-white disabled:opacity-20"
                >
                  ▼
                </button>
              </div>

              {!liveActive && (
                <span className="hidden w-16 justify-end sm:flex">
                  <FormPips form={team.recentForm} max={3} />
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {thirdTeamId && (
        <p className="mt-2 text-[10px] text-slate-500">
          3rd place: <span className="text-amber-300">{getTeam(thirdTeamId)?.name}</span>
          {thirdSelected ? ' — advancing' : ''}
        </p>
      )}
    </div>
  );
};

