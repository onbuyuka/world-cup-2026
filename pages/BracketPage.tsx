import React from 'react';
import { GROUP_IDS } from '../data/groups';
import { BracketProvider, useBracket } from '../components/bracketStore';
import { useLive } from '../components/liveStore';
import { GroupCard } from '../components/GroupCard';
import { KnockoutBracket } from '../components/KnockoutBracket';

const LiveToggle: React.FC = () => {
  const { liveMode, setLiveMode, hasResults, updated, loading, livePolling } = useLive();
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={liveMode}
        onClick={() => setLiveMode(!liveMode)}
        title={
          hasResults
            ? 'Order groups by real World Cup points'
            : 'Switch to the live points view (everyone on 0 until games are played)'
        }
        className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-bold transition ${
          liveMode
            ? 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-400/40'
            : 'bg-white/5 text-slate-300 hover:bg-white/10'
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            liveMode ? 'animate-pulse bg-rose-400' : 'bg-slate-500'
          }`}
        />
        {liveMode ? 'Live results: ON' : 'Live results: OFF'}
      </button>
      {liveMode && (
        <span className="text-[11px] text-slate-500" title={updated ? `Last updated ${new Date(updated).toLocaleString()}` : undefined}>
          {loading
            ? 'loading…'
            : hasResults
              ? livePolling
                ? '🔴 live · auto-updating'
                : updated
                  ? `updated ${new Date(updated).toLocaleTimeString()}`
                  : 'live'
              : 'no results yet'}
        </span>
      )}
    </div>
  );
};

const Toolbar: React.FC = () => {
  const { thirdCount, resetAll, liveActive } = useBracket();
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
        {liveActive
          ? 'Live mode follows real results as matches are played — group order and knockout winners update automatically. Reorder groups or pick winners for “what-if” scenarios; your saved prediction stays separate.'
          : complete
            ? 'All eight third-placed qualifiers chosen — the Round of 32 is set.'
            : 'Tap “3rd +” on third-placed teams until you have eight; they slot into the Round of 32 per FIFA’s rules.'}
      </p>
      <div className="ml-auto flex items-center gap-3">
        <LiveToggle />
        <button
          type="button"
          onClick={resetAll}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/5"
        >
          Reset bracket
        </button>
      </div>
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
