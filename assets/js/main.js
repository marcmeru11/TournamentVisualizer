import TournamentBracket from "./index.js";
import TournamentTheme from "./models/TournamentTheme.js";

/**
 * Demo Implementation
 * This file demonstrates how to use the TournamentBracket module
 * with the new TournamentTheme class.
 */

try {
  const customTheme = TournamentTheme.DARK.extend({
    backgroundColor: "#1b1b1b", // Minimalist dark gray
    boxFillColor: "#2a2a2a", // Elevated dark gray
    boxStrokeColor: "transparent", // No border for clean look
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
    matchIndicatorType: "hidden", // No indicator
    
    // Hover Effects
    boxHoverFillColor: "#3a3a3a",
    boxHoverStrokeColor: "transparent",
    textColorHover: "#ffffff",
    scoreBoxHoverFillColor: "#3a3a3a",
    scoreTextColorHover: "#ffffff",

    // Score box
    scoreBoxFillColor: "#2a2a2a", // Same as box for unified pill look
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
    },
    matchIndicatorType: "pill",
    matchIndicatorLabel: "VS",
    matchIndicatorColor: "#1f2833",
    matchIndicatorIconColor: "#66fcf1",
  });

  const bracket = new TournamentBracket("canvas", customTheme);
  
  const demoData = [
    {
      name: "Cuartos de final",
      teams: [
        { name: "LIV", score: 0 }, 
        { name: "GAL", score: 1 },
        { name: "CHE", score: 2 }, 
        { name: "PSG", score: 5 },
        { name: "RMA", score: 3 }, 
        { name: "FCB", score: 1 },
        { name: "MCI", score: 2 }, 
        { name: "BAY", score: 2 }
      ]
    },
    {
      name: "Semifinales",
      teams: [
        { name: "LIV", score: 0 }, 
        { name: "PSG", score: 2, matchUrl: "https://example.com/match2" },
        { name: "RMA", score: 1, matchUrl: "https://example.com/match3" }, 
        { name: "BAY", score: 0, matchUrl: "https://example.com/match4" }
      ]
    },
    {
      name: "Final",
      teams: [
        { name: "PSG", score: 1 }, 
        { name: "RMA", score: 2 }
      ]
    },
    {
      teams: [
        { name: "RMA" }
      ]
    }
  ];


  bracket.setData(demoData);

  console.log("Tournament Bracket Module initialized successfully.");

} catch (error) {
  console.error("Failed to initialize Tournament Bracket:", error);
}