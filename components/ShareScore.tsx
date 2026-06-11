import React, { useCallback, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { useBracket } from './bracketStore';
import { getTeam } from '../data/teams';
import { championOf } from '../utils/bracket';
import { Flag } from './Flag';

const TWEET_TEXT = 'My 2026 World Cup bracket 🏆 — think you can beat it?';

/** A compact, shareable summary card (rendered to PNG for download/social). */
const ShareCard = React.forwardRef<HTMLDivElement, { score: number; possible: number }>(
  ({ score, possible }, ref) => {
    const { resolved } = useBracket();
    const champ = getTeam(championOf(resolved) ?? undefined);
    const finalMatch = resolved.matches[104];
    const runnerUp =
      finalMatch && champ
        ? getTeam(
            (finalMatch.winner === finalMatch.home ? finalMatch.away : finalMatch.home) ??
              undefined,
          )
        : undefined;
    return (
      <div
        ref={ref}
        className="w-[600px] bg-gradient-to-br from-ink-900 to-ink-850 p-8"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        <div className="flex items-center justify-between">
          <span className="text-2xl font-extrabold tracking-tight text-white">
            🏆 World Cup 2026
          </span>
          <span className="rounded-lg bg-white/10 px-3 py-1 text-sm font-bold text-slate-200">
            My bracket
          </span>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/20 to-transparent p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-amber-300/80">
            Predicted champion
          </p>
          {champ ? (
            <div className="mt-2 flex items-center gap-3">
              <Flag team={champ} size={34} />
              <span className="font-display text-3xl font-extrabold text-white">{champ.name}</span>
            </div>
          ) : (
            <p className="mt-2 text-lg text-slate-400">Not decided yet</p>
          )}
          {runnerUp && (
            <p className="mt-2 text-sm text-slate-400">
              over <span className="text-slate-200">{runnerUp.name}</span> in the final
            </p>
          )}
        </div>

        {possible > 0 && (
          <div className="mt-5 flex items-end justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                Live score
              </p>
              <p className="mt-1 font-display text-2xl font-extrabold text-emerald-300">
                {score} pts
              </p>
            </div>
            <p className="text-xs text-slate-500">of {possible} decided so far</p>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-slate-500">
          onbuyuka.github.io/world-cup-2026
        </p>
      </div>
    );
  },
);
ShareCard.displayName = 'ShareCard';

export const ShareBar: React.FC = () => {
  const { buildShareUrl, score } = useBracket();
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const copyLink = useCallback(async () => {
    const url = buildShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy your bracket link:', url);
    }
  }, [buildShareUrl]);

  const saveImage = useCallback(async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      // skipFonts: the card uses a system font stack inline, and embedding the
      // cross-origin Google Fonts stylesheet isn't permitted (and isn't needed).
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: true,
        backgroundColor: '#0a0e14',
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'my-world-cup-2026-bracket.png';
      a.click();
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  }, []);

  const tweet = useCallback(() => {
    const url = buildShareUrl();
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      TWEET_TEXT,
    )}&url=${encodeURIComponent(url)}`;
    window.open(intent, '_blank', 'noopener,noreferrer');
  }, [buildShareUrl]);

  const btn =
    'rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-bold uppercase tracking-wider text-slate-500">Share</span>
      <button type="button" onClick={copyLink} className={btn}>
        {copied ? '✓ Link copied' : '🔗 Copy link'}
      </button>
      <button type="button" onClick={saveImage} disabled={busy} className={btn}>
        {busy ? 'Saving…' : '🖼 Save image'}
      </button>
      <button type="button" onClick={tweet} className={btn}>
        𝕏 Share on X
      </button>

      {/* Off-screen card used only for the PNG export. */}
      <div className="pointer-events-none fixed -left-[9999px] top-0" aria-hidden>
        <ShareCard ref={cardRef} score={score.total} possible={score.possible} />
      </div>
    </div>
  );
};

/** Live scorecard: how the prediction is doing against real results. */
export const ScoreCard: React.FC = () => {
  const { score } = useBracket();
  if (score.possible === 0) return null;
  const Stat: React.FC<{ label: string; value: number }> = ({ label, value }) => (
    <div className="flex flex-col items-center">
      <span className="font-display text-lg font-extrabold text-white">{value}</span>
      <span className="text-[10px] uppercase tracking-wider text-slate-500">{label}</span>
    </div>
  );
  return (
    <div className="mb-4 flex flex-wrap items-center gap-4 rounded-xl border border-emerald-400/30 bg-emerald-500/[0.06] p-3">
      <div className="flex items-center gap-3">
        <span className="text-xl">📊</span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300/80">
            Your bracket score
          </p>
          <p className="font-display text-2xl font-extrabold text-emerald-300">
            {score.total}
            <span className="ml-1 text-sm font-semibold text-slate-500">
              / {score.possible} so far
            </span>
          </p>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-5">
        <Stat label="Groups" value={score.groupPoints} />
        <Stat label="3rds" value={score.thirdsPoints} />
        <Stat label="Knockout" value={score.knockoutPoints} />
        <Stat label="Correct" value={score.correct} />
      </div>
    </div>
  );
};
