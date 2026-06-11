import type { FormMatch } from '../types';

// ---------------------------------------------------------------------------
// Recent form (last ~5 played internationals per team), extracted from each
// national team's English Wikipedia "Results and fixtures" section.
// Scores are from the team's perspective; result is W/D/L accordingly.
//
// Populated group by group. Teams present here override the (empty) default;
// Argentina keeps its inline recentForm in data/teams.ts.
// ---------------------------------------------------------------------------

export const RECENT_FORM: Record<string, FormMatch[]> = {
  // ===== GROUP A =====
  mexico: [
    { date: '2026-03-28', opponent: 'Portugal', score: '0-0', result: 'D', competition: 'Friendly', home: true },
    { date: '2026-03-31', opponent: 'Belgium', score: '1-1', result: 'D', competition: 'Friendly', home: true },
    { date: '2026-05-22', opponent: 'Ghana', score: '2-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-05-30', opponent: 'Australia', score: '1-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-06-04', opponent: 'Serbia', score: '5-1', result: 'W', competition: 'Friendly', home: true },
  ],
  'south-africa': [
    { date: '2026-01-04', opponent: 'Cameroon', score: '1-2', result: 'L', competition: 'AFCON', home: true },
    { date: '2026-03-27', opponent: 'Panama', score: '1-1', result: 'D', competition: 'Friendly', home: true },
    { date: '2026-03-31', opponent: 'Panama', score: '1-2', result: 'L', competition: 'Friendly', home: true },
    { date: '2026-05-29', opponent: 'Nicaragua', score: '0-0', result: 'D', competition: 'Friendly', home: true },
    { date: '2026-06-06', opponent: 'Jamaica', score: '1-1', result: 'D', competition: 'Friendly', home: false },
  ],
  'south-korea': [
    { date: '2025-11-18', opponent: 'Ghana', score: '1-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-03-28', opponent: 'Ivory Coast', score: '0-4', result: 'L', competition: 'Friendly', home: true },
    { date: '2026-03-31', opponent: 'Austria', score: '0-1', result: 'L', competition: 'Friendly', home: false },
    { date: '2026-05-30', opponent: 'Trinidad and Tobago', score: '5-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-06-03', opponent: 'El Salvador', score: '1-0', result: 'W', competition: 'Friendly', home: true },
  ],
  czechia: [
    { date: '2025-10-12', opponent: 'Faroe Islands', score: '1-2', result: 'L', competition: 'WCQ', home: false },
    { date: '2025-11-13', opponent: 'San Marino', score: '1-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2025-11-17', opponent: 'Gibraltar', score: '6-0', result: 'W', competition: 'WCQ', home: true },
    { date: '2026-05-31', opponent: 'Kosovo', score: '2-1', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-06-04', opponent: 'Guatemala', score: '3-1', result: 'W', competition: 'Friendly', home: true },
  ],

  // ===== GROUP B =====
  canada: [
    { date: '2025-11-18', opponent: 'Venezuela', score: '2-0', result: 'W', competition: 'Friendly', home: false },
    { date: '2026-03-28', opponent: 'Iceland', score: '2-2', result: 'D', competition: 'Friendly', home: true },
    { date: '2026-03-31', opponent: 'Tunisia', score: '0-0', result: 'D', competition: 'Friendly', home: true },
    { date: '2026-06-01', opponent: 'Uzbekistan', score: '2-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-06-05', opponent: 'Republic of Ireland', score: '1-1', result: 'D', competition: 'Friendly', home: true },
  ],
  'bosnia-and-herzegovina': [
    { date: '2025-10-12', opponent: 'Malta', score: '4-1', result: 'W', competition: 'Friendly', home: false },
    { date: '2025-11-15', opponent: 'Romania', score: '3-1', result: 'W', competition: 'WCQ', home: true },
    { date: '2025-11-18', opponent: 'Austria', score: '1-1', result: 'D', competition: 'WCQ', home: false },
    { date: '2026-05-29', opponent: 'North Macedonia', score: '0-0', result: 'D', competition: 'Friendly', home: true },
    { date: '2026-06-06', opponent: 'Panama', score: '1-1', result: 'D', competition: 'Friendly', home: true },
  ],
  qatar: [
    { date: '2025-12-01', opponent: 'Palestine', score: '0-1', result: 'L', competition: 'Friendly', home: true },
    { date: '2025-12-04', opponent: 'Syria', score: '1-1', result: 'D', competition: 'Friendly', home: false },
    { date: '2025-12-07', opponent: 'Tunisia', score: '0-3', result: 'L', competition: 'Friendly', home: true },
    { date: '2026-05-28', opponent: 'Republic of Ireland', score: '0-1', result: 'L', competition: 'Friendly', home: false },
    { date: '2026-06-06', opponent: 'El Salvador', score: '0-0', result: 'D', competition: 'Friendly', home: false },
  ],
  switzerland: [
    { date: '2025-11-18', opponent: 'Kosovo', score: '1-1', result: 'D', competition: 'WCQ', home: false },
    { date: '2026-03-27', opponent: 'Germany', score: '3-4', result: 'L', competition: 'Friendly', home: true },
    { date: '2026-03-31', opponent: 'Norway', score: '0-0', result: 'D', competition: 'Friendly', home: false },
    { date: '2026-05-31', opponent: 'Jordan', score: '4-1', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-06-06', opponent: 'Australia', score: '1-1', result: 'D', competition: 'Friendly', home: false },
  ],

  // ===== GROUP C =====
  brazil: [
    { date: '2025-11-18', opponent: 'Tunisia', score: '1-1', result: 'D', competition: 'Friendly', home: true },
    { date: '2026-03-26', opponent: 'France', score: '1-2', result: 'L', competition: 'Friendly', home: true },
    { date: '2026-03-31', opponent: 'Croatia', score: '3-1', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-05-31', opponent: 'Panama', score: '6-2', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-06-06', opponent: 'Egypt', score: '2-1', result: 'W', competition: 'Friendly', home: true },
  ],
  morocco: [
    { date: '2026-03-27', opponent: 'Ecuador', score: '1-1', result: 'D', competition: 'Friendly', home: true },
    { date: '2026-03-31', opponent: 'Paraguay', score: '2-1', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-05-26', opponent: 'Burundi', score: '5-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-06-02', opponent: 'Madagascar', score: '4-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-06-07', opponent: 'Norway', score: '1-1', result: 'D', competition: 'Friendly', home: true },
  ],
  haiti: [
    { date: '2025-11-18', opponent: 'Nicaragua', score: '2-0', result: 'W', competition: 'WCQ', home: true },
    { date: '2026-03-28', opponent: 'Tunisia', score: '0-1', result: 'L', competition: 'Friendly', home: true },
    { date: '2026-03-31', opponent: 'Iceland', score: '1-1', result: 'D', competition: 'Friendly', home: true },
    { date: '2026-06-02', opponent: 'New Zealand', score: '4-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-06-05', opponent: 'Peru', score: '1-2', result: 'L', competition: 'Friendly', home: true },
  ],
  scotland: [
    { date: '2025-11-18', opponent: 'Denmark', score: '4-2', result: 'W', competition: 'WCQ', home: true },
    { date: '2026-03-28', opponent: 'Japan', score: '0-1', result: 'L', competition: 'Friendly', home: true },
    { date: '2026-03-31', opponent: 'Ivory Coast', score: '0-1', result: 'L', competition: 'Friendly', home: false },
    { date: '2026-05-30', opponent: 'Curaçao', score: '4-1', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-06-06', opponent: 'Bolivia', score: '4-0', result: 'W', competition: 'Friendly', home: false },
  ],

  // ===== GROUP D (argentina form is inline in teams.ts) =====
  usa: [
    { date: '2025-11-18', opponent: 'Uruguay', score: '5-1', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-03-28', opponent: 'Belgium', score: '2-5', result: 'L', competition: 'Friendly', home: true },
    { date: '2026-03-31', opponent: 'Portugal', score: '0-2', result: 'L', competition: 'Friendly', home: true },
    { date: '2026-05-31', opponent: 'Senegal', score: '3-2', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-06-06', opponent: 'Germany', score: '1-2', result: 'L', competition: 'Friendly', home: true },
  ],
  paraguay: [
    { date: '2025-11-15', opponent: 'United States', score: '1-2', result: 'L', competition: 'Friendly', home: false },
    { date: '2025-11-18', opponent: 'Mexico', score: '2-1', result: 'W', competition: 'Friendly', home: false },
    { date: '2026-03-27', opponent: 'Greece', score: '1-0', result: 'W', competition: 'Friendly', home: false },
    { date: '2026-03-31', opponent: 'Morocco', score: '1-2', result: 'L', competition: 'Friendly', home: false },
    { date: '2026-06-05', opponent: 'Nicaragua', score: '4-0', result: 'W', competition: 'Friendly', home: true },
  ],
  australia: [
    { date: '2025-11-18', opponent: 'Colombia', score: '0-3', result: 'L', competition: 'Friendly', home: false },
    { date: '2026-03-27', opponent: 'Cameroon', score: '1-0', result: 'W', competition: 'FIFA Series', home: true },
    { date: '2026-03-31', opponent: 'Curaçao', score: '5-1', result: 'W', competition: 'FIFA Series', home: true },
    { date: '2026-05-30', opponent: 'Mexico', score: '0-1', result: 'L', competition: 'Friendly', home: false },
    { date: '2026-06-06', opponent: 'Switzerland', score: '1-1', result: 'D', competition: 'Friendly', home: true },
  ],
  turkiye: [
    { date: '2025-11-18', opponent: 'Spain', score: '2-2', result: 'D', competition: 'WCQ', home: false },
    { date: '2026-03-26', opponent: 'Romania', score: '1-0', result: 'W', competition: 'WCQ', home: true },
    { date: '2026-03-31', opponent: 'Kosovo', score: '1-0', result: 'W', competition: 'WCQ', home: false },
    { date: '2026-06-01', opponent: 'North Macedonia', score: '4-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-06-06', opponent: 'Venezuela', score: '2-1', result: 'W', competition: 'Friendly', home: false },
  ],

  // ===== GROUP E =====
  germany: [
    { date: '2025-11-17', opponent: 'Slovakia', score: '6-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-03-27', opponent: 'Switzerland', score: '4-3', result: 'W', competition: 'Friendly', home: false },
    { date: '2026-03-30', opponent: 'Ghana', score: '2-1', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-05-31', opponent: 'Finland', score: '4-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-06-06', opponent: 'United States', score: '2-1', result: 'W', competition: 'Friendly', home: false },
  ],
  curacao: [
    { date: '2025-11-18', opponent: 'Jamaica', score: '0-0', result: 'D', competition: 'WCQ', home: false },
    { date: '2026-03-27', opponent: 'China', score: '0-2', result: 'L', competition: 'FIFA Series', home: false },
    { date: '2026-03-31', opponent: 'Australia', score: '1-5', result: 'L', competition: 'FIFA Series', home: false },
    { date: '2026-05-30', opponent: 'Scotland', score: '1-4', result: 'L', competition: 'Friendly', home: false },
    { date: '2026-06-06', opponent: 'Aruba', score: '4-0', result: 'W', competition: 'Friendly', home: true },
  ],
  'ivory-coast': [
    { date: '2026-01-06', opponent: 'Burkina Faso', score: '3-0', result: 'W', competition: 'AFCON', home: true },
    { date: '2026-01-10', opponent: 'Egypt', score: '2-3', result: 'L', competition: 'AFCON', home: false },
    { date: '2026-03-28', opponent: 'South Korea', score: '4-0', result: 'W', competition: 'Friendly', home: false },
    { date: '2026-03-31', opponent: 'Scotland', score: '1-0', result: 'W', competition: 'Friendly', home: false },
    { date: '2026-06-04', opponent: 'France', score: '2-1', result: 'W', competition: 'Friendly', home: false },
  ],
  ecuador: [
    { date: '2025-11-18', opponent: 'New Zealand', score: '2-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-03-27', opponent: 'Morocco', score: '1-1', result: 'D', competition: 'Friendly', home: false },
    { date: '2026-03-31', opponent: 'Netherlands', score: '1-1', result: 'D', competition: 'Friendly', home: false },
    { date: '2026-05-30', opponent: 'Saudi Arabia', score: '2-1', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-06-07', opponent: 'Guatemala', score: '3-0', result: 'W', competition: 'Friendly', home: true },
  ],

  // ===== GROUP F =====
  netherlands: [
    { date: '2025-11-17', opponent: 'Lithuania', score: '4-0', result: 'W', competition: 'WCQ', home: true },
    { date: '2026-03-27', opponent: 'Norway', score: '2-1', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-03-31', opponent: 'Ecuador', score: '1-1', result: 'D', competition: 'Friendly', home: true },
    { date: '2026-06-03', opponent: 'Algeria', score: '0-1', result: 'L', competition: 'Friendly', home: true },
    { date: '2026-06-08', opponent: 'Uzbekistan', score: '2-1', result: 'W', competition: 'Friendly', home: true },
  ],
  japan: [
    { date: '2025-11-14', opponent: 'Ghana', score: '2-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2025-11-18', opponent: 'Bolivia', score: '3-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-03-28', opponent: 'Scotland', score: '1-0', result: 'W', competition: 'Friendly', home: false },
    { date: '2026-03-31', opponent: 'England', score: '1-0', result: 'W', competition: 'Friendly', home: false },
    { date: '2026-05-31', opponent: 'Iceland', score: '1-0', result: 'W', competition: 'Friendly', home: true },
  ],
  sweden: [
    { date: '2025-11-18', opponent: 'Slovenia', score: '1-1', result: 'D', competition: 'WCQ', home: true },
    { date: '2026-03-26', opponent: 'Ukraine', score: '3-1', result: 'W', competition: 'WCQ', home: false },
    { date: '2026-03-31', opponent: 'Poland', score: '3-2', result: 'W', competition: 'WCQ', home: true },
    { date: '2026-06-01', opponent: 'Norway', score: '1-3', result: 'L', competition: 'Friendly', home: false },
    { date: '2026-06-04', opponent: 'Greece', score: '2-2', result: 'D', competition: 'Friendly', home: true },
  ],
  tunisia: [
    { date: '2025-12-30', opponent: 'Tanzania', score: '1-1', result: 'D', competition: 'AFCON', home: false },
    { date: '2026-03-28', opponent: 'Haiti', score: '1-0', result: 'W', competition: 'Friendly', home: false },
    { date: '2026-03-31', opponent: 'Canada', score: '0-0', result: 'D', competition: 'Friendly', home: false },
    { date: '2026-06-01', opponent: 'Austria', score: '0-1', result: 'L', competition: 'Friendly', home: false },
    { date: '2026-06-06', opponent: 'Belgium', score: '0-5', result: 'L', competition: 'Friendly', home: false },
  ],

  // ===== GROUP G =====
  belgium: [
    { date: '2025-11-18', opponent: 'Liechtenstein', score: '7-0', result: 'W', competition: 'WCQ', home: true },
    { date: '2026-03-28', opponent: 'United States', score: '5-2', result: 'W', competition: 'Friendly', home: false },
    { date: '2026-03-31', opponent: 'Mexico', score: '1-1', result: 'D', competition: 'Friendly', home: false },
    { date: '2026-06-02', opponent: 'Croatia', score: '2-0', result: 'W', competition: 'Friendly', home: false },
    { date: '2026-06-06', opponent: 'Tunisia', score: '5-0', result: 'W', competition: 'Friendly', home: true },
  ],
  egypt: [
    { date: '2026-01-14', opponent: 'Senegal', score: '0-1', result: 'L', competition: 'AFCON', home: false },
    { date: '2026-03-27', opponent: 'Saudi Arabia', score: '4-0', result: 'W', competition: 'Friendly', home: false },
    { date: '2026-03-31', opponent: 'Spain', score: '0-0', result: 'D', competition: 'Friendly', home: false },
    { date: '2026-05-28', opponent: 'Russia', score: '1-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-06-06', opponent: 'Brazil', score: '1-2', result: 'L', competition: 'Friendly', home: false },
  ],
  iran: [
    { date: '2025-10-14', opponent: 'Tanzania', score: '2-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-03-27', opponent: 'Nigeria', score: '1-2', result: 'L', competition: 'Friendly', home: true },
    { date: '2026-03-31', opponent: 'Costa Rica', score: '5-0', result: 'W', competition: 'Friendly', home: false },
    { date: '2026-05-29', opponent: 'Gambia', score: '3-1', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-06-04', opponent: 'Mali', score: '2-0', result: 'W', competition: 'Friendly', home: true },
  ],
  'new-zealand': [
    { date: '2025-11-18', opponent: 'Ecuador', score: '0-2', result: 'L', competition: 'Friendly', home: false },
    { date: '2026-03-27', opponent: 'Finland', score: '0-2', result: 'L', competition: 'FIFA Series', home: true },
    { date: '2026-03-30', opponent: 'Chile', score: '4-1', result: 'W', competition: 'FIFA Series', home: true },
    { date: '2026-06-02', opponent: 'Haiti', score: '0-4', result: 'L', competition: 'Friendly', home: false },
    { date: '2026-06-07', opponent: 'England', score: '0-1', result: 'L', competition: 'Friendly', home: false },
  ],

  // ===== GROUP H =====
  spain: [
    { date: '2025-11-18', opponent: 'Turkey', score: '2-2', result: 'D', competition: 'WCQ', home: true },
    { date: '2026-03-27', opponent: 'Serbia', score: '3-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-03-31', opponent: 'Egypt', score: '0-0', result: 'D', competition: 'Friendly', home: true },
    { date: '2026-06-04', opponent: 'Iraq', score: '1-1', result: 'D', competition: 'Friendly', home: true },
    { date: '2026-06-08', opponent: 'Peru', score: '3-1', result: 'W', competition: 'Friendly', home: false },
  ],
  'cape-verde': [
    { date: '2025-10-08', opponent: 'Libya', score: '3-3', result: 'D', competition: 'Friendly', home: false },
    { date: '2025-10-13', opponent: 'Eswatini', score: '3-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-03-27', opponent: 'Chile', score: '2-4', result: 'L', competition: 'FIFA Series', home: false },
    { date: '2026-05-31', opponent: 'Serbia', score: '3-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-06-06', opponent: 'Bermuda', score: '3-0', result: 'W', competition: 'Friendly', home: true },
  ],
  'saudi-arabia': [
    { date: '2026-03-27', opponent: 'Egypt', score: '0-4', result: 'L', competition: 'Friendly', home: true },
    { date: '2026-03-31', opponent: 'Serbia', score: '1-2', result: 'L', competition: 'Friendly', home: false },
    { date: '2026-05-30', opponent: 'Ecuador', score: '1-2', result: 'L', competition: 'Friendly', home: false },
    { date: '2026-06-05', opponent: 'Puerto Rico', score: '3-0', result: 'W', competition: 'Friendly', home: false },
    { date: '2026-06-09', opponent: 'Senegal', score: '0-0', result: 'D', competition: 'Friendly', home: true },
  ],
  uruguay: [
    { date: '2025-10-13', opponent: 'Uzbekistan', score: '2-1', result: 'W', competition: 'Friendly', home: false },
    { date: '2025-11-15', opponent: 'Mexico', score: '0-0', result: 'D', competition: 'Friendly', home: false },
    { date: '2025-11-18', opponent: 'United States', score: '1-5', result: 'L', competition: 'Friendly', home: false },
    { date: '2026-03-27', opponent: 'England', score: '1-1', result: 'D', competition: 'Friendly', home: false },
    { date: '2026-03-31', opponent: 'Algeria', score: '0-0', result: 'D', competition: 'Friendly', home: false },
  ],

  // ===== GROUP I =====
  france: [
    { date: '2025-11-16', opponent: 'Azerbaijan', score: '3-1', result: 'W', competition: 'WCQ', home: false },
    { date: '2026-03-26', opponent: 'Brazil', score: '2-1', result: 'W', competition: 'Friendly', home: false },
    { date: '2026-03-29', opponent: 'Colombia', score: '3-1', result: 'W', competition: 'Friendly', home: false },
    { date: '2026-06-04', opponent: 'Ivory Coast', score: '1-2', result: 'L', competition: 'Friendly', home: true },
    { date: '2026-06-08', opponent: 'Northern Ireland', score: '3-1', result: 'W', competition: 'Friendly', home: true },
  ],
  senegal: [
    { date: '2026-01-14', opponent: 'Egypt', score: '1-0', result: 'W', competition: 'AFCON', home: true },
    { date: '2026-03-28', opponent: 'Peru', score: '2-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-03-31', opponent: 'Gambia', score: '3-1', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-05-31', opponent: 'United States', score: '2-3', result: 'L', competition: 'Friendly', home: false },
    { date: '2026-06-09', opponent: 'Saudi Arabia', score: '0-0', result: 'D', competition: 'Friendly', home: false },
  ],
  iraq: [
    { date: '2025-12-12', opponent: 'Jordan', score: '0-1', result: 'L', competition: 'Friendly', home: false },
    { date: '2026-03-31', opponent: 'Bolivia', score: '2-1', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-05-29', opponent: 'Andorra', score: '1-0', result: 'W', competition: 'Friendly', home: false },
    { date: '2026-06-04', opponent: 'Spain', score: '1-1', result: 'D', competition: 'Friendly', home: false },
    { date: '2026-06-09', opponent: 'Venezuela', score: '0-2', result: 'L', competition: 'Friendly', home: false },
  ],
  norway: [
    { date: '2025-11-16', opponent: 'Italy', score: '4-1', result: 'W', competition: 'WCQ', home: false },
    { date: '2026-03-27', opponent: 'Netherlands', score: '1-2', result: 'L', competition: 'Friendly', home: false },
    { date: '2026-03-31', opponent: 'Switzerland', score: '0-0', result: 'D', competition: 'Friendly', home: true },
    { date: '2026-06-01', opponent: 'Sweden', score: '3-1', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-06-07', opponent: 'Morocco', score: '1-1', result: 'D', competition: 'Friendly', home: false },
  ],

  // ===== GROUP J (argentina form is inline in teams.ts) =====
  algeria: [
    { date: '2026-01-10', opponent: 'Nigeria', score: '0-2', result: 'L', competition: 'AFCON', home: true },
    { date: '2026-03-27', opponent: 'Guatemala', score: '7-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-03-31', opponent: 'Uruguay', score: '0-0', result: 'D', competition: 'Friendly', home: true },
    { date: '2026-06-03', opponent: 'Netherlands', score: '1-0', result: 'W', competition: 'Friendly', home: false },
    { date: '2026-06-10', opponent: 'Bolivia', score: '4-0', result: 'W', competition: 'Friendly', home: true },
  ],
  austria: [
    { date: '2025-11-15', opponent: 'Cyprus', score: '2-0', result: 'W', competition: 'WCQ', home: false },
    { date: '2025-11-18', opponent: 'Bosnia and Herzegovina', score: '1-1', result: 'D', competition: 'WCQ', home: true },
    { date: '2026-03-27', opponent: 'Ghana', score: '5-1', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-03-31', opponent: 'South Korea', score: '1-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-06-01', opponent: 'Tunisia', score: '1-0', result: 'W', competition: 'Friendly', home: true },
  ],
  jordan: [
    { date: '2025-12-15', opponent: 'Saudi Arabia', score: '1-0', result: 'W', competition: 'Friendly', home: false },
    { date: '2026-03-27', opponent: 'Costa Rica', score: '2-2', result: 'D', competition: 'Friendly', home: true },
    { date: '2026-03-31', opponent: 'Nigeria', score: '2-2', result: 'D', competition: 'Friendly', home: true },
    { date: '2026-05-31', opponent: 'Switzerland', score: '1-4', result: 'L', competition: 'Friendly', home: false },
    { date: '2026-06-07', opponent: 'Colombia', score: '0-2', result: 'L', competition: 'Friendly', home: false },
  ],

  // ===== GROUP K =====
  portugal: [
    { date: '2025-11-16', opponent: 'Armenia', score: '9-1', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-03-28', opponent: 'Mexico', score: '0-0', result: 'D', competition: 'Friendly', home: false },
    { date: '2026-03-31', opponent: 'United States', score: '2-0', result: 'W', competition: 'Friendly', home: false },
    { date: '2026-06-06', opponent: 'Chile', score: '2-1', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-06-10', opponent: 'Nigeria', score: '2-1', result: 'W', competition: 'Friendly', home: true },
  ],
  'dr-congo': [
    { date: '2025-12-27', opponent: 'Senegal', score: '1-1', result: 'D', competition: 'AFCON', home: false },
    { date: '2025-12-30', opponent: 'Botswana', score: '3-0', result: 'W', competition: 'AFCON', home: false },
    { date: '2026-03-25', opponent: 'Bermuda', score: '2-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-06-03', opponent: 'Denmark', score: '0-0', result: 'D', competition: 'Friendly', home: false },
    { date: '2026-06-09', opponent: 'Chile', score: '1-2', result: 'L', competition: 'Friendly', home: true },
  ],
  uzbekistan: [
    { date: '2025-10-13', opponent: 'Uruguay', score: '1-2', result: 'L', competition: 'Friendly', home: true },
    { date: '2025-11-14', opponent: 'Egypt', score: '2-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-03-27', opponent: 'Gabon', score: '3-1', result: 'W', competition: 'FIFA Series', home: true },
    { date: '2026-06-01', opponent: 'Canada', score: '0-2', result: 'L', competition: 'Friendly', home: false },
    { date: '2026-06-08', opponent: 'Netherlands', score: '1-2', result: 'L', competition: 'Friendly', home: false },
  ],
  colombia: [
    { date: '2025-11-18', opponent: 'Australia', score: '3-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-03-26', opponent: 'Croatia', score: '1-2', result: 'L', competition: 'Friendly', home: true },
    { date: '2026-03-29', opponent: 'France', score: '1-3', result: 'L', competition: 'Friendly', home: true },
    { date: '2026-06-01', opponent: 'Costa Rica', score: '3-1', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-06-07', opponent: 'Jordan', score: '2-0', result: 'W', competition: 'Friendly', home: true },
  ],

  // ===== GROUP L =====
  england: [
    { date: '2025-11-16', opponent: 'Albania', score: '2-0', result: 'W', competition: 'WCQ', home: false },
    { date: '2026-03-27', opponent: 'Uruguay', score: '1-1', result: 'D', competition: 'Friendly', home: true },
    { date: '2026-03-31', opponent: 'Japan', score: '0-1', result: 'L', competition: 'Friendly', home: true },
    { date: '2026-06-06', opponent: 'New Zealand', score: '1-0', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-06-10', opponent: 'Costa Rica', score: '3-0', result: 'W', competition: 'Friendly', home: true },
  ],
  croatia: [
    { date: '2025-11-17', opponent: 'Montenegro', score: '3-2', result: 'W', competition: 'WCQ', home: false },
    { date: '2026-03-26', opponent: 'Colombia', score: '2-1', result: 'W', competition: 'Friendly', home: false },
    { date: '2026-03-31', opponent: 'Brazil', score: '1-3', result: 'L', competition: 'Friendly', home: false },
    { date: '2026-06-02', opponent: 'Belgium', score: '0-2', result: 'L', competition: 'Friendly', home: true },
    { date: '2026-06-07', opponent: 'Slovenia', score: '2-1', result: 'W', competition: 'Friendly', home: true },
  ],
  ghana: [
    { date: '2025-11-18', opponent: 'South Korea', score: '0-1', result: 'L', competition: 'Friendly', home: false },
    { date: '2026-03-27', opponent: 'Austria', score: '1-5', result: 'L', competition: 'Friendly', home: false },
    { date: '2026-03-30', opponent: 'Germany', score: '1-2', result: 'L', competition: 'Friendly', home: false },
    { date: '2026-05-22', opponent: 'Mexico', score: '0-2', result: 'L', competition: 'Friendly', home: false },
    { date: '2026-06-02', opponent: 'Wales', score: '1-1', result: 'D', competition: 'Friendly', home: false },
  ],
  panama: [
    { date: '2026-03-27', opponent: 'South Africa', score: '1-1', result: 'D', competition: 'Friendly', home: false },
    { date: '2026-03-31', opponent: 'South Africa', score: '2-1', result: 'W', competition: 'Friendly', home: false },
    { date: '2026-05-31', opponent: 'Brazil', score: '2-6', result: 'L', competition: 'Friendly', home: false },
    { date: '2026-06-03', opponent: 'Dominican Republic', score: '4-2', result: 'W', competition: 'Friendly', home: true },
    { date: '2026-06-06', opponent: 'Bosnia and Herzegovina', score: '1-1', result: 'D', competition: 'Friendly', home: false },
  ],
};
