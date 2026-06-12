import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GROUPS } from '../data/groups';
import { getTeam } from '../data/teams';
import { Jersey } from '../components/Jersey';
import { Flag } from '../components/Flag';
import { useT } from '../components/settingsStore';
import { teamName } from '../utils/i18n';

export const TeamsPage: React.FC = () => {
  const [q, setQ] = useState('');
  const { t, lang } = useT();
  const query = q.trim().toLowerCase();

  return (
    <section className="animate-fade-in">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {t('teams.count')}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {t('teams.desc')}
          </p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('teams.search')}
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
                {t('group.label', { id: group.id })}
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {teams.map((team) => (
                  <Link
                    key={team.id}
                    to={`/team/${team.id}`}
                    className="group flex items-center gap-3 rounded-xl border border-white/10 bg-ink-850/70 p-3 transition hover:border-pitch-500/50 hover:bg-ink-850"
                  >
                    {team.kits ? (
                      <Jersey kit={team.kits.home} size={44} />
                    ) : (
                      <Flag team={team} size={32} />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <Flag team={team} size={16} />
                        <span className="truncate font-semibold text-slate-100 group-hover:text-white">
                          {teamName(team.id, team.name, lang)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">FIFA #{team.fifaRank}</p>
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
