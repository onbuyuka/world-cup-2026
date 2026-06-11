import React from 'react';
import { MATCHES_BY_ID } from '../data/schedule';
import { getTeam } from '../data/teams';
import { KO_MATCHES, championOf } from '../utils/bracket';
import { useBracket } from './bracketStore';
import { MatchCard } from './MatchCard';

// --- bracket tree ordering --------------------------------------------------
const feeders = (id: number): (number | null)[] => {
  const m = MATCHES_BY_ID[id];
  const f = (ref: typeof m.home) => (ref.kind === 'matchWinner' ? ref.match : null);
  return [f(m.home), f(m.away)];
};

const leafOrder = (id: number): number[] => {
  const [h, a] = feeders(id);
  if (h == null && a == null) return [id];
  return [...(h ? leafOrder(h) : []), ...(a ? leafOrder(a) : [])];
};

const parentOf = (child: number): number | undefined =>
  KO_MATCHES.find((m) => feeders(m.id).includes(child))?.id;

const uniqueInOrder = (ids: (number | undefined)[]): number[] => {
  const seen = new Set<number>();
  const out: number[] = [];
  for (const id of ids) {
    if (id != null && !seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
};

const R32 = leafOrder(104);
const R16 = uniqueInOrder(R32.map(parentOf));
const QF = uniqueInOrder(R16.map(parentOf));
const SF = uniqueInOrder(QF.map(parentOf));

const COLUMNS: { label: string; ids: number[] }[] = [
  { label: 'Round of 32', ids: R32 },
  { label: 'Round of 16', ids: R16 },
  { label: 'Quarter-finals', ids: QF },
  { label: 'Semi-finals', ids: SF },
  { label: 'Final', ids: [104] },
];

export const KnockoutBracket: React.FC = () => {
  const { resolved } = useBracket();
  const champion = getTeam(championOf(resolved) ?? undefined);

  return (
    <div>
      {/* Champion banner */}
      <div className="mb-4 flex items-center justify-center">
        {champion ? (
          <div className="flex items-center gap-3 rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/20 to-amber-300/5 px-5 py-3 animate-fade-in">
            <span className="text-3xl">🏆</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-300/80">
                Your predicted champion
              </p>
              <p className="font-display text-xl font-extrabold text-white">
                {champion.flag} {champion.name}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Pick winners through the bracket to crown your champion 🏆
          </p>
        )}
      </div>

      {/* Bracket columns (scroll horizontally on small screens) */}
      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-max gap-4">
          {COLUMNS.map((col) => (
            <div key={col.label} className="flex flex-col">
              <h3 className="mb-2 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {col.label}
              </h3>
              <div className="flex flex-1 flex-col justify-around gap-2">
                {col.ids.map((id) => (
                  <MatchCard key={id} matchId={id} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Third-place play-off */}
      <div className="mt-6 flex flex-col items-center">
        <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Third-place play-off
        </h3>
        <MatchCard matchId={103} />
      </div>
    </div>
  );
};
