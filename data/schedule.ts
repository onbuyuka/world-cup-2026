import type { Match, GroupId, SlotRef } from '../types';

// Slot-reference helpers ----------------------------------------------------
const tm = (teamId: string): SlotRef => ({ kind: 'team', teamId });
const w = (group: GroupId): SlotRef => ({ kind: 'winner', group });
const r = (group: GroupId): SlotRef => ({ kind: 'runnerUp', group });
const th = (...groups: GroupId[]): SlotRef => ({ kind: 'third', groups });
const mw = (match: number): SlotRef => ({ kind: 'matchWinner', match });
const ml = (match: number): SlotRef => ({ kind: 'matchLoser', match });

// All 104 matches. `kickoff` is an offset-aware ISO instant (venue local time);
// the calendar converts each to Europe/Istanbul (Turkish time, UTC+3) at render.
export const MATCHES: Match[] = [
  // ===== GROUP STAGE — Matchday 1 ==========================================
  { id: 1,  stage: 'Group', group: 'A', kickoff: '2026-06-11T13:00:00-06:00', venueId: 'azteca',    home: tm('mexico'),       away: tm('south-africa') },
  { id: 2,  stage: 'Group', group: 'A', kickoff: '2026-06-11T20:00:00-06:00', venueId: 'akron',     home: tm('south-korea'),  away: tm('czechia') },
  { id: 3,  stage: 'Group', group: 'B', kickoff: '2026-06-12T15:00:00-04:00', venueId: 'bmo',       home: tm('canada'),       away: tm('bosnia-and-herzegovina') },
  { id: 4,  stage: 'Group', group: 'D', kickoff: '2026-06-12T18:00:00-07:00', venueId: 'sofi',      home: tm('usa'),          away: tm('paraguay') },
  { id: 5,  stage: 'Group', group: 'C', kickoff: '2026-06-13T21:00:00-04:00', venueId: 'gillette',  home: tm('haiti'),        away: tm('scotland') },
  { id: 6,  stage: 'Group', group: 'D', kickoff: '2026-06-13T21:00:00-07:00', venueId: 'bcplace',   home: tm('australia'),    away: tm('turkiye') },
  { id: 7,  stage: 'Group', group: 'C', kickoff: '2026-06-13T18:00:00-04:00', venueId: 'metlife',   home: tm('brazil'),       away: tm('morocco') },
  { id: 8,  stage: 'Group', group: 'B', kickoff: '2026-06-13T12:00:00-07:00', venueId: 'levis',     home: tm('qatar'),        away: tm('switzerland') },
  { id: 9,  stage: 'Group', group: 'E', kickoff: '2026-06-14T19:00:00-04:00', venueId: 'lincoln',   home: tm('ivory-coast'),  away: tm('ecuador') },
  { id: 10, stage: 'Group', group: 'E', kickoff: '2026-06-14T12:00:00-05:00', venueId: 'nrg',       home: tm('germany'),      away: tm('curacao') },
  { id: 11, stage: 'Group', group: 'F', kickoff: '2026-06-14T15:00:00-05:00', venueId: 'att',       home: tm('netherlands'),  away: tm('japan') },
  { id: 12, stage: 'Group', group: 'F', kickoff: '2026-06-14T20:00:00-06:00', venueId: 'bbva',      home: tm('sweden'),       away: tm('tunisia') },
  { id: 13, stage: 'Group', group: 'H', kickoff: '2026-06-15T18:00:00-04:00', venueId: 'hardrock',  home: tm('saudi-arabia'), away: tm('uruguay') },
  { id: 14, stage: 'Group', group: 'H', kickoff: '2026-06-15T12:00:00-04:00', venueId: 'mercedes',  home: tm('spain'),        away: tm('cape-verde') },
  { id: 15, stage: 'Group', group: 'G', kickoff: '2026-06-15T18:00:00-07:00', venueId: 'sofi',      home: tm('iran'),         away: tm('new-zealand') },
  { id: 16, stage: 'Group', group: 'G', kickoff: '2026-06-15T12:00:00-07:00', venueId: 'lumen',     home: tm('belgium'),      away: tm('egypt') },
  { id: 17, stage: 'Group', group: 'I', kickoff: '2026-06-16T15:00:00-04:00', venueId: 'metlife',   home: tm('france'),       away: tm('senegal') },
  { id: 18, stage: 'Group', group: 'I', kickoff: '2026-06-16T18:00:00-04:00', venueId: 'gillette',  home: tm('iraq'),         away: tm('norway') },
  { id: 19, stage: 'Group', group: 'J', kickoff: '2026-06-16T20:00:00-05:00', venueId: 'arrowhead', home: tm('argentina'),    away: tm('algeria') },
  { id: 20, stage: 'Group', group: 'J', kickoff: '2026-06-16T21:00:00-07:00', venueId: 'levis',     home: tm('austria'),      away: tm('jordan') },
  { id: 21, stage: 'Group', group: 'L', kickoff: '2026-06-17T19:00:00-04:00', venueId: 'bmo',       home: tm('ghana'),        away: tm('panama') },
  { id: 22, stage: 'Group', group: 'L', kickoff: '2026-06-17T15:00:00-05:00', venueId: 'att',       home: tm('england'),      away: tm('croatia') },
  { id: 23, stage: 'Group', group: 'K', kickoff: '2026-06-17T12:00:00-05:00', venueId: 'nrg',       home: tm('portugal'),     away: tm('dr-congo') },
  { id: 24, stage: 'Group', group: 'K', kickoff: '2026-06-17T20:00:00-06:00', venueId: 'azteca',    home: tm('uzbekistan'),   away: tm('colombia') },

  // ===== GROUP STAGE — Matchday 2 ==========================================
  { id: 25, stage: 'Group', group: 'A', kickoff: '2026-06-18T12:00:00-04:00', venueId: 'mercedes',  home: tm('czechia'),      away: tm('south-africa') },
  { id: 26, stage: 'Group', group: 'B', kickoff: '2026-06-18T12:00:00-07:00', venueId: 'sofi',      home: tm('switzerland'),  away: tm('bosnia-and-herzegovina') },
  { id: 27, stage: 'Group', group: 'B', kickoff: '2026-06-18T15:00:00-07:00', venueId: 'bcplace',   home: tm('canada'),       away: tm('qatar') },
  { id: 28, stage: 'Group', group: 'A', kickoff: '2026-06-18T19:00:00-06:00', venueId: 'akron',     home: tm('mexico'),       away: tm('south-korea') },
  { id: 29, stage: 'Group', group: 'C', kickoff: '2026-06-19T20:30:00-04:00', venueId: 'lincoln',   home: tm('brazil'),       away: tm('haiti') },
  { id: 30, stage: 'Group', group: 'C', kickoff: '2026-06-19T18:00:00-04:00', venueId: 'gillette',  home: tm('scotland'),     away: tm('morocco') },
  { id: 31, stage: 'Group', group: 'D', kickoff: '2026-06-19T20:00:00-07:00', venueId: 'levis',     home: tm('turkiye'),      away: tm('paraguay') },
  { id: 32, stage: 'Group', group: 'D', kickoff: '2026-06-19T12:00:00-07:00', venueId: 'lumen',     home: tm('usa'),          away: tm('australia') },
  { id: 33, stage: 'Group', group: 'E', kickoff: '2026-06-20T16:00:00-04:00', venueId: 'bmo',       home: tm('germany'),      away: tm('ivory-coast') },
  { id: 34, stage: 'Group', group: 'E', kickoff: '2026-06-20T19:00:00-05:00', venueId: 'arrowhead', home: tm('ecuador'),      away: tm('curacao') },
  { id: 35, stage: 'Group', group: 'F', kickoff: '2026-06-20T12:00:00-05:00', venueId: 'nrg',       home: tm('netherlands'),  away: tm('sweden') },
  { id: 36, stage: 'Group', group: 'F', kickoff: '2026-06-20T22:00:00-06:00', venueId: 'bbva',      home: tm('tunisia'),      away: tm('japan') },
  { id: 37, stage: 'Group', group: 'H', kickoff: '2026-06-21T18:00:00-04:00', venueId: 'hardrock',  home: tm('uruguay'),      away: tm('cape-verde') },
  { id: 38, stage: 'Group', group: 'H', kickoff: '2026-06-21T12:00:00-04:00', venueId: 'mercedes',  home: tm('spain'),        away: tm('saudi-arabia') },
  { id: 39, stage: 'Group', group: 'G', kickoff: '2026-06-21T12:00:00-07:00', venueId: 'sofi',      home: tm('belgium'),      away: tm('iran') },
  { id: 40, stage: 'Group', group: 'G', kickoff: '2026-06-21T18:00:00-07:00', venueId: 'bcplace',   home: tm('new-zealand'),  away: tm('egypt') },
  { id: 41, stage: 'Group', group: 'I', kickoff: '2026-06-22T20:00:00-04:00', venueId: 'metlife',   home: tm('norway'),       away: tm('senegal') },
  { id: 42, stage: 'Group', group: 'I', kickoff: '2026-06-22T17:00:00-04:00', venueId: 'lincoln',   home: tm('france'),       away: tm('iraq') },
  { id: 43, stage: 'Group', group: 'J', kickoff: '2026-06-22T12:00:00-05:00', venueId: 'att',       home: tm('argentina'),    away: tm('austria') },
  { id: 44, stage: 'Group', group: 'J', kickoff: '2026-06-22T20:00:00-07:00', venueId: 'levis',     home: tm('jordan'),       away: tm('algeria') },
  { id: 45, stage: 'Group', group: 'L', kickoff: '2026-06-23T16:00:00-04:00', venueId: 'gillette',  home: tm('england'),      away: tm('ghana') },
  { id: 46, stage: 'Group', group: 'L', kickoff: '2026-06-23T19:00:00-04:00', venueId: 'bmo',       home: tm('panama'),       away: tm('croatia') },
  { id: 47, stage: 'Group', group: 'K', kickoff: '2026-06-23T12:00:00-05:00', venueId: 'nrg',       home: tm('portugal'),     away: tm('uzbekistan') },
  { id: 48, stage: 'Group', group: 'K', kickoff: '2026-06-23T20:00:00-06:00', venueId: 'akron',     home: tm('colombia'),     away: tm('dr-congo') },

  // ===== GROUP STAGE — Matchday 3 (simultaneous kickoffs per group) ========
  { id: 49, stage: 'Group', group: 'C', kickoff: '2026-06-24T18:00:00-04:00', venueId: 'hardrock',  home: tm('scotland'),     away: tm('brazil') },
  { id: 50, stage: 'Group', group: 'C', kickoff: '2026-06-24T18:00:00-04:00', venueId: 'mercedes',  home: tm('morocco'),      away: tm('haiti') },
  { id: 51, stage: 'Group', group: 'B', kickoff: '2026-06-24T12:00:00-07:00', venueId: 'bcplace',   home: tm('switzerland'),  away: tm('canada') },
  { id: 52, stage: 'Group', group: 'B', kickoff: '2026-06-24T12:00:00-07:00', venueId: 'lumen',     home: tm('bosnia-and-herzegovina'), away: tm('qatar') },
  { id: 53, stage: 'Group', group: 'A', kickoff: '2026-06-24T19:00:00-06:00', venueId: 'azteca',    home: tm('czechia'),      away: tm('mexico') },
  { id: 54, stage: 'Group', group: 'A', kickoff: '2026-06-24T19:00:00-06:00', venueId: 'bbva',      home: tm('south-africa'), away: tm('south-korea') },
  { id: 55, stage: 'Group', group: 'E', kickoff: '2026-06-25T16:00:00-04:00', venueId: 'lincoln',   home: tm('curacao'),      away: tm('ivory-coast') },
  { id: 56, stage: 'Group', group: 'E', kickoff: '2026-06-25T16:00:00-04:00', venueId: 'metlife',   home: tm('ecuador'),      away: tm('germany') },
  { id: 57, stage: 'Group', group: 'F', kickoff: '2026-06-25T18:00:00-05:00', venueId: 'att',       home: tm('japan'),        away: tm('sweden') },
  { id: 58, stage: 'Group', group: 'F', kickoff: '2026-06-25T18:00:00-05:00', venueId: 'arrowhead', home: tm('tunisia'),      away: tm('netherlands') },
  { id: 59, stage: 'Group', group: 'D', kickoff: '2026-06-25T19:00:00-07:00', venueId: 'sofi',      home: tm('turkiye'),      away: tm('usa') },
  { id: 60, stage: 'Group', group: 'D', kickoff: '2026-06-25T19:00:00-07:00', venueId: 'levis',     home: tm('paraguay'),     away: tm('australia') },
  { id: 61, stage: 'Group', group: 'I', kickoff: '2026-06-26T15:00:00-04:00', venueId: 'gillette',  home: tm('norway'),       away: tm('france') },
  { id: 62, stage: 'Group', group: 'I', kickoff: '2026-06-26T15:00:00-04:00', venueId: 'bmo',       home: tm('senegal'),      away: tm('iraq') },
  { id: 63, stage: 'Group', group: 'G', kickoff: '2026-06-26T20:00:00-07:00', venueId: 'lumen',     home: tm('egypt'),        away: tm('iran') },
  { id: 64, stage: 'Group', group: 'G', kickoff: '2026-06-26T20:00:00-07:00', venueId: 'bcplace',   home: tm('new-zealand'),  away: tm('belgium') },
  { id: 65, stage: 'Group', group: 'H', kickoff: '2026-06-26T19:00:00-05:00', venueId: 'nrg',       home: tm('cape-verde'),   away: tm('saudi-arabia') },
  { id: 66, stage: 'Group', group: 'H', kickoff: '2026-06-26T18:00:00-06:00', venueId: 'akron',     home: tm('uruguay'),      away: tm('spain') },
  { id: 67, stage: 'Group', group: 'L', kickoff: '2026-06-27T17:00:00-04:00', venueId: 'metlife',   home: tm('panama'),       away: tm('england') },
  { id: 68, stage: 'Group', group: 'L', kickoff: '2026-06-27T17:00:00-04:00', venueId: 'lincoln',   home: tm('croatia'),      away: tm('ghana') },
  { id: 69, stage: 'Group', group: 'J', kickoff: '2026-06-27T21:00:00-05:00', venueId: 'arrowhead', home: tm('algeria'),      away: tm('austria') },
  { id: 70, stage: 'Group', group: 'J', kickoff: '2026-06-27T21:00:00-05:00', venueId: 'att',       home: tm('jordan'),       away: tm('argentina') },
  { id: 71, stage: 'Group', group: 'K', kickoff: '2026-06-27T19:30:00-04:00', venueId: 'hardrock',  home: tm('colombia'),     away: tm('portugal') },
  { id: 72, stage: 'Group', group: 'K', kickoff: '2026-06-27T19:30:00-04:00', venueId: 'mercedes',  home: tm('dr-congo'),     away: tm('uzbekistan') },

  // ===== ROUND OF 32 =======================================================
  { id: 73, stage: 'Round of 32', kickoff: '2026-06-28T12:00:00-07:00', venueId: 'sofi',      home: r('A'),               away: r('B') },
  { id: 74, stage: 'Round of 32', kickoff: '2026-06-29T16:30:00-04:00', venueId: 'gillette',  home: w('E'),               away: th('A', 'B', 'C', 'D', 'F') },
  { id: 75, stage: 'Round of 32', kickoff: '2026-06-29T19:00:00-06:00', venueId: 'bbva',      home: w('F'),               away: r('C') },
  { id: 76, stage: 'Round of 32', kickoff: '2026-06-29T12:00:00-05:00', venueId: 'nrg',       home: w('C'),               away: r('F') },
  { id: 77, stage: 'Round of 32', kickoff: '2026-06-30T17:00:00-04:00', venueId: 'metlife',   home: w('I'),               away: th('C', 'D', 'F', 'G', 'H') },
  { id: 78, stage: 'Round of 32', kickoff: '2026-06-30T12:00:00-05:00', venueId: 'att',       home: r('E'),               away: r('I') },
  { id: 79, stage: 'Round of 32', kickoff: '2026-06-30T19:00:00-06:00', venueId: 'azteca',    home: w('A'),               away: th('C', 'E', 'F', 'H', 'I') },
  { id: 80, stage: 'Round of 32', kickoff: '2026-07-01T12:00:00-04:00', venueId: 'mercedes',  home: w('L'),               away: th('E', 'H', 'I', 'J', 'K') },
  { id: 81, stage: 'Round of 32', kickoff: '2026-07-01T17:00:00-07:00', venueId: 'levis',     home: w('D'),               away: th('B', 'E', 'F', 'I', 'J') },
  { id: 82, stage: 'Round of 32', kickoff: '2026-07-01T13:00:00-07:00', venueId: 'lumen',     home: w('G'),               away: th('A', 'E', 'H', 'I', 'J') },
  { id: 83, stage: 'Round of 32', kickoff: '2026-07-02T19:00:00-04:00', venueId: 'bmo',       home: r('K'),               away: r('L') },
  { id: 84, stage: 'Round of 32', kickoff: '2026-07-02T12:00:00-07:00', venueId: 'sofi',      home: w('H'),               away: r('J') },
  { id: 85, stage: 'Round of 32', kickoff: '2026-07-02T20:00:00-07:00', venueId: 'bcplace',   home: w('B'),               away: th('E', 'F', 'G', 'I', 'J') },
  { id: 86, stage: 'Round of 32', kickoff: '2026-07-03T18:00:00-04:00', venueId: 'hardrock',  home: w('J'),               away: r('H') },
  { id: 87, stage: 'Round of 32', kickoff: '2026-07-03T20:30:00-05:00', venueId: 'arrowhead', home: w('K'),               away: th('D', 'E', 'I', 'J', 'L') },
  { id: 88, stage: 'Round of 32', kickoff: '2026-07-03T13:00:00-05:00', venueId: 'att',       home: r('D'),               away: r('G') },

  // ===== ROUND OF 16 =======================================================
  { id: 89, stage: 'Round of 16', kickoff: '2026-07-04T17:00:00-04:00', venueId: 'lincoln',   home: mw(74), away: mw(77) },
  { id: 90, stage: 'Round of 16', kickoff: '2026-07-04T12:00:00-05:00', venueId: 'nrg',       home: mw(73), away: mw(75) },
  { id: 91, stage: 'Round of 16', kickoff: '2026-07-05T16:00:00-04:00', venueId: 'metlife',   home: mw(76), away: mw(78) },
  { id: 92, stage: 'Round of 16', kickoff: '2026-07-05T18:00:00-06:00', venueId: 'azteca',    home: mw(79), away: mw(80) },
  { id: 93, stage: 'Round of 16', kickoff: '2026-07-06T14:00:00-05:00', venueId: 'att',       home: mw(83), away: mw(84) },
  { id: 94, stage: 'Round of 16', kickoff: '2026-07-06T17:00:00-07:00', venueId: 'lumen',     home: mw(81), away: mw(82) },
  { id: 95, stage: 'Round of 16', kickoff: '2026-07-07T12:00:00-04:00', venueId: 'mercedes',  home: mw(86), away: mw(88) },
  { id: 96, stage: 'Round of 16', kickoff: '2026-07-07T13:00:00-07:00', venueId: 'bcplace',   home: mw(85), away: mw(87) },

  // ===== QUARTER-FINALS ====================================================
  { id: 97,  stage: 'Quarter-final', kickoff: '2026-07-09T16:00:00-04:00', venueId: 'gillette',  home: mw(89), away: mw(90) },
  { id: 98,  stage: 'Quarter-final', kickoff: '2026-07-10T12:00:00-07:00', venueId: 'sofi',      home: mw(93), away: mw(94) },
  { id: 99,  stage: 'Quarter-final', kickoff: '2026-07-11T17:00:00-04:00', venueId: 'hardrock',  home: mw(91), away: mw(92) },
  { id: 100, stage: 'Quarter-final', kickoff: '2026-07-11T20:00:00-05:00', venueId: 'arrowhead', home: mw(95), away: mw(96) },

  // ===== SEMI-FINALS =======================================================
  { id: 101, stage: 'Semi-final', kickoff: '2026-07-14T14:00:00-05:00', venueId: 'att',      home: mw(97), away: mw(98) },
  { id: 102, stage: 'Semi-final', kickoff: '2026-07-15T15:00:00-04:00', venueId: 'mercedes', home: mw(99), away: mw(100) },

  // ===== THIRD-PLACE & FINAL ===============================================
  { id: 103, stage: 'Third place', kickoff: '2026-07-18T17:00:00-04:00', venueId: 'hardrock', home: ml(101), away: ml(102) },
  { id: 104, stage: 'Final',       kickoff: '2026-07-19T15:00:00-04:00', venueId: 'metlife',  home: mw(101), away: mw(102) },
];

export const MATCHES_BY_ID: Record<number, Match> = Object.fromEntries(
  MATCHES.map((m) => [m.id, m]),
);
