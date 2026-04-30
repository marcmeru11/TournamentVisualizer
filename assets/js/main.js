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
    
    // Winner Highlights
    winnerBoxFillColor: "#1a3a2a", // Dark green
    winnerBoxStrokeColor: "#2ecc71", // Emerald green border
    winnerTextColor: "#ffffff",
    winnerScoreBoxFillColor: "#2ecc71", // Emerald score box
    winnerScoreTextColor: "#000000",
    
    winnerBoxHoverFillColor: "#254a35", // Brighter green on hover
    winnerScoreBoxHoverFillColor: "#41e081",
    winnerTextColorHover: "#ffffff",
    
    // Line Highlights
    winnerLineColor: "#2ecc71",
    winnerLineWidth: 2,
    loserLineColor: "#333333",
    loserLineWidth: 1,
    
    // Champion Styling
    championBoxFillColor: "#3d3211", // Dark gold
    championBoxStrokeColor: "#f1c40f", // Gold
    championTextColor: "#f1c40f",
    championBoxLineWidth: 3,
    championFontSize: 20,
    championLogoSize: 32,
    championPaddingX: 40,
    championLogoMargin: 15,
    
    // Hover Effects
    boxHoverFillColor: "#3a3a3a",
    boxHoverStrokeColor: "transparent",
    textColorHover: "#ffffff",
    scoreBoxHoverFillColor: "#3a3a3a",
    scoreTextColorHover: "#ffffff",

    // Score box
    scoreBoxFillColor: "#2a2a2a",
    scoreTextColor: "#ffffff",

    // Seeds
    showSeeds: true,
    seedTextColor: "#cccccc",
    seedFontSize: 10,
    seedMarginRight: 8,
    
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
      "LIV": { name: "Liverpool", seed: 1, url: "https://example.com/liverpool", image: "./assets/logos/liverpool.png" },
      "GAL": { name: "Galatasaray", seed: 8, url: "https://example.com/galatasaray", image: "./assets/logos/galatasaray.png" },
      "CHE": { name: "Chelsea", seed: 4, url: "https://example.com/chelsea", image: "./assets/logos/chelsea.png" },
      "PSG": { name: "Paris SG", seed: 5, url: "https://example.com/psg", image: "./assets/logos/psg.png" },
      "RMA": { name: "Real Madrid", seed: 2, url: "https://example.com/real-madrid", image: "./assets/logos/real_madrid.png" },
      "FCB": { name: "FC Barcelona", seed: 7, url: "https://example.com/barcelona", image: "./assets/logos/barcelona.png" },
      "MCI": { name: "Man. City", seed: 3, url: "https://example.com/man-city", image: "./assets/logos/man_city.png" },
      "BAY": { name: "Bayern M.", seed: 6, url: "https://example.com/bayern", image: "./assets/logos/bayern.png" }
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
            winnerId: "BAY",
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
    ],
    extraMatches: [
      {
        title: "Partido por el Tercer Puesto",
        match: {
          id: "3rd-place",
          url: "https://example.com/match-3rd",
          teams: [
            { id: "GAL", score: 2 },
            { id: "BAY", score: 1 }
          ]
        }
      },
      {
        title: "Partido de Consolación",
        match: {
          id: "consolation",
          teams: [
            { id: "CHE", score: 0 },
            { id: "FCB", score: 3 }
          ]
        }
      }
    ]
  };

  bracket.setData(tournamentData);

  console.log("Tournament Bracket Module initialized successfully.");

} catch (error) {
  console.error("Failed to initialize Tournament Bracket:", error);
}