import { describe, it, expect } from 'vitest';
import Tournament from '../../assets/js/models/Tournament.js';

describe('Tournament Model', () => {
  it('should initialize with empty rounds', () => {
    const tournament = new Tournament();
    expect(tournament.rounds).toEqual([]);
    expect(tournament.isEmpty).toBe(true);
  });

  it('should add rounds correctly', () => {
    const tournament = new Tournament();
    const round1 = [{ name: 'Team A' }, { name: 'Team B' }];
    tournament.addRound(round1);
    expect(tournament.rounds).toHaveLength(1);
    expect(tournament.rounds[0]).toEqual(round1);
    expect(tournament.isEmpty).toBe(false);
  });

  it('should clear rounds', () => {
    const tournament = new Tournament([[{ name: 'Team A' }]]);
    expect(tournament.isEmpty).toBe(false);
    tournament.clear();
    expect(tournament.rounds).toEqual([]);
    expect(tournament.isEmpty).toBe(true);
  });
});
