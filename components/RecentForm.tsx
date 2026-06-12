import React from 'react';
import type { FormMatch, MatchResult } from '../types';
import { useT } from './settingsStore';

const RESULT_STYLES: Record<MatchResult, string> = {
  W: 'bg-emerald-500 text-emerald-950',
  D: 'bg-amber-400 text-amber-950',
  L: 'bg-rose-500 text-rose-950',
};

export const ResultBadge: React.FC<{ r: MatchResult; size?: 'sm' | 'md' }> = ({
  r,
  size = 'md',
}) => (
  <span
    className={`inline-flex items-center justify-center rounded font-extrabold ${
      RESULT_STYLES[r]
    } ${size === 'sm' ? 'h-5 w-5 text-[11px]' : 'h-6 w-6 text-xs'}`}
  >
    {r}
  </span>
);

/** Sequence of recent results as coloured pips (most recent first). */
export const FormPips: React.FC<{ form?: FormMatch[]; max?: number }> = ({
  form,
  max = 5,
}) => {
  if (!form || form.length === 0) {
    return <span className="text-xs text-slate-500">—</span>;
  }
  return (
    <span className="inline-flex gap-1">
      {form.slice(-max).reverse().map((m, i) => (
        <ResultBadge key={i} r={m.result} size="sm" />
      ))}
    </span>
  );
};

/** Detailed recent-form list: result, opponent, score, date, competition. */
export const RecentForm: React.FC<{ form?: FormMatch[]; max?: number }> = ({
  form,
  max = 2,
}) => {
  const { t, lang } = useT();
  if (!form || form.length === 0) {
    return (
      <p className="text-xs text-slate-400">
        {t('form.unavailable')}
      </p>
    );
  }
  return (
    <ul className="space-y-1.5">
      {form.slice(-max).reverse().map((m, i) => (
        <li key={i} className="flex items-center gap-2 text-xs">
          <ResultBadge r={m.result} size="sm" />
          <span className="font-semibold text-slate-200 tabular-nums">{m.score}</span>
          <span className="text-slate-400">{m.home ? 'vs' : '@'}</span>
          <span className="truncate text-slate-200">
            {m.opponentFlag ? `${m.opponentFlag} ` : ''}
            {m.opponent}
          </span>
          <span className="ml-auto whitespace-nowrap text-[11px] text-slate-500">
            {m.competition ? `${m.competition} · ` : ''}
            {formatShortDate(m.date, lang)}
          </span>
        </li>
      ))}
    </ul>
  );
};

function formatShortDate(iso: string, lang = 'en'): string {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  }).format(d);
}
