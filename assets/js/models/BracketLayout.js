import LineShape from "../shapes/line.js";
import RectShape from "../shapes/rect.js";
import TextShape from "../shapes/text.js";

/**
 * BracketLayout.js
 * Logic for calculating positions of tournament elements.
 */
class BracketLayout {
  #theme;

  constructor(theme) {
    this.#theme = theme;
  }

  /**
   * Generates an array of shapes based on tournament data.
   * @param {Tournament} tournament - The tournament model.
   * @param {CanvasRenderingContext2D} ctx - Needed for text measurement.
   */
  generateShapes(tournament, ctx) {
    const shapes = [];
    const { rounds } = tournament;

    if (tournament.isEmpty) return shapes;

    // 1. Calculate per-round widths and X positions
    const roundMetrics = this.#calculateRoundMetrics(rounds, ctx);

    const initialTeams = rounds[0].length;
    const bracketSize = 2 ** Math.ceil(Math.log2(initialTeams));
    const roundCount = rounds.length;

    const { teamYsize, teamSpacingY } = this.#theme;
    const slotHeight = teamYsize + teamSpacingY;

    const getRoundStep = (r) => slotHeight * (2 ** r);

    const getTeamY = (r, index) => {
      const step = getRoundStep(r);
      const totalHeight = bracketSize * slotHeight;
      const usedHeight = (rounds[r].length - 1) * step + teamYsize;
      const topMargin = (totalHeight - usedHeight) / 2;

      return topMargin + index * step;
    };

    for (let r = 0; r < roundCount; r++) {
      const teams = rounds[r];
      const { x, width } = roundMetrics[r];

      for (let t = 0; t < teams.length; t++) {
        const y = getTeamY(r, t);

        // Add Rect
        shapes.push(new RectShape(
          x, 
          y, 
          width, 
          teamYsize, 
          this.#theme.boxFillColor, 
          true, 
          this.#theme.boxStrokeColor, 
          this.#theme.boxLineWidth,
          this.#theme.boxBorderRadius
        ));

        // Add Text
        shapes.push(new TextShape(
          x + width / 2, 
          y + teamYsize / 2, 
          teams[t], 
          this.#theme.textColor, 
          this.#theme.fontFamily, 
          this.#theme.fontSize
        ));

        // Add connecting lines
        if (r < roundCount - 1) {
          const nextMetric = roundMetrics[r + 1];
          const nextY = getTeamY(r + 1, Math.floor(t / 2)) + teamYsize / 2;

          shapes.push(new LineShape(
            x + width, 
            y + teamYsize / 2, 
            nextMetric.x, 
            nextY, 
            this.#theme.lineColor, 
            this.#theme.lineWidth
          ));
        }
      }
    }

    return shapes;
  }

  /**
   * Calculates width and X position for every round.
   */
  #calculateRoundMetrics(rounds, ctx) {
    const metrics = [];
    let currentX = 0;

    if (ctx) {
      ctx.font = `${this.#theme.fontSize}px ${this.#theme.fontFamily}`;
    }

    for (let r = 0; r < rounds.length; r++) {
      let maxTextWidth = this.#theme.minWidth;

      for (const team of rounds[r]) {
        const measuredWidth = ctx ? ctx.measureText(team).width : team.length * 8;
        const requiredWidth = measuredWidth + this.#theme.paddingX;
        if (requiredWidth > maxTextWidth) {
          maxTextWidth = requiredWidth;
        }
      }

      metrics.push({
        x: currentX,
        width: maxTextWidth
      });

      // Accumulate X for next round
      currentX += maxTextWidth + this.#theme.roundSpacingX;
    }

    return metrics;
  }
}

export default BracketLayout;
