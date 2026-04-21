import TournamentBracket from "./index.js";
import TournamentTheme from "./models/TournamentTheme.js";

/**
 * Demo Implementation
 * This file demonstrates how to use the TournamentBracket module
 * with the new TournamentTheme class.
 */

try {
  const customTheme = TournamentTheme.DARK.extend({
    boxBorderRadius: 15,
    roundSpacingX: 120,
    layoutType: "split",
    centerGap: 250
  });

  const bracket = new TournamentBracket("canvas", customTheme);
  
  const demoData = [
    [
      { name: "Team 1", score: 2 }, { name: "Team 2", score: 1 },
      { name: "Team 3", score: 0 }, { name: "Team 4", score: 3 },
      { name: "Team 5", score: 1 }, { name: "Team 6", score: 2 },
      { name: "Team 7", score: 3 }, { name: "Team 8", score: 0 }
    ],
    [
      { name: "Team 1", score: 3 }, { name: "Team 4", score: 2 },
      { name: "Team 6", score: 1 }, { name: "Team 7", score: 4 }
    ],
    [
      { name: "Team 1", score: 5 }, { name: "Team 7", score: 2 }
    ],
    [
      { name: "Winner: Team 1" }
    ]
  ];

  bracket.setData(demoData);

  console.log("Tournament Bracket Module initialized successfully.");

} catch (error) {
  console.error("Failed to initialize Tournament Bracket:", error);
}