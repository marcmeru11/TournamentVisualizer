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

    // Team Logos
    this.showTeamLogos = options.showTeamLogos ?? true;
    this.teamLogoSize = options.teamLogoSize ?? 28;
    this.teamLogoShape = options.teamLogoShape || "circle"; // 'circle' or 'rect'
    this.teamLogoBorderRadius = options.teamLogoBorderRadius ?? 4;
    this.teamLogoMargin = options.teamLogoMargin ?? 8;
    this.teamLogoPosition = options.teamLogoPosition || "left"; // 'left' or 'right'

    // Extra Matches
    this.extraMatchesMarginTop = options.extraMatchesMarginTop ?? 60;
    this.extraMatchesDefaultLabel = options.extraMatchesDefaultLabel || "Extra Match";
    this.extraMatchSpacingY = options.extraMatchSpacingY ?? 40;

    // Winner Styling
    this.highlightWinner = options.highlightWinner ?? true;
    this.winnerBoxFillColor = options.winnerBoxFillColor || null;
    this.winnerBoxStrokeColor = options.winnerBoxStrokeColor || null;
    this.winnerTextColor = options.winnerTextColor || null;
    this.winnerScoreBoxFillColor = options.winnerScoreBoxFillColor || null;
    this.winnerScoreTextColor = options.winnerScoreTextColor || null;

    this.winnerBoxHoverFillColor = options.winnerBoxHoverFillColor || null;
    this.winnerBoxHoverStrokeColor = options.winnerBoxHoverStrokeColor || null;
    this.winnerScoreBoxHoverFillColor = options.winnerScoreBoxHoverFillColor || null;
    this.winnerTextColorHover = options.winnerTextColorHover || null;
    this.winnerScoreTextColorHover = options.winnerScoreTextColorHover || null;

    // Line Styling (Winner/Loser)
    this.highlightWinnerLines = options.highlightWinnerLines ?? true;
    this.winnerLineColor = options.winnerLineColor || null;
    this.winnerLineWidth = options.winnerLineWidth || null;
    this.loserLineColor = options.loserLineColor || null;
    this.loserLineWidth = options.loserLineWidth || null;

    // Champion Styling
    this.highlightChampion = options.highlightChampion ?? true;
    this.championBoxFillColor = options.championBoxFillColor || null;
    this.championBoxStrokeColor = options.championBoxStrokeColor || null;
    this.championTextColor = options.championTextColor || null;
    this.championBoxLineWidth = options.championBoxLineWidth || null;
    this.championFontSize = options.championFontSize || null;
    this.championLogoSize = options.championLogoSize || null;
    this.championBoxWidth = options.championBoxWidth || null;
    this.championBoxHeight = options.championBoxHeight || null;
    this.championLogoMargin = options.championLogoMargin || null;
    this.championPaddingX = options.championPaddingX || null;

    // Loser Styling
    this.loserBoxFillColor = options.loserBoxFillColor || null;
    this.loserBoxStrokeColor = options.loserBoxStrokeColor || null;
    this.loserTextColor = options.loserTextColor || null;

    this.teamPaddingX = options.teamPaddingX ?? 20;
  }

  /**
   * Clean, high legibility, with subtle shadows/borders and blue accents.
   */
  static get LIGHT() {
    return new TournamentTheme({
      backgroundColor: "#f8f9fa", // Fondo gris ultra claro típico de Google
      boxFillColor: "#ffffff",    // Cajas completamente blancas
      boxStrokeColor: "#dadce0",  // Borde gris muy sutil
      boxLineWidth: 1,
      boxBorderRadius: 16,        // Esquinas tipo burbuja
      textColor: "#3c4043",       // Gris oscuro para el texto principal
      lineColor: "#dadce0",       // Líneas grises
      lineWidth: 2,
      fontFamily: "system-ui, -apple-system, sans-serif",
      
      // Mismo fondo para la caja y el marcador (efecto unificado)
      scoreBoxFillColor: "#ffffff", 
      scoreTextColor: "#3c4043",
      
      highlightWinner: true,
      winnerBoxFillColor: "#ffffff",
      winnerBoxStrokeColor: "#bdc1c6", // Borde del ganador un poco más marcado
      winnerTextColor: "#202124",      // Negro casi puro para resaltar
      winnerLineColor: "#1a73e8",      // Azul oficial de Google para el avance
      winnerLineWidth: 2,
      winnerScoreBoxFillColor: "#ffffff",
      winnerScoreTextColor: "#202124",

      loserBoxFillColor: "#ffffff",
      loserBoxStrokeColor: "#dadce0",
      loserTextColor: "#80868b",       // Gris apagado para los que pierden

      highlightChampion: true,
      championBoxFillColor: "#ffffff",
      championBoxStrokeColor: "#1a73e8", // Borde azul para el campeón
      championTextColor: "#1a73e8",
      championFontSize: 18,
      championPaddingX: 30,

      roundHeaderTextColor: "#5f6368",
      
      matchIndicatorType: "pill",
      matchIndicatorLabel: "VS",
      matchIndicatorColor: "#f1f3f4",      // Fondo de la píldora gris clarito
      matchIndicatorIconColor: "#1a73e8"   // Texto de la píldora en azul
    });
  }

  /**
   * Sober, clean, with highly rounded corners and subtle contrasts.
   */
  static get DARK() {
    return new TournamentTheme({
      backgroundColor: "#202124", // Fuerza el fondo oscuro en el Canvas
      boxFillColor: "#303134",
      boxStrokeColor: "#3c4043",
      boxLineWidth: 1,
      boxBorderRadius: 16, // Esquinas bien redondas
      textColor: "#e8eaed",
      lineColor: "#5f6368",
      lineWidth: 2,
      fontFamily: "system-ui, -apple-system, sans-serif",
      
      // Hacemos que el marcador tenga el mismo fondo que la caja para que no se note la división
      scoreBoxFillColor: "#303134", 
      scoreTextColor: "#e8eaed",
      
      highlightWinner: true,
      winnerBoxFillColor: "#303134",
      winnerBoxStrokeColor: "#5f6368",
      winnerTextColor: "#ffffff",
      winnerLineColor: "#8ab4f8", // Azul Google claro (Dark mode)
      winnerLineWidth: 2,
      winnerScoreBoxFillColor: "#303134",
      winnerScoreTextColor: "#ffffff",

      loserBoxFillColor: "#303134",
      loserBoxStrokeColor: "#3c4043",
      loserTextColor: "#9aa0a6",

      highlightChampion: true,
      championBoxFillColor: "#303134",
      championBoxStrokeColor: "#8ab4f8",
      championTextColor: "#8ab4f8",

      roundHeaderTextColor: "#9aa0a6",
      
      matchIndicatorType: "pill",
      matchIndicatorLabel: "VS",
      matchIndicatorColor: "#3c4043",
      matchIndicatorIconColor: "#8ab4f8"
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