import { describe, it, expect } from 'vitest';
import { scorePrediction, POINTS } from '../utils/score';
import { createInitialState } from '../utils/bracket';

// Scoring grades a saved prediction against real results. It must never throw
// and must award nothing until matches are actually decided.

describe('scorePrediction', () => {
  it('returns all zeros with no live results', () => {
    const s = scorePrediction(createInitialState(), []);
    expect(s.total).toBe(0);
    expect(s.possible).toBe(0);
    expect(s.groupPoints).toBe(0);
    expect(s.thirdsPoints).toBe(0);
    expect(s.knockoutPoints).toBe(0);
    expect(s.correct).toBe(0);
    expect(s.decided).toBe(0);
    expect(s.groupStageComplete).toBe(false);
  });

  it('does not throw on a populated prediction with no results', () => {
    const s = createInitialState();
    s.thirdPlaceQualifiers = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    expect(() => scorePrediction(s, [])).not.toThrow();
    expect(scorePrediction(s, []).total).toBe(0);
  });

  it('weights later rounds more heavily', () => {
    expect(POINTS.champion).toBeGreaterThan(POINTS.sf);
    expect(POINTS.sf).toBeGreaterThan(POINTS.qf);
    expect(POINTS.qf).toBeGreaterThan(POINTS.r16);
    expect(POINTS.r16).toBeGreaterThan(POINTS.r32);
    expect(POINTS.champion).toBe(15);
  });
});
