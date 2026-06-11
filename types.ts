// ---------------------------------------------------------------------------
// Core domain types for the 2026 FIFA World Cup bracket predictor.
// ---------------------------------------------------------------------------

export type GroupId =
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  | 'G' | 'H' | 'I' | 'J' | 'K' | 'L';

export type Confederation =
  | 'UEFA' | 'CONMEBOL' | 'CONCACAF' | 'CAF' | 'AFC' | 'OFC';

export type MatchResult = 'W' | 'D' | 'L';

/** A single recent fixture used for the "recent form" summary. */
export interface FormMatch {
  /** ISO date (yyyy-mm-dd) the match was played. */
  date: string;
  /** Opponent display name. */
  opponent: string;
  /** Opponent flag emoji, if known. */
  opponentFlag?: string;
  /** Score from this team's perspective, e.g. "2-1". */
  score: string;
  result: MatchResult;
  /** Competition, e.g. "WCQ", "Friendly", "Nations League". */
  competition?: string;
  /** true if this team played at home. */
  home?: boolean;
}

export type PlayerPosition = 'GK' | 'DF' | 'MF' | 'FW';

export interface SquadPlayer {
  name: string;
  position: PlayerPosition;
  /** Club the player plays for (with country if helpful). */
  club: string;
  /** Shirt number, if known. */
  number?: number;
  /** Marks the captain. */
  captain?: boolean;
  /** mylineups.app player id for the headshot (builder-assets/players/fm-<id>.webp). */
  fmId?: string;
}

/** Kit colours used to render an SVG jersey (no copyrighted imagery). */
export interface Kit {
  /** Primary shirt colour. */
  body: string;
  /** Sleeve colour (defaults to body). Many modern kits use contrast sleeves. */
  sleeve?: string;
  /** Accent / trim / pattern colour (defaults to body). */
  accent?: string;
  /** Pattern overlay on the body. */
  pattern?:
    | 'plain'
    | 'stripes'
    | 'thinstripes'
    | 'hoops'
    | 'sash'
    | 'halves'
    | 'shoulders'
    | 'centreband';
  /** Number/text colour for contrast. */
  ink?: string;
  /** Short human label, e.g. "White / navy". */
  label: string;
}

export interface Team {
  /** Stable id, lowercase slug also used for routing. */
  id: string;
  name: string;
  /** FIFA 3-letter code. */
  code: string;
  flag: string;
  group: GroupId;
  /** Draw position 1-4 within the group (drives the schedule). */
  groupPos: 1 | 2 | 3 | 4;
  confederation: Confederation;
  /** FIFA Men's World Ranking used for the Dec 2025 final draw. */
  fifaRank: number;
  host?: boolean;
  coach?: string;
  kits?: { home: Kit; away: Kit };
  recentForm?: FormMatch[];
  squad?: SquadPlayer[];
  /** mylineups.app slug for the live starting XI. */
  mylineupsSlug: string;
  /** Optional note, e.g. "Debut", "Defending champions". */
  note?: string;
  /** Set true once squad/form have been hand-verified. */
  dataVerified?: boolean;
}

export interface Group {
  id: GroupId;
  teamIds: string[]; // ordered by draw position 1..4
}

// --- Schedule ---------------------------------------------------------------

export type Stage =
  | 'Group'
  | 'Round of 32'
  | 'Round of 16'
  | 'Quarter-final'
  | 'Semi-final'
  | 'Third place'
  | 'Final';

export interface Venue {
  id: string;
  stadium: string;
  city: string;
  country: 'USA' | 'Mexico' | 'Canada';
  /** UTC offset string used in ISO timestamps, e.g. "-04:00". */
  utcOffset: string;
}

/** Reference to whoever fills a match slot before results are known. */
export type SlotRef =
  | { kind: 'team'; teamId: string }
  | { kind: 'winner'; group: GroupId }
  | { kind: 'runnerUp'; group: GroupId }
  | { kind: 'third'; groups: GroupId[] }
  | { kind: 'matchWinner'; match: number }
  | { kind: 'matchLoser'; match: number };

export interface Match {
  /** Official FIFA match number (1-104). */
  id: number;
  stage: Stage;
  group?: GroupId;
  /** Kickoff as an offset-aware ISO instant (venue local time). */
  kickoff: string;
  venueId: string;
  home: SlotRef;
  away: SlotRef;
}

// --- Bracket prediction state ----------------------------------------------

/** The user's pick for a single group: ordered team ids (1st..4th). */
export type GroupStanding = [string, string, string, string];

export interface BracketState {
  /** group id -> ordered standings (1st,2nd,3rd,4th). */
  groups: Record<GroupId, GroupStanding>;
  /** the 8 group ids whose third-placed team advances. */
  thirdPlaceQualifiers: GroupId[];
  /** match id -> winning team id (knockout picks). */
  winners: Record<number, string>;
}
