import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useBracket } from './bracketStore';
import { getTeam } from '../data/teams';
import { championOf, KO_COLUMNS, type ResolvedBracket } from '../utils/bracket';
import { POINTS } from '../utils/score';
import { MATCHES_BY_ID } from '../data/schedule';
import { slotLabel } from './MatchCard';
import { Flag, flagPngUrl } from './Flag';

const TWEET_TEXT = 'My 2026 World Cup bracket 🏆 — think you can beat it?';

const DownloadIcon: React.FC = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M12 3v12" />
    <path d="m7 11 5 5 5-5" />
    <path d="M5 21h14" />
  </svg>
);

/* ──────────────────────────────────────────────────────────────────────────
 * Share image — drawn directly on a <canvas>.
 *
 * The whole knockout bracket (R32 → Final) is rendered as a single PNG. We
 * paint it ourselves instead of rasterising the DOM: html-to-image builds a
 * multi-megabyte foreignObject SVG for a bracket this size, which Chromium
 * fails to load back as an <img>, so toCanvas/toPng never resolve. Canvas
 * drawing is instant, deterministic and has no cross-origin font/image quirks.
 * ────────────────────────────────────────────────────────────────────────── */

const FONT = 'Inter, system-ui, -apple-system, "Segoe UI", sans-serif';
const CELL_H = 44;
const FLAG_W = 20;
const FLAG_H = 13;

/** team id -> loaded flag image (for canvas drawing). */
type FlagMap = Map<string, HTMLImageElement>;

/**
 * Session-wide cache of decoded flag images, keyed by URL. The CORS flag
 * fetches the canvas needs are a *separate* cache entry from the DOM's
 * (non-CORS) flag <img>s, so without this the first "Save image" re-downloads
 * every flag — the slow part. We cache the in-flight promise so repeat saves
 * (and the background warm-up) reuse one fetch per flag.
 */
const flagImgCache = new Map<string, Promise<HTMLImageElement | null>>();

/** Load an image for canvas use; resolves null on error so it never rejects. */
function loadImage(src: string): Promise<HTMLImageElement | null> {
  const cached = flagImgCache.get(src);
  if (cached) return cached;
  const p = new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
  flagImgCache.set(src, p);
  return p;
}

/** Every team currently placed somewhere in the knockout bracket. */
function bracketTeamIds(resolved: ResolvedBracket): Set<string> {
  const ids = new Set<string>();
  for (const col of KO_COLUMNS) {
    for (const id of col.ids) {
      const rm = resolved.matches[id];
      if (rm?.home) ids.add(rm.home);
      if (rm?.away) ids.add(rm.away);
    }
  }
  // Third-place play-off (drawn below the final).
  const tp = resolved.matches[103];
  if (tp?.home) ids.add(tp.home);
  if (tp?.away) ids.add(tp.away);
  return ids;
}

/**
 * Kick off (and cache) the flag downloads for the current bracket in the
 * background, so a later "Save image" finds them ready and feels instant.
 */
function warmFlagCache(resolved: ResolvedBracket) {
  for (const tid of bracketTeamIds(resolved)) {
    const url = flagPngUrl(tid);
    if (url) void loadImage(url);
  }
}

/** Draw a flag rect with a hairline border, returning its right edge. */
function drawFlag(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  cy: number,
  w = FLAG_W,
  h = FLAG_H,
) {
  const y = cy - h / 2;
  ctx.drawImage(img, x, y, w, h);
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  return x + w;
}

/** Path a rounded rectangle (we avoid ctx.roundRect for wider support). */
function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

/** One match cell: two team rows (flag + code / slot labels), winner lit. */
function drawCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  id: number,
  resolved: ResolvedBracket,
  flags: FlagMap,
) {
  const rm = resolved.matches[id];
  const m = MATCHES_BY_ID[id];
  const home = getTeam(rm?.home ?? undefined);
  const away = getTeam(rm?.away ?? undefined);
  const winner = rm?.winner ?? null;
  const rowH = CELL_H / 2;

  roundRectPath(ctx, x, y, w, CELL_H, 6);
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
  ctx.stroke();

  const row = (team: ReturnType<typeof getTeam>, fallback: string, idx: number) => {
    const top = y + idx * rowH;
    const cy = top + rowH / 2;
    const isWin = !!team && winner === team.id;
    if (isWin) {
      ctx.save();
      roundRectPath(ctx, x, y, w, CELL_H, 6);
      ctx.clip();
      ctx.fillStyle = 'rgba(16,185,129,0.22)';
      ctx.fillRect(x, top, w, rowH);
      ctx.restore();
    }
    let tx = x + 10;
    const flag = team ? flags.get(team.id) : undefined;
    if (flag) {
      tx = drawFlag(ctx, flag, x + 9, cy) + 7;
    }
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = `700 12px ${FONT}`;
    ctx.fillStyle = team ? (isWin ? '#ffffff' : '#94a3b8') : '#475569';
    ctx.fillText(team ? team.code : fallback, tx, cy + 0.5);
  };

  row(home, slotLabel(m.home).slice(0, 16), 0);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 1, y + rowH);
  ctx.lineTo(x + w - 1, y + rowH);
  ctx.stroke();
  row(away, slotLabel(m.away).slice(0, 16), 1);
}

