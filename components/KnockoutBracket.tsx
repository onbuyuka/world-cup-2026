import React from 'react';
import { getTeam } from '../data/teams';
import { championOf, KO_COLUMNS } from '../utils/bracket';
import { useBracket } from './bracketStore';
import { MatchCard } from './MatchCard';
import { Flag } from './Flag';
import { ShareButtons } from './ShareScore';

const COLUMNS = KO_COLUMNS;

export const KnockoutBracket: React.FC = () => {
  const { resolved } = useBracket();
  const champion = getTeam(championOf(resolved) ?? undefined);

  return (
    <div>
      {/* Champion banner */}
      <div className="mb-4 flex items-center justify-center">
        {champion ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/20 to-amber-300/5 px-5 py-3 animate-fade-in sm:flex-row sm:gap-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-300/80">
                  Your predicted champion
                </p>
                <p className="flex items-center gap-2 font-display text-xl font-extrabold text-white">
                  <Flag team={champion} size={22} />
                  {champion.name}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:border-l sm:border-amber-400/20 sm:pl-5">
              <ShareButtons compact />
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
          {COLUMNS.map((col) => {
            const isFinal = col.short === 'Final';
            return (
              <div key={col.label} className="flex flex-col">
                <h3 className="mb-2 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {col.label}
                </h3>
                {isFinal ? (
                  // Keep the final and the third-place play-off together so the
                  // bronze match isn't stranded far below the bracket.
                  <div className="flex flex-1 flex-col items-center justify-center gap-6">
                    {col.ids.map((id) => (
                      <MatchCard key={id} matchId={id} />
                    ))}
                    <div className="flex flex-col items-center">
                      <h3 className="mb-2 text-center text-[11px] font-bold uppercase tracking-wider text-amber-300/70">
                        🥉 Third-place play-off
                      </h3>
                      <MatchCard matchId={103} />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col justify-around gap-2">
                    {col.ids.map((id) => (
                      <MatchCard key={id} matchId={id} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
