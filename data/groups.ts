import type { Group, GroupId } from '../types';
import { TEAMS } from './teams';

export const GROUP_IDS: GroupId[] = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
];

// Build each group's ordered team list (draw positions 1..4) from TEAMS.
export const GROUPS: Group[] = GROUP_IDS.map((id) => ({
  id,
  teamIds: TEAMS
    .filter((t) => t.group === id)
    .sort((a, b) => a.groupPos - b.groupPos)
    .map((t) => t.id),
}));

export const GROUPS_BY_ID: Record<GroupId, Group> = Object.fromEntries(
  GROUPS.map((g) => [g.id, g]),
) as Record<GroupId, Group>;
