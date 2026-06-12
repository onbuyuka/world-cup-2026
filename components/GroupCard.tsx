import React from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { GroupId, Team } from '../types';
import { getTeam } from '../data/teams';
import { useBracket } from './bracketStore';
import { useT } from './settingsStore';
import { TeamHover } from './TeamHoverCard';
import { Flag } from './Flag';
import { FormPips } from './RecentForm';
import type { TeamStat } from '../utils/liveTable';
import { teamName } from '../utils/i18n';

const POS_STYLE = [
  'border-l-emerald-500',
  'border-l-emerald-500',
  'border-l-amber-400',
  'border-l-slate-700',
];

/** Six-dot drag affordance. */
const GripIcon: React.FC = () => (
  <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor" aria-hidden>
    <circle cx="2.5" cy="3" r="1.3" />
    <circle cx="7.5" cy="3" r="1.3" />
    <circle cx="2.5" cy="8" r="1.3" />
    <circle cx="7.5" cy="8" r="1.3" />
    <circle cx="2.5" cy="13" r="1.3" />
    <circle cx="7.5" cy="13" r="1.3" />
  </svg>
);

/** One draggable team row within a group. */
const SortableRow: React.FC<{
  group: GroupId;
  team: Team;
  idx: number;
  stat?: TeamStat;
  liveActive: boolean;
  isThird: boolean;
  thirdSelected: boolean;
  thirdDisabled: boolean;
  onToggleThird: () => void;
}> = ({ group, team, idx, stat, liveActive, isThird, thirdSelected, thirdDisabled, onToggleThird }) => {
  const { t, lang } = useT();
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: team.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-1.5 rounded-lg border-l-4 bg-white/[0.03] py-1 pl-1 pr-1 ${
        POS_STYLE[idx]
      } ${isDragging ? 'relative z-10 shadow-lg ring-1 ring-white/20' : ''}`}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label={t('group.dragRowAria', { team: teamName(team.id, team.name, lang) })}
        title={t('group.dragTitle')}
        className="-my-1 -ml-1 cursor-grab touch-none rounded px-1 py-2 text-slate-500 hover:text-slate-200 active:cursor-grabbing"
      >
        <GripIcon />
      </button>
      <span className="w-4 text-center text-xs font-bold text-slate-400">{idx + 1}</span>
      <TeamHover team={team} className="flex min-w-0 flex-1 items-center gap-1.5">
        <Flag team={team} size={16} />
        <span className="truncate text-sm font-semibold text-slate-100">{teamName(team.id, team.name, lang)}</span>
      </TeamHover>

      {isThird && (
        <button
          type="button"
          onClick={onToggleThird}
          disabled={thirdDisabled}
          title={thirdDisabled ? t('group.thirdFull') : t('group.thirdTitle')}
          className={`mr-1 rounded px-1.5 py-0.5 text-[10px] font-bold transition ${
            thirdSelected
              ? 'bg-amber-400 text-amber-950'
              : thirdDisabled
                ? 'cursor-not-allowed bg-white/5 text-slate-600'
                : 'bg-white/10 text-amber-300 hover:bg-amber-400/20'
          }`}
        >
          {thirdSelected ? t('group.thirdSel') : t('group.third')}
        </button>
      )}

      {liveActive ? (
        <span
          className="w-14 text-right text-[11px] tabular-nums text-slate-400"
          title={
            stat?.inPlay
              ? t('group.provTooltip', {
                  n: stat.inPlay,
                  pld: stat.pld,
                  gd: `${stat.gd > 0 ? '+' : ''}${stat.gd}`,
                })
              : t('group.playedTooltip', {
                  pld: stat?.pld ?? 0,
                  gd: stat ? `${stat.gd > 0 ? '+' : ''}${stat.gd}` : 0,
                })
          }
        >
          <span className={`font-bold ${stat?.inPlay ? 'text-rose-300' : 'text-white'}`}>
            {stat?.pts ?? 0}
          </span>
          {stat?.inPlay ? '*' : ''} {t('group.ptsUnit')}
        </span>
      ) : (
        <span className="hidden w-16 justify-end sm:flex">
          <FormPips form={team.recentForm} max={3} />
        </span>
      )}
    </li>
  );
};

export const GroupCard: React.FC<{ group: GroupId }> = ({ group }) => {
  const { thirdCount, reorderGroup, toggleThird, groupView, liveActive, resetLiveGroup, effectiveThirds } =
    useBracket();
  const { t, lang } = useT();
  const view = groupView(group);
  const order = view.order;
  const thirdTeamId = order[2];
  const thirdSelected = effectiveThirds.includes(group);
  const thirdDisabled = !thirdSelected && thirdCount >= 8;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      reorderGroup(group, String(active.id), String(over.id));
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-ink-850/70 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-display text-sm font-extrabold tracking-wide text-white">
          {t('group.label', { id: group })}
        </h3>
        {liveActive ? (
          view.manual ? (
            <button
              type="button"
              onClick={() => resetLiveGroup(group)}
              title={t('group.customResetTitle')}
              className="rounded bg-sky-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-300 hover:bg-sky-500/25"
            >
              {t('group.customReset')}
            </button>
          ) : (
            <span className="rounded bg-rose-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-300">
              {t('group.liveDrag')}
            </span>
          )
        ) : (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            {t('group.dragReorder')}
          </span>
        )}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <ul className="space-y-1">
            {order.map((teamId, idx) => {
              const team = getTeam(teamId);
              if (!team) return null;
              return (
                <SortableRow
                  key={teamId}
                  group={group}
                  team={team}
                  idx={idx}
                  stat={view.table[teamId]}
                  liveActive={liveActive}
                  isThird={idx === 2}
                  thirdSelected={thirdSelected}
                  thirdDisabled={thirdDisabled}
                  onToggleThird={() => toggleThird(group)}
                />
              );
            })}
          </ul>
        </SortableContext>
      </DndContext>

      {thirdTeamId && (
        <p className="mt-2 text-[10px] text-slate-500">
          {t('group.thirdPlaceLabel')}<span className="text-amber-300">{teamName(thirdTeamId, getTeam(thirdTeamId)?.name ?? '', lang)}</span>
          {thirdSelected ? t('group.advancing') : ''}
        </p>
      )}
    </div>
  );
};

