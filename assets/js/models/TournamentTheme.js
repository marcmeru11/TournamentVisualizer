/**
 * TournamentTheme.js
 * Encapsulates all visual and design properties for the tournament bracket.
 */
class TournamentTheme {
  constructor(options = {}) {
    this.backgroundColor = options.backgroundColor || null;
    this.boxFillColor = options.boxFillColor || "#dbeafe";
    this.boxStrokeColor = options.boxStrokeColor || "#1e293b";
    this.boxLineWidth = options.boxLineWidth ?? 2;
    this.boxBorderRadius = options.boxBorderRadius ?? 0;
    this.textColor = options.textColor || "#111827";
    this.lineColor = options.lineColor || "#0f172a";
    this.lineWidth = options.lineWidth ?? 3;
    this.fontSize = options.fontSize ?? 16;
    this.fontFamily = options.fontFamily || "Arial";
    this.roundSpacingX = options.roundSpacingX ?? 100;
    this.teamSpacingY = options.teamSpacingY ?? 20;
    this.teamYsize = options.teamYsize ?? 50;
    this.minWidth = options.minWidth ?? 100;
    this.paddingX = options.paddingX ?? 24;
    // Score
    this.scoreBoxFillColor = options.scoreBoxFillColor || "#1e293b";
    this.scoreTextColor = options.scoreTextColor || "#ffffff";
    this.scoreBoxWidth = options.scoreBoxWidth ?? 30;
    // Layout
    this.layoutType = options.layoutType || "single"; // 'single' or 'split'
    this.centerGap = options.centerGap ?? 200;
  }

  /**
   * Preset for a clean light theme.
   */
  static get LIGHT() {
    return new TournamentTheme();
  }

  /**
   * Preset for a premium dark theme.
   */
  static get DARK() {
    return new TournamentTheme({
      backgroundColor: "#0f172a",
      boxFillColor: "#1e293b",
      boxStrokeColor: "#38bdf8",
      boxLineWidth: 1,
      boxBorderRadius: 10,
      textColor: "#f8fafc",
      lineColor: "#334155",
      lineWidth: 2,
      fontFamily: "sans-serif"
    });
  }

  /**
   * Preset for a professional blue theme.
   */
  static get BLUE() {
    return new TournamentTheme({
      backgroundColor: "#f8fafc",
      boxFillColor: "#3b82f6",
      boxStrokeColor: "#1d4ed8",
      textColor: "#ffffff",
      lineColor: "#94a3b8",
      boxBorderRadius: 4
    });
  }

  /**
   * Creates a customized version of this theme.
   */
  extend(overrides) {
    return new TournamentTheme({ ...this, ...overrides });
  }
}

export default TournamentTheme;