/** Render the full knockout bracket to a PNG data URL. */
async function renderBracketImage(
  resolved: ResolvedBracket,
  scoreTotal: number,
  possible: number,
): Promise<string> {
  // Ensure the web font is loaded so canvas text uses Inter (else system-ui).
  try {
    await (document as Document & { fonts?: FontFaceSet }).fonts?.ready;
  } catch {
    /* ignore */
  }

  // Preload every flag in the bracket (deduped, cached) so we can draw them on
  // the canvas. flagcdn allows cross-origin canvas use, so the PNG stays
  // untainted; any flag that fails to load is simply skipped (code still shows).
  const champId = championOf(resolved);
  const teamIds = bracketTeamIds(resolved);
  const flags: FlagMap = new Map();
  await Promise.all(
    [...teamIds].map(async (tid) => {
      const url = flagPngUrl(tid);
      if (!url) return;
      const img = await loadImage(url);
      if (img) flags.set(tid, img);
    }),
  );

  const scale = 2;
  const W = 1180;
  const pad = 32;
  const headerH = 92;
  const colHeadH = 24;
  const band = 56; // vertical unit per R32 leaf
  const rows = 16;
  const contentH = rows * band;
  const contentTop = pad + headerH;
  const cellsTop = contentTop + colHeadH;
  const footerH = 44;
  const H = cellsTop + contentH + footerH;

  const cv = document.createElement('canvas');
  cv.width = W * scale;
  cv.height = H * scale;
  const ctx = cv.getContext('2d');
  if (!ctx) throw new Error('no 2d context');
  ctx.scale(scale, scale);

  // Background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0b1119');
  bg.addColorStop(1, '#0a0e14');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Title
  const titleY = pad + 22;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 30px ${FONT}`;
  ctx.fillText('🏆 World Cup 2026 — my bracket', pad, titleY);

  // Right-aligned header pills (champion, then score), drawn right → left.
  let rx = W - pad;
  type PillSeg =
    | { text: string; color: string; font: string }
    | { flag: HTMLImageElement };
  const segW = (s: PillSeg) => {
    if ('flag' in s) return FLAG_W;
    ctx.font = s.font;
    return ctx.measureText(s.text).width;
  };
  const drawPill = (segments: PillSeg[], border: string, fill: string) => {
    const padX = 12;
    const gap = 8;
    let inner = 0;
    segments.forEach((s, i) => {
      inner += segW(s) + (i ? gap : 0);
    });
    const w = inner + padX * 2;
    const h = 30;
    const x = rx - w;
    const y = titleY - h / 2;
    roundRectPath(ctx, x, y, w, h, 8);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = border;
    ctx.stroke();
    let tx = x + padX;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    segments.forEach((s) => {
      if ('flag' in s) {
        drawFlag(ctx, s.flag, tx, titleY);
      } else {
        ctx.font = s.font;
        ctx.fillStyle = s.color;
        ctx.fillText(s.text, tx, titleY + 0.5);
      }
      tx += segW(s) + gap;
    });
    rx = x - 10;
  };

  const champ = getTeam(champId ?? undefined);
  if (champ) {
    const champFlag = champId ? flags.get(champId) : undefined;
    drawPill(
      [
        { text: 'CHAMPION', color: 'rgba(252,211,77,0.9)', font: `800 11px ${FONT}` },
        ...(champFlag ? [{ flag: champFlag }] : []),
        { text: champ.name, color: '#ffffff', font: `800 15px ${FONT}` },
      ],
      'rgba(251,191,36,0.45)',
      'rgba(245,158,11,0.16)',
    );
  }
  if (possible > 0) {
    drawPill(
      [{ text: `Score ${scoreTotal}/${possible}`, color: '#6ee7b7', font: `800 14px ${FONT}` }],
      'rgba(52,211,153,0.35)',
      'rgba(16,185,129,0.12)',
    );
  }

  // Column headers + match cells (a proper bracket: each round's cell is
  // vertically centred on the midpoint of the two cells that feed it).
  const colGap = 16;
  const colW = (W - pad * 2 - colGap * 4) / 5;
  KO_COLUMNS.forEach((col, r) => {
    const colX = pad + r * (colW + colGap);
    ctx.fillStyle = '#64748b';
    ctx.font = `700 11px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(col.short.toUpperCase(), colX + colW / 2, contentTop + colHeadH / 2);
    const step = Math.pow(2, r) * band;
    col.ids.forEach((id, i) => {
      const yc = cellsTop + (i + 0.5) * step;
      drawCell(ctx, colX, yc - CELL_H / 2, colW, id, resolved, flags);
    });
  });

  // Third-place play-off, drawn just below the final so it isn't missed.
  const finalColX = pad + 4 * (colW + colGap);
  const finalYc = cellsTop + 0.5 * Math.pow(2, 4) * band;
  const tpLabelY = finalYc + CELL_H / 2 + 26;
  ctx.fillStyle = 'rgba(252,211,77,0.8)';
  ctx.font = `700 11px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🥉 THIRD PLACE', finalColX + colW / 2, tpLabelY);
  drawCell(ctx, finalColX, tpLabelY + 14, colW, 103, resolved, flags);

  // Footer
  ctx.fillStyle = '#64748b';
  ctx.font = `600 13px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('onbuyuka.github.io/world-cup-2026', W / 2, H - footerH / 2);

  return cv.toDataURL('image/png');
}

