import React, { useCallback, useState } from 'react';
import { useBracket } from './bracketStore';
import { getTeam } from '../data/teams';
import { championOf, KO_COLUMNS, type ResolvedBracket } from '../utils/bracket';
import { MATCHES_BY_ID } from '../data/schedule';
import { slotLabel } from './MatchCard';

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

/** One match cell: two team rows (codes / slot labels), winner highlighted. */
function drawCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  id: number,
  resolved: ResolvedBracket,
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
    const isWin = !!team && winner === team.id;
    if (isWin) {
      ctx.save();
      roundRectPath(ctx, x, y, w, CELL_H, 6);
      ctx.clip();
      ctx.fillStyle = 'rgba(16,185,129,0.22)';
      ctx.fillRect(x, top, w, rowH);
      ctx.restore();
    }
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = `700 12px ${FONT}`;
    ctx.fillStyle = team ? (isWin ? '#ffffff' : '#94a3b8') : '#475569';
    ctx.fillText(team ? team.code : fallback, x + 10, top + rowH / 2 + 0.5);
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
  const drawPill = (
    segments: { text: string; color: string; font: string }[],
    border: string,
    fill: string,
  ) => {
    const padX = 12;
    const gap = 8;
    let inner = 0;
    segments.forEach((s, i) => {
      ctx.font = s.font;
      inner += ctx.measureText(s.text).width + (i ? gap : 0);
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
      ctx.font = s.font;
      ctx.fillStyle = s.color;
      ctx.fillText(s.text, tx, y + h / 2 + 0.5);
      tx += ctx.measureText(s.text).width + gap;
    });
    rx = x - 10;
  };

  const champ = getTeam(championOf(resolved) ?? undefined);
  if (champ) {
    drawPill(
      [
        { text: 'CHAMPION', color: 'rgba(252,211,77,0.9)', font: `800 11px ${FONT}` },
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
      drawCell(ctx, colX, yc - CELL_H / 2, colW, id, resolved);
    });
  });

  // Footer
  ctx.fillStyle = '#64748b';
  ctx.font = `600 13px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('onbuyuka.github.io/world-cup-2026', W / 2, H - footerH / 2);

  return cv.toDataURL('image/png');
}

export const ShareBar: React.FC = () => {
  const { buildShareUrl, score, resolved } = useBracket();
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

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

  const btn =
    'rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-bold uppercase tracking-wider text-slate-500">Share</span>
      <button type="button" onClick={copyLink} className={btn}>
        {copied ? '✓ Link copied' : '🔗 Copy link'}
      </button>
      <button
        type="button"
        onClick={saveImage}
        disabled={busy}
        className={`inline-flex items-center gap-1.5 ${btn}`}
      >
        <DownloadIcon />
        {busy ? 'Saving…' : 'Save image'}
      </button>
      <button type="button" onClick={tweet} className={btn}>
        𝕏 Share on X
      </button>
    </div>
  );
};

const SCORE_OPEN_KEY = 'wc2026-score-open';

/**
 * Live scorecard, hidden behind a "Score my bracket" toggle so it doesn't
 * clutter the page. The toggle only appears once something has been decided
 * (score.possible > 0). Open/closed state is remembered.
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

  // Nothing decided yet -> no score to show.
  if (score.possible === 0) return null;

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
        <div className="mt-2 flex flex-wrap items-center gap-4 rounded-xl border border-emerald-400/30 bg-emerald-500/[0.06] p-3 animate-fade-in">
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
      )}
    </div>
  );
};
