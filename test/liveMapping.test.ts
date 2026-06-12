import { describe, it, expect } from 'vitest';
import { toTeamId } from '../utils/liveSource';
import { TEAMS } from '../data/teams';

// The live-results pipeline maps TheSportsDB team names (always English) to our
// internal team ids. This is the data join that powers live scores, standings
// and the calendar — and it is completely independent of UI translation. These
// tests lock the mapping so a rename/alias change can't silently break it.

/** Canonical TheSportsDB spelling for every team → our id. */
const CANONICAL: Record<string, string> = {
  Mexico: 'mexico',
  'South Africa': 'south-africa',
  'South Korea': 'south-korea',
  'Czech Republic': 'czechia',
  Canada: 'canada',
  'Bosnia and Herzegovina': 'bosnia-and-herzegovina',
  Qatar: 'qatar',
  Switzerland: 'switzerland',
  Brazil: 'brazil',
  Morocco: 'morocco',
  Haiti: 'haiti',
  Scotland: 'scotland',
  USA: 'usa',
  Paraguay: 'paraguay',
  Australia: 'australia',
  Turkey: 'turkiye',
  Germany: 'germany',
  Curacao: 'curacao',
  'Ivory Coast': 'ivory-coast',
  Ecuador: 'ecuador',
  Netherlands: 'netherlands',
  Japan: 'japan',
  Sweden: 'sweden',
  Tunisia: 'tunisia',
  Belgium: 'belgium',
  Egypt: 'egypt',
  Iran: 'iran',
  'New Zealand': 'new-zealand',
  Spain: 'spain',
  'Cape Verde': 'cape-verde',
  'Saudi Arabia': 'saudi-arabia',
  Uruguay: 'uruguay',
  France: 'france',
  Senegal: 'senegal',
  Iraq: 'iraq',
  Norway: 'norway',
  Argentina: 'argentina',
  Algeria: 'algeria',
  Austria: 'austria',
  Jordan: 'jordan',
  Portugal: 'portugal',
  'DR Congo': 'dr-congo',
  Uzbekistan: 'uzbekistan',
  Colombia: 'colombia',
  England: 'england',
  Croatia: 'croatia',
  Ghana: 'ghana',
  Panama: 'panama',
};

/** Alternate spellings TheSportsDB has used at various times. */
const ALIASES: Record<string, string> = {
  Czechia: 'czechia',
  'Bosnia-Herzegovina': 'bosnia-and-herzegovina',
  'United States': 'usa',
  'United States of America': 'usa',
  'Türkiye': 'turkiye',
  Turkiye: 'turkiye',
  'Curaçao': 'curacao',
  "Cote d'Ivoire": 'ivory-coast',
  'Côte d’Ivoire': 'ivory-coast',
  'Democratic Republic of the Congo': 'dr-congo',
  'Congo DR': 'dr-congo',
};

describe('live results: team-name → id mapping', () => {
  it('maps every canonical TheSportsDB name to the right id', () => {
    for (const [apiName, id] of Object.entries(CANONICAL)) {
      expect(toTeamId(apiName), apiName).toBe(id);
    }
  });

  it('covers all 48 teams', () => {
    const mappedIds = new Set(Object.values(CANONICAL));
    expect(mappedIds.size).toBe(48);
    for (const team of TEAMS) {
      expect(mappedIds.has(team.id), `missing canonical name for ${team.id}`).toBe(true);
    }
  });

  it('handles known alternate spellings', () => {
    for (const [apiName, id] of Object.entries(ALIASES)) {
      expect(toTeamId(apiName), apiName).toBe(id);
    }
  });

  it('is case- and punctuation-insensitive', () => {
    expect(toTeamId('south korea')).toBe('south-korea');
    expect(toTeamId('SOUTH KOREA')).toBe('south-korea');
    expect(toTeamId('  Brazil  ')).toBe('brazil');
  });

  it('returns null for unknown names', () => {
    expect(toTeamId('Atlantis')).toBeNull();
    expect(toTeamId('')).toBeNull();
  });
});
