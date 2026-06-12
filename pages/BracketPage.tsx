import React from 'react';
import { GROUP_IDS } from '../data/groups';
import { BracketProvider, useBracket } from '../components/bracketStore';
import { useLive } from '../components/liveStore';
import { useT } from '../components/settingsStore';
import { GroupCard } from '../components/GroupCard';
import { KnockoutBracket } from '../components/KnockoutBracket';
import { ScoreCard, WinnerCelebration } from '../components/ShareScore';

/** Banner shown when viewing a bracket opened from a shared link. */
const SharedBanner: React.FC = () => {
  const { sharedView, saveSharedAsMine, dismissShared } = useBracket();
  if (!sharedView) return null;
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-sky-400/40 bg-sky-500/10 p-3">
      <span className="text-lg">👀</span>
      <p className="text-sm font-semibold text-sky-200">
        You’re viewing a shared bracket. Your own saved bracket is untouched.
      </p>
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={saveSharedAsMine}
          className="rounded-lg bg-sky-500/90 px-3 py-1.5 text-xs font-bold text-white hover:bg-sky-400"
        >
          Save as my bracket
        </button>
        <button
          type="button"
          onClick={dismissShared}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/5"
        >
          Back to mine
        </button>
      </div>
    </div>
  );
};

const LiveToggle: React.FC = () => {
  const { liveMode, setLiveMode, hasResults, updated, loading, livePolling } = useLive();
  const { t } = useT();
  return (
    <div className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1">
      <button
        type="button"
        role="switch"
        aria-checked={liveMode}
        onClick={() => setLiveMode(!liveMode)}
        title={hasResults ? t('live.titleOn') : t('live.titleOff')}
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
        {liveMode ? t('live.on') : t('live.off')}
      </button>
      {liveMode && (
        <span className="whitespace-nowrap text-[11px] text-slate-500" title={updated ? `${new Date(updated).toLocaleString()}` : undefined}>
          {loading
            ? t('live.loading')
            : hasResults
              ? livePolling
                ? t('live.autoUpdating')
                : updated
                  ? t('live.updated', { time: new Date(updated).toLocaleTimeString() })
                  : t('live.live')
              : t('live.noResults')}
        </span>
      )}
    </div>
  );
};

const Toolbar: React.FC = () => {
  const {
    thirdCount,
    resetAll,
    liveActive,
    groupStageComplete,
    liveThirdsCustomized,
    resetLiveThirds,
  } = useBracket();
  const { t } = useT();
  const complete = thirdCount === 8;
  const hint = liveActive
    ? groupStageComplete
      ? liveThirdsCustomized
        ? t('hint.liveCustom')
        : t('hint.liveAuto')
      : t('hint.liveGroups')
    : complete
      ? t('hint.complete')
      : t('hint.pick');
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-ink-850/70 p-3">
      <div
        className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-bold ${
          complete ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-400/15 text-amber-300'
        }`}
      >
        {t('toolbar.thirds', { n: thirdCount })}
      </div>
      <p className="min-w-0 flex-1 truncate text-xs text-slate-400" title={hint}>
        {hint}
      </p>
      <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
        {liveActive && liveThirdsCustomized && (
          <button
            type="button"
            onClick={resetLiveThirds}
            title={t('toolbar.reset3rdsTitle')}
            className="whitespace-nowrap rounded-lg bg-sky-500/15 px-3 py-1.5 text-xs font-semibold text-sky-300 hover:bg-sky-500/25"
          >
            {t('toolbar.reset3rds')}
          </button>
        )}
        <LiveToggle />
        <button
          type="button"
          onClick={resetAll}
          className="whitespace-nowrap rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/5"
        >
          {t('toolbar.resetBracket')}
        </button>
      </div>
    </div>
  );
};

export const BracketPage: React.FC = () => {
  const { t } = useT();
  return (
  <BracketProvider>
    <section className="animate-fade-in">
      <WinnerCelebration />
      <div className="mb-5">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          {t('bracket.title')}
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-400">
          {t('bracket.desc')}
        </p>
      </div>

      <SharedBanner />
      <ScoreCard />
      <Toolbar />

      {/* Group stage */}
      <h2 className="mb-3 font-display text-lg font-bold text-white">{t('bracket.groupStage')}</h2>
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {GROUP_IDS.map((g) => (
          <GroupCard key={g} group={g} />
        ))}
      </div>

      {/* Knockout */}
      <h2 className="mb-3 font-display text-lg font-bold text-white">{t('bracket.knockoutStage')}</h2>
      <div className="rounded-2xl border border-white/10 bg-ink-850/40 p-4">
        <KnockoutBracket />
      </div>
    </section>
  </BracketProvider>
  );
};
