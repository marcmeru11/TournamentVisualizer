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
    //layoutType: "split",
    matchIndicatorType: "line",
    matchIndicatorLabel: "VS",
    matchIndicatorColor: "#1e293b",
    matchIndicatorIconColor: "#38bdf8",
    centerGap: 250,
    showCenterButton: true
  });

  const bracket = new TournamentBracket("canvas", customTheme);
  
  const demoData = [
    [
      { name: "Team 1", score: 2, url: "https://example.com/team1", matchUrl: "https://example.com/match1" }, 
      { name: "Team 2", score: 1, url: "https://example.com/team2" },
      { name: "Team 3", score: 0, url: "https://example.com/team3", matchUrl: "https://example.com/match2" }, 
      { name: "Team 4", score: 3, url: "https://example.com/team4" },
      { name: "Team 5", score: 1, url: "https://example.com/team5", matchUrl: "https://example.com/match3" }, 
      { name: "Team 6", score: 2, url: "https://example.com/team6" },
      { name: "Team 7", score: 3, url: "https://example.com/team7", matchUrl: "https://example.com/match4" }, 
      { name: "Team 8", score: 0, url: "https://example.com/team8" }
    ],
    [
      { name: "Team 1", score: 3, url: "https://example.com/team1", matchUrl: "https://example.com/match5" }, 
      { name: "Team 4", score: 2, url: "https://example.com/team4" },
      { name: "Team 6", score: 1, url: "https://example.com/team6", matchUrl: "https://example.com/match6" }, 
      { name: "Team 7", score: 4, url: "https://example.com/team7" }
    ],
    [
      { name: "Team 1", score: 5, url: "https://example.com/team1", matchUrl: "https://example.com/match7" }, 
      { name: "Team 7", score: 2, url: "https://example.com/team7" }
    ],
    [
      { name: "Winner: Team 1", url: "https://example.com/team1" }
    ]
  ];


  bracket.setData(demoData);

  console.log("Tournament Bracket Module initialized successfully.");

} catch (error) {
  console.error("Failed to initialize Tournament Bracket:", error);
}