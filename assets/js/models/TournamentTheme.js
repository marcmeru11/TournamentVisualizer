/**
 * TournamentTheme.js
 * Encapsulates all visual and design properties for the tournament bracket.
 */
class TournamentTheme {
  constructor(options = {}) {
    this.backgroundColor = options.backgroundColor || null;
    this.boxFillColor = options.boxFillColor || "#dbeafe";
    this.boxHoverFillColor = options.boxHoverFillColor || this.boxFillColor;
    this.boxStrokeColor = options.boxStrokeColor || "#1e293b";
    this.boxHoverStrokeColor = options.boxHoverStrokeColor || this.boxStrokeColor;
    this.boxLineWidth = options.boxLineWidth ?? 2;
    this.boxBorderRadius = options.boxBorderRadius ?? 0;
    this.textColor = options.textColor || "#111827";
    this.textColorHover = options.textColorHover || this.textColor;
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
    this.scoreBoxHoverFillColor = options.scoreBoxHoverFillColor || this.scoreBoxFillColor;
    this.scoreTextColor = options.scoreTextColor || "#ffffff";
    this.scoreTextColorHover = options.scoreTextColorHover || this.scoreTextColor;
    this.scoreBoxWidth = options.scoreBoxWidth ?? 30;
    // Round Headers
    this.roundHeaderFontSize = options.roundHeaderFontSize ?? 18;
    this.roundHeaderTextColor = options.roundHeaderTextColor || "#64748b";
    this.roundHeaderMarginBottom = options.roundHeaderMarginBottom ?? 30;
    // Layout
    this.layoutType = options.layoutType || "single"; // 'single' or 'split'
    this.centerGap = options.centerGap ?? 200;

    // Center Button
    this.showCenterButton = options.showCenterButton ?? false;
    this.centerButtonText = options.centerButtonText || "Center View";
    this.centerButtonStyle = {
      padding: "8px 16px",
      backgroundColor: "#1e293b",
      color: "#f8fafc",
      border: "1px solid #38bdf8",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.2s ease",
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      ...options.centerButtonStyle
    };

    // Match Indicators
    this.matchIndicatorType = options.matchIndicatorType || "circle"; // 'circle', 'pill', 'line', 'hidden'
    this.matchIndicatorSize = options.matchIndicatorSize ?? 20;
    this.matchIndicatorColor = options.matchIndicatorColor || this.boxStrokeColor;
    this.matchIndicatorIconColor = options.matchIndicatorIconColor || "#ffffff";
    this.matchIndicatorLabel = options.matchIndicatorLabel || "i";
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
      fontFamily: "sans-serif",
      matchIndicatorType: "pill",
      matchIndicatorColor: "#1e293b",
      matchIndicatorIconColor: "#38bdf8",
      matchIndicatorLabel: "VS"
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
