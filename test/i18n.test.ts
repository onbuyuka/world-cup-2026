import { describe, it, expect } from 'vitest';
import {
  LANGS,
  STRINGS,
  TEAM_NAME_TR,
  KIT_COLOR_TR,
  translate,
  teamName,
  kitColor,
  type StrKey,
} from '../utils/i18n';
import { TEAMS } from '../data/teams';

// i18n is a display layer over stable ids, but a missing entry shows English
// (or a raw key) instead of crashing. These tests ensure the dictionaries stay
// complete as data/strings evolve.

describe('i18n: dictionary completeness', () => {
  it('offers exactly English + Turkish', () => {
    expect(LANGS.map((l) => l.code).sort()).toEqual(['en', 'tr']);
  });

  it('every UI string has a non-empty English and Turkish form', () => {
    for (const [key, entry] of Object.entries(STRINGS)) {
      expect(entry.en?.trim(), `${key}.en`).toBeTruthy();
      expect(entry.tr?.trim(), `${key}.tr`).toBeTruthy();
    }
  });
});

describe('i18n: translate()', () => {
  it('returns the requested language', () => {
    expect(translate('en', 'nav.bracket')).toBe('Bracket');
    expect(translate('tr', 'nav.bracket')).toBe('Tahmin');
  });

  it('interpolates {tokens}', () => {
    expect(translate('en', 'group.label', { id: 'A' })).toBe('Group A');
    expect(translate('tr', 'group.label', { id: 'A' })).toBe('Grup A');
    expect(translate('en', 'toolbar.thirds', { n: 5 })).toContain('5/8');
  });

  it('falls back to the key for an unknown id (defensive)', () => {
    expect(translate('en', '__missing__' as StrKey)).toBe('__missing__');
  });
});

describe('i18n: team names', () => {
  it('has a Turkish name for all 48 teams', () => {
    for (const team of TEAMS) {
      expect(TEAM_NAME_TR[team.id], `missing TR name for ${team.id}`).toBeTruthy();
    }
  });

  it('teamName returns English source as-is, Turkish from the map', () => {
    expect(teamName('spain', 'Spain', 'en')).toBe('Spain');
    expect(teamName('spain', 'Spain', 'tr')).toBe('İspanya');
    expect(teamName('germany', 'Germany', 'tr')).toBe('Almanya');
  });

  it('falls back to the English source for an unknown id', () => {
    expect(teamName('atlantis', 'Atlantis', 'tr')).toBe('Atlantis');
  });
});

describe('i18n: kit colours', () => {
  it('translates every kit colour label used in the data', () => {
    const labels = new Set<string>();
    for (const team of TEAMS) {
      if (team.kits) {
        labels.add(team.kits.home.label);
        labels.add(team.kits.away.label);
      }
    }
    for (const label of labels) {
      expect(KIT_COLOR_TR[label], `missing TR kit colour for "${label}"`).toBeTruthy();
    }
  });

  it('kitColor returns English source as-is, Turkish from the map', () => {
    expect(kitColor('Red', 'en')).toBe('Red');
    expect(kitColor('Red', 'tr')).toBe('Kırmızı');
    expect(kitColor('Navy', 'tr')).toBe('Lacivert');
  });
});
