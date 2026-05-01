import Camera from "./core/Camera.js";
import Renderer from "./core/Renderer.js";
import InputManager from "./core/InputManager.js";
import ImageLoader from "./core/ImageLoader.js";
import Tournament from "./models/Tournament.js";
import BracketLayout from "./models/BracketLayout.js";
import TournamentTheme from "./models/TournamentTheme.js";

/**
 * TournamentBracket
 * A standalone module for rendering tournament brackets on a canvas.
 * This class acts as a Facade, hiding the internal complexity.
 */
class TournamentBracket {
  #canvas;
  #camera;
  #renderer;
  #tournament;
  #layout;
  #input;
  #theme;
  #container;
  #sceneShapes = [];
  #centerButton = null;
  #hoveredGroupId = null;

  /**
   * @param {HTMLCanvasElement|string} canvasElement - The canvas element or its ID.
   * @param {TournamentTheme|Object} themeOrOptions - A theme instance or configuration object.
   */
  constructor(canvasElement, themeOrOptions = {}) {
    console.log("TournamentBracket: Initializing...", canvasElement);
    this.#canvas = typeof canvasElement === "string" 
      ? document.getElementById(canvasElement) 
      : canvasElement;

    if (!this.#canvas) {
      console.error("TournamentBracket: Canvas element not found!");
      throw new Error("TournamentBracket: Valid canvas element or ID required.");
    }

    // Ensure we have a TournamentTheme instance
    this.#theme = themeOrOptions instanceof TournamentTheme 
      ? themeOrOptions 
      : new TournamentTheme(themeOrOptions);

    // We no longer need a container as the button is drawn directly on the canvas.
    this.#camera = new Camera();
    this.#renderer = new Renderer(this.#canvas, this.#camera, this.#theme.backgroundColor);
    this.#tournament = new Tournament();
    this.#layout = new BracketLayout(this.#theme);
    
    this.#input = new InputManager(
      this.#canvas, 
      this.#camera, 
      this.#onInputUpdate.bind(this),
      this.#onInteraction.bind(this)
    );
    
    if (this.#theme.showCenterButton) {
      this.#initUI();
    }

