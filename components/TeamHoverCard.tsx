import React, { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Team } from '../types';
import { mylineupsUrl } from '../data/teams';
import { Jersey } from './Jersey';
import { Flag } from './Flag';
import { RecentForm } from './RecentForm';

const CONF_LABEL: Record<string, string> = {
  UEFA: 'UEFA (Europe)',
  CONMEBOL: 'CONMEBOL (S. America)',
  CONCACAF: 'CONCACAF (N. America)',
  CAF: 'CAF (Africa)',
  AFC: 'AFC (Asia)',
  OFC: 'OFC (Oceania)',
};

/** The popover content shown on hover — a quick decision-making summary. */
export const TeamHoverContent: React.FC<{ team: Team }> = ({ team }) => (
  <div className="w-[320px] overflow-hidden rounded-xl border border-white/10 bg-ink-850 shadow-2xl shadow-black/60 animate-pop-in">
    <div className="flex items-start gap-3 border-b border-white/10 bg-gradient-to-r from-pitch-900/60 to-transparent p-3">
      <Flag team={team} size={30} />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-base font-extrabold text-white">{team.name}</h3>
          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-slate-200">
            FIFA #{team.fifaRank}
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          Group {team.group} · {CONF_LABEL[team.confederation] ?? team.confederation}
        </p>
        {team.coach && (
          <p className="text-[11px] text-slate-400">
            Coach: <span className="text-slate-200">{team.coach}</span>
          </p>
        )}
      </div>
    </div>

    {/* Kits */}
    <div className="flex items-center justify-around gap-2 border-b border-white/10 p-3">
      {team.kits ? (
        <>
          <KitView label="Home" body={team.kits.home} />
          <KitView label="Away" body={team.kits.away} />
        </>
      ) : (
        <p className="py-3 text-xs text-slate-500">Kit colours coming soon</p>
      )}
    </div>

    {/* Recent form */}
    <div className="border-b border-white/10 p-3">
      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        Recent form
      </p>
      <RecentForm form={team.recentForm} max={2} />
    </div>

    {/* Actions */}
    <div className="flex items-center justify-between gap-2 p-2">
      <Link
        to={`/team/${team.id}`}
        className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-pitch-100 hover:bg-white/5"
      >
        Full profile →
      </Link>
      <a
        href={mylineupsUrl(team)}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg bg-pitch-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-pitch-500"
      >
        Live starting XI ↗
      </a>
    </div>
  </div>
);

const KitView: React.FC<{ label: string; body: React.ComponentProps<typeof Jersey>['kit'] }> = ({
  label,
  body,
}) => (
  <div className="flex flex-col items-center gap-1">
    <Jersey kit={body} size={64} />
    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
      {label}
    </span>
    <span className="text-[10px] text-slate-500">{body.label}</span>
  </div>
);

interface HoverProps {
  team: Team;
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps a trigger; shows the team summary card on hover/focus, positioned
 * above or below the trigger and clamped to the viewport.
 */
export const TeamHover: React.FC<HoverProps> = ({ team, children, className }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const [pos, setPos] = useState<{ x: number; y: number; above: boolean } | null>(null);

  const open = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const above = r.top > window.innerHeight - r.bottom; // more room above?
    const x = Math.min(Math.max(r.left + r.width / 2, 170), window.innerWidth - 170);
    const y = above ? r.top - 8 : r.bottom + 8;
    setPos({ x, y, above });
  }, []);

  const close = useCallback(() => {
    closeTimer.current = window.setTimeout(() => setPos(null), 80);
  }, []);

  return (
    <span
      ref={ref}
      className={className}
      onMouseEnter={open}
      onMouseLeave={close}
      onFocus={open}
      onBlur={close}
    >
      {children}
      {pos && (
        <div
          className="pointer-events-auto fixed z-50"
          style={{
            left: pos.x,
            top: pos.y,
            transform: `translate(-50%, ${pos.above ? '-100%' : '0'})`,
          }}
          onMouseEnter={() => window.clearTimeout(closeTimer.current)}
          onMouseLeave={close}
        >
          <TeamHoverContent team={team} />
        </div>
      )}
    </span>
  );
};
