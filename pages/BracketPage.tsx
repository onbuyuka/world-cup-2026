import React from 'react';
import { GROUP_IDS } from '../data/groups';
import { BracketProvider, useBracket } from '../components/bracketStore';
import { GroupCard } from '../components/GroupCard';
import { KnockoutBracket } from '../components/KnockoutBracket';

const Toolbar: React.FC = () => {
  const { thirdCount, resetAll } = useBracket();
  const complete = thirdCount === 8;
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-ink-850/70 p-3">
      <div
        className={`rounded-lg px-3 py-1.5 text-sm font-bold ${
          complete ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-400/15 text-amber-300'
        }`}
      >
        Best third-placed teams: {thirdCount}/8
      </div>
      <p className="text-xs text-slate-400">
        {complete
          ? 'All eight third-placed qualifiers chosen — the Round of 32 is set.'
          : 'Tap “3rd +” on third-placed teams until you have eight; they slot into the Round of 32 per FIFA’s rules.'}
      </p>
      <button
        type="button"
        onClick={resetAll}
        className="ml-auto rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/5"
      >
        Reset bracket
      </button>
    </div>
  );
};

export const BracketPage: React.FC = () => (
  <BracketProvider>
    <section className="animate-fade-in">
      <div className="mb-5">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Build your World Cup 2026 bracket
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-400">
          Set each group’s final standings, choose the eight best third-placed teams
          that advance, then pick your way through the knockout rounds. Hover any
          team for kits, recent form and a link to its live starting XI. Your picks
          are saved in this browser.
        </p>
      </div>

      <Toolbar />

      {/* Group stage */}
      <h2 className="mb-3 font-display text-lg font-bold text-white">Group stage</h2>
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {GROUP_IDS.map((g) => (
          <GroupCard key={g} group={g} />
        ))}
      </div>

      {/* Knockout */}
      <h2 className="mb-3 font-display text-lg font-bold text-white">Knockout stage</h2>
      <div className="rounded-2xl border border-white/10 bg-ink-850/40 p-4">
        <KnockoutBracket />
      </div>
    </section>
  </BracketProvider>
);
