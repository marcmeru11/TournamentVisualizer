import LineShape from "../shapes/line.js";
import RectShape from "../shapes/rect.js";
import TextShape from "../shapes/text.js";
import ImageShape from "../shapes/image.js";
import ImageLoader from "../core/ImageLoader.js";

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
    const lines = [];
    const boxes = [];
    const indicators = []; // Separate list to ensure indicators are drawn on top
    const { rounds } = tournament;

    if (tournament.isEmpty) return [];

    const roundCount = rounds.length;
    const isSplit = this.#theme.layoutType === "split" && roundCount > 1;
    
    // 1. Calculate per-round widths and X positions (base linear metrics)
    const roundMetrics = this.#calculateRoundMetrics(rounds, ctx);

    let initialTeams = 0;
    for (const m of rounds[0].matches) initialTeams += m.teams.length;
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

    const bracketMinY = getTeamY(0, 0, initialTeams);

    for (let r = 0; r < roundCount; r++) {
      const roundData = rounds[r];
      const matches = roundData.matches;
      let itemsInRound = 0;
      for (const m of matches) itemsInRound += m.teams.length;

      // Draw Round Header
      if (roundData.name) {
        const headerY = bracketMinY - this.#theme.roundHeaderMarginBottom;
        
        const drawHeader = (xCenter, url) => {
          if (url && ctx) {
            ctx.font = `${this.#theme.roundHeaderFontSize}px ${this.#theme.fontFamily}`;
            const textWidth = ctx.measureText(roundData.name).width;
            const h = this.#theme.roundHeaderFontSize * 1.5;
            const rect = new RectShape(
              xCenter - textWidth / 2 - 10, headerY - h / 2, textWidth + 20, h,
              "transparent", true, "transparent", 0, 0
            );
            rect.metadata = { url };
            rect.cursor = "pointer";
            boxes.push(rect);
          }
          boxes.push(new TextShape(
            xCenter, headerY, roundData.name, 
            roundData.textColor || this.#theme.roundHeaderTextColor, 
            this.#theme.fontFamily, this.#theme.roundHeaderFontSize
          ));
        };

        const leftX = getX(r, 0, itemsInRound) + roundMetrics[r].width / 2;
        drawHeader(leftX, roundData.url);

        if (isSplit && r < roundCount - 1 && itemsInRound > 1) {
          const rightX = getX(r, itemsInRound - 1, itemsInRound) + roundMetrics[r].width / 2;
          drawHeader(rightX, roundData.url);
        }
      }

      let t = 0;
      for (let mIndex = 0; mIndex < matches.length; mIndex++) {
        const matchData = matches[mIndex];
        const matchUrl = matchData.url || null;

        for (let i = 0; i < matchData.teams.length; i++) {
          const teamData = matchData.teams[i];
          const teamName = typeof teamData === "string" ? teamData : teamData.name;
          const score = teamData.score !== undefined ? teamData.score : null;
          const url = teamData.url || null;
          
          const x = getX(r, t, itemsInRound);
          const y = getTeamY(r, t, itemsInRound);
          
          const width = roundMetrics[r].width;
          const hasScore = score !== null;
          const scoreWidth = hasScore ? this.#theme.scoreBoxWidth : 0;
          const effectiveNameWidth = width - scoreWidth;
          const isRightSide = isSplit && r < roundCount - 1 && t >= itemsInRound / 2;

          // Identify Winner
          const otherIndex = i === 0 ? 1 : 0;
          const otherTeam = matchData.teams[otherIndex];
          
          let isWinner = false;
          if (this.#theme.highlightWinner) {
            if (teamData.isWinner !== undefined) {
              isWinner = teamData.isWinner;
            } else if (teamData.score !== undefined && otherTeam && otherTeam.score !== undefined) {
              isWinner = teamData.score > otherTeam.score;
            }
          }

          // Identify Loser
          const isLoser = otherTeam && (
            (otherTeam.isWinner === true) || 
            (otherTeam.score !== undefined && teamData.score !== undefined && otherTeam.score > teamData.score)
          );

          // Identify Champion
          const isChampion = this.#theme.highlightChampion && 
                             r === roundCount - 1 && 
                             (matches.length === 1 && (matchData.teams.length === 1 || isWinner));

          // Add Main Box
          const hoverGroupId = `team-${r}-${t}`;
          
          // Colors
          let boxColor = this.#theme.boxFillColor;
          let boxStroke = this.#theme.boxStrokeColor;
          let lineWidth = this.#theme.boxLineWidth;

          if (isWinner) {
            boxColor = this.#theme.winnerBoxFillColor || boxColor;
            boxStroke = this.#theme.winnerBoxStrokeColor || boxStroke;
          } else if (isLoser) {
            boxColor = this.#theme.loserBoxFillColor || boxColor;
            boxStroke = this.#theme.loserBoxStrokeColor || boxStroke;
          }

          if (isChampion) {
            boxColor = this.#theme.championBoxFillColor || boxColor;
            boxStroke = this.#theme.championBoxStrokeColor || boxStroke;
            lineWidth = this.#theme.championBoxLineWidth ?? lineWidth;
          }

          const boxHoverColor = (isWinner && this.#theme.winnerBoxHoverFillColor) ? this.#theme.winnerBoxHoverFillColor : this.#theme.boxHoverFillColor;
          const boxHoverStroke = (isWinner && this.#theme.winnerBoxHoverStrokeColor) ? this.#theme.winnerBoxHoverStrokeColor : this.#theme.boxHoverStrokeColor;

          const mainBox = new RectShape(
            x, y, width, teamYsize, boxColor, true, 
            boxStroke, lineWidth, this.#theme.boxBorderRadius
          );
          mainBox.hoverGroupId = hoverGroupId;
          mainBox.hoverColor = boxHoverColor;
          mainBox.hoverStroke = boxHoverStroke;

          if (url) {
            mainBox.metadata = { url };
            mainBox.cursor = "pointer";
          }
          boxes.push(mainBox);

          // Add Score Box (Symmetric)
          if (hasScore) {
            const scoreX = isRightSide ? x : x + effectiveNameWidth;
            const borderRadius = isRightSide 
              ? [this.#theme.boxBorderRadius, 0, 0, this.#theme.boxBorderRadius]
              : [0, this.#theme.boxBorderRadius, this.#theme.boxBorderRadius, 0];

            const scoreBoxColor = (isWinner && this.#theme.winnerScoreBoxFillColor) ? this.#theme.winnerScoreBoxFillColor : this.#theme.scoreBoxFillColor;

            const scoreBoxHoverColor = (isWinner && this.#theme.winnerScoreBoxHoverFillColor) ? this.#theme.winnerScoreBoxHoverFillColor : this.#theme.scoreBoxHoverFillColor;

            const scoreBox = new RectShape(
              scoreX, y, scoreWidth, teamYsize, scoreBoxColor, true,
              boxStroke, this.#theme.boxLineWidth, borderRadius
            );
            scoreBox.hoverGroupId = hoverGroupId;
            scoreBox.hoverColor = scoreBoxHoverColor;
            scoreBox.hoverStroke = this.#theme.boxHoverStrokeColor;

            if (url) {
              scoreBox.metadata = { url };
              scoreBox.cursor = "pointer";
            }
            boxes.push(scoreBox);

            const scoreTextColor = (isWinner && this.#theme.winnerScoreTextColor) ? this.#theme.winnerScoreTextColor : this.#theme.scoreTextColor;

            const scoreTextColorHover = (isWinner && this.#theme.winnerScoreTextColorHover) ? this.#theme.winnerScoreTextColorHover : this.#theme.scoreTextColorHover;

            const scoreText = new TextShape(
              scoreX + scoreWidth / 2, y + teamYsize / 2, score.toString(),
              scoreTextColor, this.#theme.fontFamily, this.#theme.fontSize
            );
            scoreText.hoverGroupId = hoverGroupId;
            scoreText.hoverColor = scoreTextColorHover;
            boxes.push(scoreText);
          }

          // Add Team Logo and Name Text
          const nameX = isRightSide ? x + scoreWidth : x;
          const teamImage = teamData.image ? ImageLoader.get(teamData.image) : null;
          const showLogo = this.#theme.showTeamLogos && teamImage;
          const logoSize = (isChampion && this.#theme.championLogoSize) ? this.#theme.championLogoSize : this.#theme.teamLogoSize;
          const logoMargin = this.#theme.teamLogoMargin;
          const logoSpace = showLogo ? (logoSize + logoMargin) : 0;

          if (showLogo) {
            const logoY = y + (teamYsize - logoSize) / 2;
            let logoX;
            if (this.#theme.teamLogoPosition === "right") {
              logoX = nameX + effectiveNameWidth - logoMargin - logoSize;
            } else {
              logoX = nameX + logoMargin;
            }

            const logoShape = new ImageShape(
              logoX, logoY, logoSize, logoSize, teamImage, {
                clipShape: this.#theme.teamLogoShape,
                borderRadius: this.#theme.teamLogoBorderRadius
              }
            );
            logoShape.hoverGroupId = hoverGroupId;
            if (url) {
              logoShape.metadata = { url };
              logoShape.cursor = "pointer";
            }
            boxes.push(logoShape);
          }

          // Compute text position — shift to make room for the logo
          let textCenterX;
          if (showLogo) {
            if (this.#theme.teamLogoPosition === "right") {
              // Logo on right: text shifts left
              textCenterX = nameX + (effectiveNameWidth - logoSpace) / 2;
            } else {
              // Logo on left: text shifts right
              textCenterX = nameX + logoSpace + (effectiveNameWidth - logoSpace) / 2;
            }
          } else {
            textCenterX = nameX + effectiveNameWidth / 2;
          }

          let nameTextColor = this.#theme.textColor;
          if (isWinner) {
            nameTextColor = this.#theme.winnerTextColor || nameTextColor;
          } else if (isLoser) {
            nameTextColor = this.#theme.loserTextColor || nameTextColor;
          }

          if (isChampion) {
            nameTextColor = this.#theme.championTextColor || nameTextColor;
          }

          const nameTextColorHover = (isWinner && this.#theme.winnerTextColorHover) ? this.#theme.winnerTextColorHover : this.#theme.textColorHover;

          const nameFontSize = (isChampion && this.#theme.championFontSize) ? this.#theme.championFontSize : this.#theme.fontSize;

          const nameText = new TextShape(
            textCenterX, y + teamYsize / 2, teamName,
            nameTextColor, this.#theme.fontFamily, nameFontSize
          );
          nameText.hoverGroupId = hoverGroupId;
          nameText.hoverColor = nameTextColorHover;
          boxes.push(nameText);

          // Add Progress Connectors and Match Link
          if (r < roundCount - 1) {
            const isLastSplitRound = isSplit && r === roundCount - 2;
            const nextMetric = roundMetrics[r + 1];
            
            let nextT = mIndex;
            let nextRoundTotal = 0;
            for (const nextM of rounds[r + 1].matches) nextRoundTotal += nextM.teams.length;
            
            const nextX = getX(r + 1, nextT, nextRoundTotal);
            const nextY = getTeamY(r + 1, nextT, nextRoundTotal) + teamYsize / 2;
            
            const midGap = this.#theme.roundSpacingX / 2;
            const xStart = isRightSide ? x : x + width;
            const xDir = isRightSide ? -1 : 1;
            const xMid = isLastSplitRound ? (isRightSide ? x - (centerGap / 4) : x + width + (centerGap / 4)) : xStart + (midGap * xDir);
            
            const xEnd = isRightSide ? nextX + nextMetric.width : nextX;

            // 1. Determine line style for the team path
            let pathColor = this.#theme.lineColor;
            let pathWidth = this.#theme.lineWidth;

            if (this.#theme.highlightWinnerLines) {
              const isLoser = otherTeam && (
                (otherTeam.isWinner === true) || 
                (otherTeam.score !== undefined && teamData.score !== undefined && otherTeam.score > teamData.score)
              );
              
              if (isWinner) {
                pathColor = this.#theme.winnerLineColor || pathColor;
                pathWidth = this.#theme.winnerLineWidth || pathWidth;
              } else if (isLoser) {
                pathColor = this.#theme.loserLineColor || pathColor;
                pathWidth = this.#theme.loserLineWidth || pathWidth;
              }
            }

            // Indicator line override (only for the horizontal part out of the team box)
            const horizontalPathColor = (matchUrl && this.#theme.matchIndicatorType === "line") 
              ? this.#theme.matchIndicatorColor 
              : pathColor;

            lines.push(new LineShape(xStart, y + teamYsize/2, xMid, y + teamYsize/2, horizontalPathColor, pathWidth));
            lines.push(new LineShape(xMid, y + teamYsize/2, xMid, nextY, pathColor, pathWidth));
            
            // Draw the exit line and indicator only once per match (i === 0)
            if (i === 0) {
              // 2. Determine line style for the exit path (the one leading to the next round)
              let exitLineColor = this.#theme.lineColor;
              let exitLineWidth = this.#theme.lineWidth;
              
              if (this.#theme.highlightWinnerLines) {
                const hasWinner = isWinner || (otherTeam && (
                  otherTeam.isWinner === true || 
                  (otherTeam.score !== undefined && teamData.score !== undefined && otherTeam.score > teamData.score)
                ));
                
                if (hasWinner) {
                  exitLineColor = this.#theme.winnerLineColor || exitLineColor;
                  exitLineWidth = this.#theme.winnerLineWidth || exitLineWidth;
                } else {
                  exitLineColor = this.#theme.loserLineColor || exitLineColor;
                  exitLineWidth = this.#theme.loserLineWidth || exitLineWidth;
                }
              }

              const finalExitColor = (matchUrl && this.#theme.matchIndicatorType === "line") 
                ? this.#theme.matchIndicatorColor 
                : exitLineColor;

              lines.push(new LineShape(xMid, nextY, xEnd, nextY, finalExitColor, exitLineWidth));
              
              if (this.#theme.matchIndicatorType !== "hidden") {
                this.#addMatchIndicator(indicators, xMid, nextY, matchUrl || null);
              }
            }
          }
          t++;
        }
      }
    }
    // 4. Generate Extra Matches if present
    if (tournament.extraMatches.length > 0) {
      // Find the bottom of the main bracket
      let maxY = -Infinity;
      for (const box of boxes) {
        if (typeof box.height === 'number') {
          maxY = Math.max(maxY, box.y + box.height);
        }
      }
      
      const extraShapes = this.#generateExtraMatchesShapes(tournament, ctx, maxY, roundMetrics);
      return [...lines, ...boxes, ...indicators, ...extraShapes];
    }

    return [...lines, ...boxes, ...indicators];
  }

  /**
   * Generates shapes for all extra matches.
   * Positioned below the main bracket.
   */
  #generateExtraMatchesShapes(tournament, ctx, mainBracketMaxY, roundMetrics) {
    let currentMaxY = mainBracketMaxY + this.#theme.extraMatchesMarginTop;
    const allExtraShapes = [];
    
    for (const group of tournament.extraMatches) {
      const groupShapes = this.#generateExtraMatchGroupShapes(group, ctx, currentMaxY, roundMetrics);
      allExtraShapes.push(...groupShapes);
      
      // Update maxY for the next group
      for (const shape of groupShapes) {
        if (typeof shape.height === 'number') {
          currentMaxY = Math.max(currentMaxY, shape.y + shape.height);
        }
      }
      currentMaxY += this.#theme.extraMatchSpacingY;
    }
    
    return allExtraShapes;
  }

  /**
   * Generates shapes for a single extra match group.
   */
  #generateExtraMatchGroupShapes(group, ctx, startY, roundMetrics) {
    const shapes = [];
    const match = group.match;
    if (!match) return [];

    const { 
      teamYsize, teamSpacingY, extraMatchesDefaultLabel,
      roundHeaderFontSize, roundHeaderTextColor, fontFamily, roundHeaderMarginBottom
    } = this.#theme;

    const roundCount = roundMetrics.length;
    // Align with specified round or penultimate round (semifinals) by default
    const targetRoundIdx = group.alignWithRound !== null 
      ? Math.min(group.alignWithRound, roundCount - 1)
      : Math.max(0, roundCount - 2);
    const metric = roundMetrics[targetRoundIdx];
    
    let x;
    const isSplit = this.#theme.layoutType === "split" && roundCount > 1;
    if (isSplit) {
      // Center it below the final
      const wingWidth = roundMetrics[roundCount - 2].x + roundMetrics[roundCount - 2].width;
      x = wingWidth + (this.#theme.centerGap / 2) - (metric.width / 2);
    } else {
      x = metric.x;
    }

    // Header
    const headerY = startY;
    shapes.push(new TextShape(
      x + metric.width / 2, headerY, group.title || extraMatchesDefaultLabel, 
      roundHeaderTextColor, fontFamily, roundHeaderFontSize
    ));

    const matchY = headerY + roundHeaderMarginBottom;

    // Draw the two teams
    for (let i = 0; i < match.teams.length; i++) {
      const teamData = match.teams[i];
      const teamName = teamData.name;
      const score = teamData.score !== undefined ? teamData.score : null;
      const url = teamData.url || null;
      
      const y = matchY + i * (teamYsize + teamSpacingY);
      const width = metric.width;
      const hasScore = score !== null;
      const scoreWidth = hasScore ? this.#theme.scoreBoxWidth : 0;
      const effectiveNameWidth = width - scoreWidth;
      
      // Identify Winner
      const otherIndex = i === 0 ? 1 : 0;
      const otherTeam = match.teams[otherIndex];
      
      let isWinner = false;
      if (this.#theme.highlightWinner) {
        if (teamData.isWinner !== undefined) {
          isWinner = teamData.isWinner;
        } else if (teamData.score !== undefined && otherTeam && otherTeam.score !== undefined) {
          isWinner = teamData.score > otherTeam.score;
        }
      }

      const isLoser = otherTeam && (
        (otherTeam.isWinner === true) || 
        (otherTeam.score !== undefined && teamData.score !== undefined && otherTeam.score > teamData.score)
      );

      const hoverGroupId = `extra-${match.id || 'match'}-${i}`;

      // Colors
      let boxColor = this.#theme.boxFillColor;
      let boxStroke = this.#theme.boxStrokeColor;
      let scoreBoxColor = this.#theme.scoreBoxFillColor;
      let scoreTextColor = this.#theme.scoreTextColor;
      let nameTextColor = this.#theme.textColor;

      if (isWinner) {
        boxColor = this.#theme.winnerBoxFillColor || boxColor;
        boxStroke = this.#theme.winnerBoxStrokeColor || boxStroke;
        scoreBoxColor = this.#theme.winnerScoreBoxFillColor || scoreBoxColor;
        scoreTextColor = this.#theme.winnerScoreTextColor || scoreTextColor;
        nameTextColor = this.#theme.winnerTextColor || nameTextColor;
      } else if (isLoser) {
        boxColor = this.#theme.loserBoxFillColor || boxColor;
        boxStroke = this.#theme.loserBoxStrokeColor || boxStroke;
        nameTextColor = this.#theme.loserTextColor || nameTextColor;
      }

      const boxHoverColor = (isWinner && this.#theme.winnerBoxHoverFillColor) ? this.#theme.winnerBoxHoverFillColor : this.#theme.boxHoverFillColor;
      const boxHoverStroke = (isWinner && this.#theme.winnerBoxHoverStrokeColor) ? this.#theme.winnerBoxHoverStrokeColor : this.#theme.boxHoverStrokeColor;
      const scoreBoxHoverColor = (isWinner && this.#theme.winnerScoreBoxHoverFillColor) ? this.#theme.winnerScoreBoxHoverFillColor : this.#theme.scoreBoxHoverFillColor;
      const scoreTextColorHover = (isWinner && this.#theme.winnerScoreTextColorHover) ? this.#theme.winnerScoreTextColorHover : this.#theme.scoreTextColorHover;
      const nameTextColorHover = (isWinner && this.#theme.winnerTextColorHover) ? this.#theme.winnerTextColorHover : this.#theme.textColorHover;

      // Main Box
      const mainBox = new RectShape(
        x, y, width, teamYsize, boxColor, true, 
        boxStroke, this.#theme.boxLineWidth, this.#theme.boxBorderRadius
      );
      mainBox.hoverGroupId = hoverGroupId;
      mainBox.hoverColor = boxHoverColor;
      mainBox.hoverStroke = boxHoverStroke;
      if (url) {
        mainBox.metadata = { url };
        mainBox.cursor = "pointer";
      }
      shapes.push(mainBox);

      // Score Box
      if (hasScore) {
        const scoreX = x + effectiveNameWidth;
        const scoreBox = new RectShape(
          scoreX, y, scoreWidth, teamYsize, scoreBoxColor, true,
          boxStroke, this.#theme.boxLineWidth, [0, this.#theme.boxBorderRadius, this.#theme.boxBorderRadius, 0]
        );
        scoreBox.hoverGroupId = hoverGroupId;
        scoreBox.hoverColor = scoreBoxHoverColor;
        if (url) {
          scoreBox.metadata = { url };
          scoreBox.cursor = "pointer";
        }
        shapes.push(scoreBox);

        const scoreText = new TextShape(
          scoreX + scoreWidth / 2, y + teamYsize / 2, score.toString(),
          scoreTextColor, fontFamily, this.#theme.fontSize
        );
        scoreText.hoverGroupId = hoverGroupId;
        scoreText.hoverColor = scoreTextColorHover;
        shapes.push(scoreText);
      }

      // Logo
      const teamImage = teamData.image ? ImageLoader.get(teamData.image) : null;
      const showLogo = this.#theme.showTeamLogos && teamImage;
      const logoSize = this.#theme.teamLogoSize;
      const logoMargin = this.#theme.teamLogoMargin;
      const logoSpace = showLogo ? (logoSize + logoMargin) : 0;

      if (showLogo) {
        const logoY = y + (teamYsize - logoSize) / 2;
        const logoX = x + logoMargin;
        const logoShape = new ImageShape(logoX, logoY, logoSize, logoSize, teamImage, {
          clipShape: this.#theme.teamLogoShape,
          borderRadius: this.#theme.teamLogoBorderRadius
        });
        logoShape.hoverGroupId = hoverGroupId;
        if (url) {
          logoShape.metadata = { url };
          logoShape.cursor = "pointer";
        }
        shapes.push(logoShape);
      }

      // Name
      const textCenterX = x + logoSpace + (effectiveNameWidth - logoSpace) / 2;
      const nameText = new TextShape(
        textCenterX, y + teamYsize / 2, teamName,
        nameTextColor, fontFamily, this.#theme.fontSize
      );
      nameText.hoverGroupId = hoverGroupId;
      nameText.hoverColor = nameTextColorHover;
      shapes.push(nameText);
    }

    // Add match indicator
    if (this.#theme.matchIndicatorType !== "hidden") {
      const indicatorX = x + metric.width / 2;
      const indicatorY = matchY + teamYsize + (teamSpacingY / 2);
      this.#addMatchIndicator(shapes, indicatorX, indicatorY, match.url || null);
    }

    return shapes;
  }

  /**
   * Helper to add a match indicator shape based on theme settings.
   */
  #addMatchIndicator(shapes, x, y, url) {
    const { 
      matchIndicatorType, matchIndicatorSize, matchIndicatorColor, 
      matchIndicatorIconColor, matchIndicatorLabel, fontFamily 
    } = this.#theme;

    if (matchIndicatorType === "pill") {
      const h = matchIndicatorSize;
      const w = h * 2; // Pill is typically wider
      const rect = new RectShape(
        x - w / 2, y - h / 2, w, h, 
        matchIndicatorColor, true, matchIndicatorColor, 1, h / 2
      );
      if (url) {
        rect.metadata = { url };
        rect.cursor = "pointer";
      }
      rect.ignoreInBounds = true;
      shapes.push(rect);

      const text = new TextShape(
        x, y, matchIndicatorLabel, 
        matchIndicatorIconColor, fontFamily, Math.floor(h * 0.6)
      );
      text.ignoreInBounds = true;
      shapes.push(text);
    } else if (matchIndicatorType === "circle") {
      const r = matchIndicatorSize / 2;
      const circle = new RectShape(
        x - r, y - r, r * 2, r * 2, 
        matchIndicatorColor, true, matchIndicatorColor, 1, r
      );
      if (url) {
        circle.metadata = { url };
        circle.cursor = "pointer";
      }
      circle.ignoreInBounds = true;
      shapes.push(circle);

      const text = new TextShape(
        x, y, matchIndicatorLabel, 
        matchIndicatorIconColor, fontFamily, Math.floor(matchIndicatorSize * 0.6)
      );
      text.ignoreInBounds = true;
      shapes.push(text);
    } else if (matchIndicatorType === "line") {
      // Invisible hotspot for interaction in line-only mode
      const size = matchIndicatorSize;
      const hotspot = new RectShape(
        x - size / 2, y - size / 2, size, size,
        "transparent", true, "transparent", 0, size / 2
      );
      if (url) {
        hotspot.metadata = { url };
        hotspot.cursor = "pointer";
      }
      hotspot.ignoreInBounds = true;
      shapes.push(hotspot);
    }
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
      const isChampRound = r === rounds.length - 1;
      const currentFontSize = (isChampRound && this.#theme.championFontSize) ? this.#theme.championFontSize : this.#theme.fontSize;
      const currentLogoSize = (isChampRound && this.#theme.championLogoSize) ? this.#theme.championLogoSize : this.#theme.teamLogoSize;
      const currentLogoMargin = (isChampRound && this.#theme.championLogoMargin) ? this.#theme.championLogoMargin : this.#theme.teamLogoMargin;
      const currentPaddingX = (isChampRound && this.#theme.championPaddingX) ? this.#theme.championPaddingX : (this.#theme.teamPaddingX || this.#theme.paddingX);

      let maxTextWidth = this.#theme.minWidth;
      if (isChampRound && this.#theme.championBoxWidth) {
        maxTextWidth = this.#theme.championBoxWidth;
      }

      // Calculate round header text width if present
      const roundData = rounds[r];
      if (roundData.name && ctx) {
        ctx.font = `${this.#theme.roundHeaderFontSize}px ${this.#theme.fontFamily}`;
        const headerWidth = ctx.measureText(roundData.name).width + currentPaddingX;
        if (headerWidth > maxTextWidth) maxTextWidth = headerWidth;
      }

      ctx.font = `${currentFontSize}px ${this.#theme.fontFamily}`;

      // Extra width needed for logo if any team in this round has an image
      const logoExtra = this.#theme.showTeamLogos
        ? (currentLogoSize + currentLogoMargin * 2)
        : 0;

      for (const match of roundData.matches) {
        for (const teamData of match.teams) {
          const teamName = typeof teamData === "string" ? teamData : teamData.name;
          const measuredWidth = ctx ? ctx.measureText(teamName).width : teamName.length * 8;
          let requiredWidth = measuredWidth + currentPaddingX;
          
          // Add logo space if this team has an image
          const hasImage = teamData.image && ImageLoader.get(teamData.image);
          if (hasImage) {
            requiredWidth += logoExtra;
          }

          // Add score width if present
          const finalWidth = teamData.score !== undefined ? requiredWidth + this.#theme.scoreBoxWidth : requiredWidth;

          if (finalWidth > maxTextWidth) {
            maxTextWidth = finalWidth;
          }
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
