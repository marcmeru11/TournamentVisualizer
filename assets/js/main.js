import TournamentBracket from "./index.js";

/**
 * Demo Implementation
 * This file demonstrates how to use the TournamentBracket module
 * independent of its internal implementation details.
 */

try {
  // 1. Initialize the bracket with the canvas ID
  const bracket = new TournamentBracket("canvas");

  // 2. Load demo data
  const demoData = [
    ["Equipo A", "Team with an Extremely Long Name That Should Cause Boxes to Grow", "Equipo C", "Equipo D", "E"],
    ["Equipo A", "Equipo C", "E"],
    ["Equipo A", "E"],
    ["Equipo A"]
  ];

  bracket.setData(demoData);

  console.log("Tournament Bracket Module initialized successfully.");

} catch (error) {
  console.error("Failed to initialize Tournament Bracket:", error);
}