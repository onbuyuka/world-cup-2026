import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GROUPS } from '../data/groups';
import { getTeam } from '../data/teams';
import { Jersey } from '../components/Jersey';
import { Flag } from '../components/Flag';
import { FormPips } from '../components/RecentForm';

export const TeamsPage: React.FC = () => {
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();

  return (
    <section className="animate-fade-in">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            48 teams
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Tap a team for its full World Cup squad, head coach, kits and recent form.
          </p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search teams…"
          className="w-56 rounded-lg border border-white/10 bg-ink-850 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-pitch-500"
        />
      </div>

      <div className="space-y-8">
        {GROUPS.map((group) => {
          const teams = group.teamIds
            .map((id) => getTeam(id)!)
            .filter((t) => !query || t.name.toLowerCase().includes(query));
          if (teams.length === 0) return null;
          return (
            <div key={group.id}>
              <h2 className="mb-2 font-display text-sm font-bold uppercase tracking-wider text-slate-400">
                Group {group.id}
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {teams.map((t) => (
                  <Link
                    key={t.id}
                    to={`/team/${t.id}`}
                    className="group flex items-center gap-3 rounded-xl border border-white/10 bg-ink-850/70 p-3 transition hover:border-pitch-500/50 hover:bg-ink-850"
                  >
                    {t.kits ? (
                      <Jersey kit={t.kits.home} size={44} />
                    ) : (
                      <Flag team={t} size={32} />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <Flag team={t} size={16} />
                        <span className="truncate font-semibold text-slate-100 group-hover:text-white">
                          {t.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">FIFA #{t.fifaRank}</p>
                      <div className="mt-1">
                        <FormPips form={t.recentForm} max={5} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
