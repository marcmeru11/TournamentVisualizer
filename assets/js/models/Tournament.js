/**
 * Tournament.js
 * Model representing a tournament data structure.
 */
class Tournament {
  #rounds = [];

  constructor(initialRounds = []) {
    for (const round of initialRounds) {
      this.addRound(round);
    }
  }

  addRound(roundData) {
    if (Array.isArray(roundData)) {
      this.#rounds.push({ teams: roundData });
    } else {
      this.#rounds.push({
        name: roundData.name || null,
        url: roundData.url || null,
        textColor: roundData.textColor || null,
        teams: roundData.teams || []
      });
    }
  }

  get rounds() {
    return this.#rounds;
  }

  get isEmpty() {
    return this.#rounds.length === 0 || this.#rounds[0].teams.length === 0;
  }

  clear() {
    this.#rounds = [];
  }
}

export default Tournament;
