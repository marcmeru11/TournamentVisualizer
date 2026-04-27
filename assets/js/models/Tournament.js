/**
 * Tournament.js
 * Model representing a tournament data structure.
 * 
 * Supports three input formats:
 * 
 * 1. **New format (recommended)** — A single object with a teams dictionary:
 *    { teams: { "RMA": { name: "Real Madrid", url: "..." } }, championId: "RMA", rounds: [...] }
 * 
 * 2. **Rounds array with matches** — An array of round objects:
 *    [{ name: "Round 1", matches: [{ teams: [...] }] }]
 * 
 * 3. **Legacy flat array** — An array of arrays:
 *    [["Team A", "Team B"], ["Team A"]]
 */
class Tournament {
  #rounds = [];
  #teamsDictionary = {};

  constructor(data) {
    if (!data) return;

    if (this.#isNewFormat(data)) {
      this.#parseNewFormat(data);
    } else if (Array.isArray(data)) {
      for (const round of data) {
        this.addRound(round);
      }
    }
  }

  /**
   * Detects the new top-level object format: { teams: {}, rounds: [] }
   */
  #isNewFormat(data) {
    return !Array.isArray(data) && typeof data === "object" && data.rounds;
  }

  /**
   * Parses the new { teams, championId, rounds } format.
   */
  #parseNewFormat(data) {
    this.#teamsDictionary = data.teams || {};

    for (const roundData of data.rounds) {
      const parsedRound = {
        name: roundData.name || null,
        url: roundData.url || null,
        textColor: roundData.textColor || null,
        matches: []
      };

      for (const matchData of (roundData.matches || [])) {
        const resolvedTeams = matchData.teams.map(t => this.#resolveTeam(t));
        parsedRound.matches.push({
          id: matchData.id || null,
          url: matchData.url || null,
          teams: resolvedTeams
        });
      }

      this.#rounds.push(parsedRound);
    }

    // Auto-generate champion round
    if (data.championId) {
      const champTeam = this.#resolveTeam({ id: data.championId });
      this.#rounds.push({
        name: null,
        url: null,
        textColor: null,
        matches: [{ id: null, url: null, teams: [champTeam] }]
      });
    }
  }

  /**
   * Resolves a team reference { id, score } into a full team object
   * by looking up the teams dictionary.
   */
  #resolveTeam(teamRef) {
    if (typeof teamRef === "string") {
      // Plain string — check dictionary first, else use as name
      const entry = this.#teamsDictionary[teamRef];
      return entry ? { ...entry, id: teamRef } : { name: teamRef };
    }

    if (teamRef.id && this.#teamsDictionary[teamRef.id]) {
      const entry = this.#teamsDictionary[teamRef.id];
      // Merge dictionary data with match-level data (score, etc.)
      return { ...entry, ...teamRef, name: entry.name };
    }

    // No dictionary match — pass through as-is
    return teamRef;
  }

  /**
   * Adds a single round. Used for legacy/array formats.
   */
  addRound(roundData) {
    let parsedRound = {
      name: null,
      url: null,
      textColor: null,
      matches: []
    };

    if (Array.isArray(roundData)) {
      parsedRound.matches = this.#teamsToMatches(roundData);
    } else {
      parsedRound.name = roundData.name || null;
      parsedRound.url = roundData.url || null;
      parsedRound.textColor = roundData.textColor || null;
      
      if (roundData.matches) {
        parsedRound.matches = roundData.matches;
      } else if (roundData.teams) {
        parsedRound.matches = this.#teamsToMatches(roundData.teams);
      }
    }
    
    this.#rounds.push(parsedRound);
  }

  #teamsToMatches(teams) {
    const matches = [];
    for (let i = 0; i < teams.length; i += 2) {
      const team1 = teams[i];
      const team2 = i + 1 < teams.length ? teams[i + 1] : null;
      
      let matchUrl = null;
      if (team1 && typeof team1 === "object" && team1.matchUrl) matchUrl = team1.matchUrl;
      if (!matchUrl && team2 && typeof team2 === "object" && team2.matchUrl) matchUrl = team2.matchUrl;
      
      const match = {
        teams: team2 ? [team1, team2] : [team1]
      };
      if (matchUrl) match.url = matchUrl;
      matches.push(match);
    }
    return matches;
  }

  get rounds() {
    return this.#rounds;
  }

  get isEmpty() {
    return this.#rounds.length === 0 || this.#rounds[0].matches.length === 0;
  }

  clear() {
    this.#rounds = [];
  }
}

export default Tournament;
