import { describe, it, expect } from 'vitest';
import Tournament from '../../assets/js/models/Tournament.js';

describe('Tournament Model', () => {
  it('should initialize with empty rounds', () => {
    const tournament = new Tournament();
    expect(tournament.rounds).toEqual([]);
    expect(tournament.isEmpty).toBe(true);
  });

  it('should add rounds correctly with legacy flat array', () => {
    const tournament = new Tournament();
    const round1 = [{ name: 'Team A' }, { name: 'Team B' }];
    tournament.addRound(round1);
    expect(tournament.rounds).toHaveLength(1);
    expect(tournament.rounds[0].matches).toHaveLength(1);
    expect(tournament.rounds[0].matches[0].teams).toEqual(round1);
    expect(tournament.isEmpty).toBe(false);
  });

  it('should parse new object format with teams dictionary', () => {
    const data = {
      teams: {
        "T1": { name: "Team Alpha", url: "http://alpha.com" },
        "T2": { name: "Team Beta" }
      },
      rounds: [
        {
          name: "Final",
          matches: [
            { id: "f1", teams: [{ id: "T1", score: 3 }, { id: "T2", score: 1 }] }
          ]
        }
      ]
    };

    const tournament = new Tournament(data);
    expect(tournament.rounds).toHaveLength(1);
    expect(tournament.rounds[0].name).toBe("Final");

    const match = tournament.rounds[0].matches[0];
    expect(match.id).toBe("f1");
    expect(match.teams[0].name).toBe("Team Alpha");
    expect(match.teams[0].url).toBe("http://alpha.com");
    expect(match.teams[0].score).toBe(3);
    expect(match.teams[1].name).toBe("Team Beta");
  });

  it('should auto-generate champion round when championId is set', () => {
    const data = {
      teams: { "W": { name: "Winner Team" } },
      championId: "W",
      rounds: [
        {
          name: "Final",
          matches: [
            { teams: [{ id: "W", score: 5 }, { id: "L", score: 0 }] }
          ]
        }
      ]
    };

    const tournament = new Tournament(data);
    // 1 explicit round + 1 auto-generated champion round
    expect(tournament.rounds).toHaveLength(2);
    const champRound = tournament.rounds[1];
    expect(champRound.matches[0].teams[0].name).toBe("Winner Team");
  });

  it('should add rounds with matches structure (legacy addRound)', () => {
    const tournament = new Tournament();
    tournament.addRound({
      name: 'Semifinal',
      matches: [
        { url: 'http://test.com/m1', teams: [{ name: 'A' }, { name: 'B' }] },
        { teams: [{ name: 'C' }, { name: 'D' }] }
      ]
    });
    expect(tournament.rounds).toHaveLength(1);
    expect(tournament.rounds[0].name).toBe('Semifinal');
    expect(tournament.rounds[0].matches).toHaveLength(2);
  });

  it('should convert legacy teams inside round object to matches', () => {
    const tournament = new Tournament();
    tournament.addRound({
      name: 'Round 1',
      teams: [{ name: 'X', matchUrl: 'http://m.com' }, { name: 'Y' }, { name: 'Z' }, { name: 'W' }]
    });
    expect(tournament.rounds[0].matches).toHaveLength(2);
    expect(tournament.rounds[0].matches[0].teams[0].name).toBe('X');
    expect(tournament.rounds[0].matches[0].url).toBe('http://m.com');
  });

  it('should clear rounds', () => {
    const tournament = new Tournament([[{ name: 'Team A' }]]);
    expect(tournament.isEmpty).toBe(false);
    tournament.clear();
    expect(tournament.rounds).toEqual([]);
    expect(tournament.isEmpty).toBe(true);
  });
});
