import TournamentBracket from "./index.js";
import TournamentTheme from "./models/TournamentTheme.js";

/**
 * Demo Implementation
 * This file demonstrates how to use the TournamentBracket module
 * with the new TournamentTheme class.
 */

try {
  const customTheme = TournamentTheme.DARK.extend({
    backgroundColor: "#1b1b1b",
    boxFillColor: "#2a2a2a",
    boxStrokeColor: "transparent",
    boxLineWidth: 0,
    boxBorderRadius: 12,
    textColor: "#ffffff",
    lineColor: "#555555",
    lineWidth: 1,
    
    // Layout
    roundSpacingX: 80,
    layoutType: "single",
    teamSpacingY: 10,
    teamYsize: 45,
    paddingX: 20,
    
    // Matches
    matchIndicatorType: "pill",
    matchIndicatorLabel: "VS",
    matchIndicatorColor: "#1f2833",
    matchIndicatorIconColor: "#66fcf1",
    
    // Hover Effects
    boxHoverFillColor: "#3a3a3a",
    boxHoverStrokeColor: "transparent",
    textColorHover: "#ffffff",
    scoreBoxHoverFillColor: "#3a3a3a",
    scoreTextColorHover: "#ffffff",

    // Score box
    scoreBoxFillColor: "#2a2a2a",
    scoreTextColor: "#ffffff",
    
    // Round Headers
    roundHeaderFontSize: 16,
    roundHeaderTextColor: "#f0f0f0",
    roundHeaderMarginBottom: 25,
    
    // Extra
    showCenterButton: true,
    centerButtonStyle: {
      backgroundColor: "#2a2a2a",
      color: "#ffffff",
      border: "1px solid #3a3a3a",
      borderRadius: "20px",
      fontWeight: "normal",
      boxShadow: "none"
    }
  });

  const bracket = new TournamentBracket("canvas", customTheme);
  
  const tournamentData = {
    teams: {
      "LIV": { name: "Liverpool", url: "https://example.com/liverpool" },
      "GAL": { name: "Galatasaray", url: "https://example.com/galatasaray" },
      "CHE": { name: "Chelsea", url: "https://example.com/chelsea" },
      "PSG": { name: "Paris SG", url: "https://example.com/psg" },
      "RMA": { name: "Real Madrid", url: "https://example.com/real-madrid" },
      "FCB": { name: "FC Barcelona", url: "https://example.com/barcelona" },
      "MCI": { name: "Man. City", url: "https://example.com/man-city" },
      "BAY": { name: "Bayern M.", url: "https://example.com/bayern" }
    },
    championId: "RMA",
    rounds: [
      {
        name: "Cuartos de final",
        matches: [
          {
            id: "qf1",
            teams: [
              { id: "LIV", score: 0 },
              { id: "GAL", score: 1 }
            ]
          },
          {
            id: "qf2",
            teams: [
              { id: "CHE", score: 2 },
              { id: "PSG", score: 5 }
            ]
          },
          {
            id: "qf3",
            teams: [
              { id: "RMA", score: 3 },
              { id: "FCB", score: 1 }
            ]
          },
          {
            id: "qf4",
            teams: [
              { id: "MCI", score: 2 },
              { id: "BAY", score: 2 }
            ]
          }
        ]
      },
      {
        name: "Semifinales",
        matches: [
          {
            id: "sf1",
            url: "https://example.com/match-sf1",
            teams: [
              { id: "GAL", score: 0 },
              { id: "PSG", score: 2 }
            ]
          },
          {
            id: "sf2",
            url: "https://example.com/match-sf2",
            teams: [
              { id: "RMA", score: 1 },
              { id: "BAY", score: 0 }
            ]
          }
        ]
      },
      {
        name: "Final",
        textColor: "#66fcf1",
        matches: [
          {
            id: "final",
            teams: [
              { id: "PSG", score: 1 },
              { id: "RMA", score: 2 }
            ]
          }
        ]
      }
    ]
  };

  bracket.setData(tournamentData);

  console.log("Tournament Bracket Module initialized successfully.");

} catch (error) {
  console.error("Failed to initialize Tournament Bracket:", error);
}