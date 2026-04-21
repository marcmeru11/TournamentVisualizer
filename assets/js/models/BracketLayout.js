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

    const roundCount = rounds.length;
    const isSplit = this.#theme.layoutType === "split" && roundCount > 1;
    
    // 1. Calculate per-round widths and X positions (base linear metrics)
    const roundMetrics = this.#calculateRoundMetrics(rounds, ctx);

    const initialTeams = rounds[0].length;
    const bracketSize = 2 ** Math.ceil(Math.log2(initialTeams));
    const { teamYsize, teamSpacingY, centerGap } = this.#theme;
    const slotHeight = teamYsize + teamSpacingY;

    // Helper to get side-aware X coordinate
    const getX = (r, t, totalInRound) => {
      const metric = roundMetrics[r];
      if (!isSplit || r === roundCount - 1) {
        // Center final or single layout
        if (isSplit && r === roundCount - 1) {
          const wingWidth = roundMetrics[roundCount - 2].x + roundMetrics[roundCount - 2].width;
          return wingWidth + (centerGap / 2) - (metric.width / 2);
        }
        return metric.x;
      }
      
      const isRightSide = t >= totalInRound / 2;
      if (isRightSide) {
        const wingWidth = roundMetrics[roundCount - 2].x + roundMetrics[roundCount - 2].width;
        const totalSplitWidth = (wingWidth * 2) + centerGap;
        return totalSplitWidth - metric.x - metric.width;
      }
      return metric.x;
    };

    const getRoundStep = (r) => slotHeight * (2 ** r);

    const getTeamY = (r, index, totalInRound) => {
      let effectiveIndex = index;
      let effectiveBracketSize = bracketSize;
      
      if (isSplit && r < roundCount - 1) {
        const sideSize = totalInRound / 2;
        effectiveIndex = index % sideSize;
        effectiveBracketSize = bracketSize / 2;
      }

      const step = getRoundStep(r);
      const totalHeight = effectiveBracketSize * slotHeight;
      const usedHeight = ( (isSplit && r < roundCount - 1 ? (totalInRound / 2) : totalInRound) - 1) * step + teamYsize;
      const topMargin = (totalHeight - usedHeight) / 2;

      return topMargin + effectiveIndex * step;
    };

    for (let r = 0; r < roundCount; r++) {
      const teams = rounds[r];
      const itemsInRound = teams.length;

      for (let t = 0; t < itemsInRound; t++) {
        const teamData = teams[t];
        const teamName = typeof teamData === "string" ? teamData : teamData.name;
        const score = teamData.score !== undefined ? teamData.score : null;
        
        const x = getX(r, t, itemsInRound);
        const y = getTeamY(r, t, itemsInRound);
        
        const width = roundMetrics[r].width;
        const hasScore = score !== null;
        const scoreWidth = hasScore ? this.#theme.scoreBoxWidth : 0;
        const effectiveNameWidth = width - scoreWidth;
        const isRightSide = isSplit && r < roundCount - 1 && t >= itemsInRound / 2;

        // Add Main Box
        shapes.push(new RectShape(
          x, y, width, teamYsize, this.#theme.boxFillColor, true, 
          this.#theme.boxStrokeColor, this.#theme.boxLineWidth, this.#theme.boxBorderRadius
        ));

        // Add Score Box (Symmetric)
        if (hasScore) {
          const scoreX = isRightSide ? x : x + effectiveNameWidth;
          const borderRadius = isRightSide 
            ? [this.#theme.boxBorderRadius, 0, 0, this.#theme.boxBorderRadius]
            : [0, this.#theme.boxBorderRadius, this.#theme.boxBorderRadius, 0];

          shapes.push(new RectShape(
            scoreX, y, scoreWidth, teamYsize, this.#theme.scoreBoxFillColor, true,
            this.#theme.boxStrokeColor, this.#theme.boxLineWidth, borderRadius
          ));

          shapes.push(new TextShape(
            scoreX + scoreWidth / 2, y + teamYsize / 2, score.toString(),
            this.#theme.scoreTextColor, this.#theme.fontFamily, this.#theme.fontSize
          ));
        }

        // Add Team Name Text
        const nameX = isRightSide ? x + scoreWidth : x;
        shapes.push(new TextShape(
          nameX + effectiveNameWidth / 2, y + teamYsize / 2, teamName,
          this.#theme.textColor, this.#theme.fontFamily, this.#theme.fontSize
        ));

        // Add Progress Connectors
        if (r < roundCount - 1) {
          const isLastSplitRound = isSplit && r === roundCount - 2;
          const nextMetric = roundMetrics[r + 1];
          
          let nextT = Math.floor(t / 2);
          let nextRoundTotal = rounds[r + 1].length;
          const nextX = getX(r + 1, nextT, nextRoundTotal);
          const nextY = getTeamY(r + 1, nextT, nextRoundTotal) + teamYsize / 2;
          
          const midGap = this.#theme.roundSpacingX / 2;
          const xStart = isRightSide ? x : x + width;
          const xDir = isRightSide ? -1 : 1;
          const xMid = isLastSplitRound ? (isRightSide ? x - (centerGap / 4) : x + width + (centerGap / 4)) : xStart + (midGap * xDir);
          
          const xEnd = isRightSide ? nextX + nextMetric.width : nextX;

          // Orthogonal path
          shapes.push(new LineShape(xStart, y + teamYsize/2, xMid, y + teamYsize/2, this.#theme.lineColor, this.#theme.lineWidth));
          shapes.push(new LineShape(xMid, y + teamYsize/2, xMid, nextY, this.#theme.lineColor, this.#theme.lineWidth));
          shapes.push(new LineShape(xMid, nextY, xEnd, nextY, this.#theme.lineColor, this.#theme.lineWidth));
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

      for (const teamData of rounds[r]) {
        const teamName = typeof teamData === "string" ? teamData : teamData.name;
        const measuredWidth = ctx ? ctx.measureText(teamName).width : teamName.length * 8;
        const requiredWidth = measuredWidth + this.#theme.paddingX;
        
        // Add score width if present
        const finalWidth = teamData.score !== undefined ? requiredWidth + this.#theme.scoreBoxWidth : requiredWidth;

        if (finalWidth > maxTextWidth) {
          maxTextWidth = finalWidth;
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