    this.resize();
  }

  /**
   * Updates the tournament data and regenerates the layout.
   * Loads team logo images asynchronously — renders immediately, then
   * re-renders once all images are available.
   * @param {Object|Array} data - Tournament data (new object format or legacy array).
   * @returns {Promise<void>}
   */
  async setData(data) {
    console.log("TournamentBracket: Setting data...", data);
    this.#tournament = new Tournament(data);

    // Collect image URLs from teams dictionary
    const imageUrls = [];
    if (data && data.teams) {
      for (const team of Object.values(data.teams)) {
        if (team.image) imageUrls.push(team.image);
      }
    }

    // Render immediately (without logos on first pass)
    this.#updateScene();

    // Preload images and re-render with logos
    if (imageUrls.length > 0) {
      await ImageLoader.loadAll(imageUrls);
      this.#updateScene();
    }
  }

  /**
   * Triggers a manual re-render of the current scene.
   */
  render() {
    this.#renderer.begin();
    for (const shape of this.#sceneShapes) {
      shape.draw(this.#renderer.ctx, this.#camera);
    }

    if (this.#theme.showCenterButton) {
      this.#drawUI();
    }
  }

  /**
   * Resizes canvas to match specified dimensions, its container, or window.
   */
  resize() {
    const width = this.#canvas.clientWidth;
    const height = this.#canvas.clientHeight;

    this.#renderer.resize(width, height);
    this.#camera.setCanvasSize(width, height);
    this.centerCamera();
    this.render();
  }

  #onInputUpdate(event) {
    if (event && event.type === "resize") {
      this.resize();
    } else {
      this.render();
    }
  }

  #onInteraction(event) {
    const shape = this.#findShapeAt(event.x, event.y);
    
    if (event.type === "hover") {
      // Handle hover groups
      const groupId = shape ? shape.hoverGroupId : null;
      if (groupId !== this.#hoveredGroupId) {
        this.#hoveredGroupId = groupId;
        
        let needsRender = false;
        for (const s of this.#sceneShapes) {
          if (s.hoverGroupId) {
            const isHovered = (s.hoverGroupId === groupId);
            if (s.isHovered !== isHovered) {
              s.isHovered = isHovered;
              needsRender = true;
            }
          }
        }
        if (needsRender) {
          this.render();
        }
      }
    } else if (event.type === "click") {
      if (this.#isPointInButton(event.canvasX, event.canvasY)) {
        this.centerCamera();
        this.render();
        return;
      }

      if (shape && shape.metadata && shape.metadata.url) {
        console.log("TournamentBracket: Opening URL", shape.metadata.url);
        window.open(shape.metadata.url, "_blank");
      }
    }

    // Determine final cursor
    let finalCursor = shape && shape.cursor ? shape.cursor : "default";

    // Handle button hover separately as it's in screen space
    if (this.#theme.showCenterButton) {
      const isOverButton = this.#isPointInButton(event.canvasX, event.canvasY);
      
      if (this.#centerButton && this.#centerButton.isHovered !== isOverButton) {
        this.#centerButton.isHovered = isOverButton;
        this.render();
      }

      if (isOverButton) {
        finalCursor = "pointer";
      }
    }

    this.#canvas.style.cursor = finalCursor;
  }

  #findShapeAt(x, y) {
    for (let i = this.#sceneShapes.length - 1; i >= 0; i--) {
      const shape = this.#sceneShapes[i];
      if (shape.isPointInside && shape.isPointInside(x, y)) {
        return shape;
      }
    }
    return null;
  }

  #updateScene() {
    this.#sceneShapes = this.#layout.generateShapes(this.#tournament, this.#renderer.ctx);
    console.log("TournamentBracket: Scene updated with", this.#sceneShapes.length, "shapes");
    this.centerCamera();
    this.render();
  }

  centerCamera() {
    if (this.#sceneShapes.length === 0) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const shape of this.#sceneShapes) {
      if (shape.ignoreInBounds) continue;
      if (shape.x !== undefined) {
        minX = Math.min(minX, shape.x);
        minY = Math.min(minY, shape.y);
        maxX = Math.max(maxX, shape.x + (shape.width || 0));
        maxY = Math.max(maxY, shape.y + (shape.height || 0));
      }
    }

    const bracketWidth = maxX - minX;
    const bracketHeight = maxY - minY;
    
    const canvasWidth = this.#canvas.clientWidth;
    const canvasHeight = this.#canvas.clientHeight;

    // Update camera limits
    this.#camera.setBounds(minX, minY, maxX, maxY);

    // Calculate optimal zoom to fit the bracket with a margin
    const padding = 0.8; // 80% of the screen
    this.#camera.zoom = Math.min(
        (canvasWidth * padding) / bracketWidth,
        (canvasHeight * padding) / bracketHeight,
        1 // Don't zoom in more than 100%
    );

    // Center the bracket in the canvas, accounting for current zoom
    this.#camera.x = (canvasWidth - bracketWidth * this.#camera.zoom) / 2 - minX * this.#camera.zoom;
    this.#camera.y = (canvasHeight - bracketHeight * this.#camera.zoom) / 2 - minY * this.#camera.zoom;
    
    console.log("TournamentBracket: Camera adapted to fit", bracketWidth, "x", bracketHeight, "at zoom", this.#camera.zoom);
  }

  #initUI() {
    // Initialize button metadata (position and size will be calculated during draw)
    this.#centerButton = {
      isHovered: false,
      rect: { x: 0, y: 0, width: 0, height: 0 }
    };
  }

  #drawUI() {
    const ctx = this.#renderer.ctx;
    const style = this.#theme.centerButtonStyle;
    const paddingX = parseInt(style.padding?.split(" ")[1]) || 16;
    const paddingY = parseInt(style.padding?.split(" ")[0]) || 8;
    
    this.#renderer.beginUI();

    ctx.font = `${style.fontWeight || "500"} ${style.fontSize || "14px"} ${this.#theme.fontFamily}`;
    const textMetrics = ctx.measureText(this.#theme.centerButtonText);
    const textWidth = textMetrics.width;
    const textHeight = parseInt(style.fontSize) || 14;

    const btnWidth = textWidth + paddingX * 2;
    const btnHeight = textHeight + paddingY * 2;
    
    // Position: Bottom Right with 20px margin
    const margin = 20;
    const x = this.#canvas.clientWidth - btnWidth - margin;
    const y = this.#canvas.clientHeight - btnHeight - margin;

    // Update button rect for interaction detection
    this.#centerButton.rect = { x, y, width: btnWidth, height: btnHeight };

    // Draw shadow if any (simplified)
    if (style.boxShadow && style.boxShadow !== "none") {
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;
    }

    // Draw background
    ctx.fillStyle = this.#centerButton.isHovered ? "#334155" : (style.backgroundColor || "#1e293b");
    if (this.#centerButton.isHovered) {
        ctx.save();
        ctx.translate(x + btnWidth / 2, y + btnHeight / 2);
        ctx.scale(1.05, 1.05);
        ctx.translate(-(x + btnWidth / 2), -(y + btnHeight / 2));
    }

    const radius = parseInt(style.borderRadius) || 8;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x, y, btnWidth, btnHeight, radius);
    } else {
      ctx.rect(x, y, btnWidth, btnHeight);
    }
    ctx.fill();

    // Draw border
    if (style.border && style.border !== "none") {
      ctx.strokeStyle = style.border.split(" ").pop() || "#38bdf8";
      ctx.lineWidth = parseInt(style.border.split(" ")[0]) || 1;
      ctx.stroke();
    }

    // Draw text
    ctx.fillStyle = style.color || "#f8fafc";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.#theme.centerButtonText, x + btnWidth / 2, y + btnHeight / 2);

    if (this.#centerButton.isHovered) {
        ctx.restore();
    }

    // Reset shadow
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    this.#renderer.endUI();
  }

  #isPointInButton(canvasX, canvasY) {
    if (!this.#theme.showCenterButton || !this.#centerButton) return false;
    const { x, y, width, height } = this.#centerButton.rect;
    return canvasX >= x && canvasX <= x + width && canvasY >= y && canvasY <= y + height;
  }
}

export default TournamentBracket;