/** Shared copy/save/tweet actions, reused by the bar and the winner popup. */
function useShareActions() {
  const { buildShareUrl, score, resolved } = useBracket();
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  // Warm the flag cache in the background whenever the bracket changes, so a
  // later "Save image" click finds every flag already downloaded.
  useEffect(() => {
    warmFlagCache(resolved);
  }, [resolved]);

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
    setBusy(true);
    try {
      const dataUrl = await renderBracketImage(resolved, score.total, score.possible);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'my-world-cup-2026-bracket.png';
      a.click();
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  }, [resolved, score.total, score.possible]);

  const tweet = useCallback(() => {
    const url = buildShareUrl();
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      TWEET_TEXT,
    )}&url=${encodeURIComponent(url)}`;
    window.open(intent, '_blank', 'noopener,noreferrer');
  }, [buildShareUrl]);

  return { copied, busy, copyLink, saveImage, tweet };
}

/**
 * The three share actions (copy link / save image / share on X) as buttons.
 * Reused by the winner popup and the "Your predicted champion" banner; the
 * caller wraps them in its own flex container. `compact` shrinks them for the
 * banner.
 */
export const ShareButtons: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const { copied, busy, copyLink, saveImage, tweet } = useShareActions();
  const base = `inline-flex items-center justify-center gap-1.5 rounded-lg font-bold transition ${
    compact ? 'px-2.5 py-1.5 text-xs' : 'px-4 py-2 text-sm'
  }`;
  return (
    <>
      <button
        type="button"
        onClick={copyLink}
        className={`${base} border border-white/15 text-slate-200 hover:bg-white/10`}
      >
        {copied ? '✓ Link copied' : '🔗 Copy link'}
      </button>
      <button
        type="button"
        onClick={saveImage}
        disabled={busy}
        className={`${base} bg-emerald-500/90 text-white hover:bg-emerald-400 disabled:opacity-60`}
      >
        <DownloadIcon />
        {busy ? 'Saving…' : 'Save image'}
      </button>
      <button
        type="button"
        onClick={tweet}
        className={`${base} border border-white/15 text-slate-200 hover:bg-white/10`}
      >
        𝕏 Share on X
      </button>
    </>
  );
};

/**
 * Celebration popup shown the moment a champion is first chosen (the bracket is
 * complete). It congratulates the user and surfaces the share actions. It fires
 * only on the null → champion transition (not on page load of an already-complete
 * bracket, and not while previewing someone else's shared bracket).
 */
export const WinnerCelebration: React.FC = () => {
  const { resolved, sharedView } = useBracket();
  const champId = championOf(resolved);
  const champ = getTeam(champId ?? undefined);
  const prev = useRef<string | null>(champId);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sharedView) {
      prev.current = champId;
      return;
    }
    if (champId && !prev.current) setShow(true);
    if (!champId) setShow(false);
    prev.current = champId;
  }, [champId, sharedView]);

  // Close on Escape.
  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShow(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [show]);

  if (!show || !champ) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Bracket complete"
      onClick={() => setShow(false)}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-b from-ink-850 to-ink-900 p-6 text-center shadow-2xl"
      >
        <button
          type="button"
          onClick={() => setShow(false)}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-lg p-1 text-lg leading-none text-slate-500 transition hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>

        <div className="text-5xl">🏆</div>
        <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.25em] text-amber-300/80">
          Your champion
        </p>
        <div className="mt-3 flex items-center justify-center gap-3">
          <Flag team={champ} size={34} />
          <span className="font-display text-3xl font-extrabold text-white">{champ.name}</span>
        </div>
        <p className="mx-auto mt-3 max-w-xs text-sm text-slate-400">
          Your bracket is complete — share it and challenge your friends to beat it.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <ShareButtons />
        </div>

        <button
          type="button"
          onClick={() => setShow(false)}
          className="mt-4 text-xs font-semibold text-slate-500 transition hover:text-slate-300"
        >
          Keep editing
        </button>
      </div>
    </div>
  );
};

const SCORE_OPEN_KEY = 'wc2026-score-open';

const InfoIcon: React.FC = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <path d="M12 7.6h.01" />
  </svg>
);

// Sourced from POINTS so the help can never drift from the real scoring.
const SCORING_ROWS: { label: string; pts: number }[] = [
  { label: 'Correct group winner', pts: POINTS.groupWinner },
  { label: 'Correct group runner-up', pts: POINTS.groupRunnerUp },
  { label: 'Best third-placed team that advances', pts: POINTS.thirdAdvances },
  { label: 'Round of 32 — team advances', pts: POINTS.r32 },
  { label: 'Round of 16 — team advances', pts: POINTS.r16 },
  { label: 'Quarter-final — team advances', pts: POINTS.qf },
  { label: 'Semi-final — team advances', pts: POINTS.sf },
  { label: 'Third-place play-off winner', pts: POINTS.thirdPlaceMatch },
  { label: 'Champion (wins the final)', pts: POINTS.champion },
];

/** Explanation of how a bracket is graded; toggled by the ⓘ button. */
const ScoringHelp: React.FC = () => (
  <div className="mt-3 border-t border-emerald-400/20 pt-3 animate-fade-in">
    <p className="mb-2 text-xs text-slate-400">
      Your prediction is graded against real results. Points are awarded only for
      outcomes that have actually been decided, so your score climbs as the
      tournament unfolds. The “/ N so far” figure is the most you could have earned
      from decided matches — so any two brackets stay directly comparable.
    </p>
    <ul className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
      {SCORING_ROWS.map((r) => (
        <li
          key={r.label}
          className="flex items-center justify-between gap-3 border-b border-white/5 py-1 text-xs text-slate-300"
        >
          <span>{r.label}</span>
          <span className="shrink-0 font-bold tabular-nums text-emerald-300">+{r.pts}</span>
        </li>
      ))}
    </ul>
    <p className="mt-2 text-[11px] text-slate-500">
      Knockout points are awarded per round for each team you correctly predicted to
      reach the next stage — deeper rounds are worth more, and naming the champion is
      the biggest prize.
    </p>
  </div>
);

/**
 * Live scorecard, behind a "Score my bracket" toggle so it doesn't clutter the
 * page. The toggle is always available; before any results exist it simply
 * shows 0. Open/closed state is remembered.
 */
export const ScoreCard: React.FC = () => {
  const { score } = useBracket();
  const [open, setOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SCORE_OPEN_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [showHelp, setShowHelp] = useState(false);
  const toggle = useCallback(() => {
    setOpen((v) => {
      const next = !v;
      try {
        localStorage.setItem(SCORE_OPEN_KEY, next ? '1' : '0');
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const nothingToScore = score.possible === 0;

  const Stat: React.FC<{ label: string; value: number }> = ({ label, value }) => (
    <div className="flex flex-col items-center">
      <span className="font-display text-lg font-extrabold text-white">{value}</span>
      <span className="text-[10px] uppercase tracking-wider text-slate-500">{label}</span>
    </div>
  );

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-500/[0.08] px-3 py-1.5 text-sm font-bold text-emerald-300 transition hover:bg-emerald-500/15"
      >
        <span>📊</span>
        {open ? 'Hide score' : 'Score my bracket'}
        <span className="text-[10px] text-slate-500">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="mt-2 rounded-xl border border-emerald-400/30 bg-emerald-500/[0.06] p-3 animate-fade-in">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">📊</span>
              <div>
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-300/80">
                  Your bracket score
                  <button
                    type="button"
                    onClick={() => setShowHelp((v) => !v)}
                    aria-expanded={showHelp}
                    aria-label="How scoring works"
                    title="How scoring works"
                    className={`inline-flex items-center justify-center rounded-full p-0.5 transition hover:bg-emerald-400/20 hover:text-emerald-200 ${
                      showHelp ? 'text-emerald-200' : 'text-emerald-300/70'
                    }`}
                  >
                    <InfoIcon />
                  </button>
                </p>
                <p className="font-display text-2xl font-extrabold text-emerald-300">
                  {score.total}
                  <span className="ml-1 text-sm font-semibold text-slate-500">
                    {nothingToScore ? 'pts — no results yet' : `/ ${score.possible} so far`}
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
          {showHelp && <ScoringHelp />}
        </div>
      )}
    </div>
  );
};
