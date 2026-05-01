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

    // Create a container to host the canvas and any UI elements (like buttons)
    // This ensures absolute-positioned UI elements stay relative to the bracket.
    this.#container = document.createElement("div");
    this.#container.className = "tournament-bracket-container";
    Object.assign(this.#container.style, {
      position: "relative",
      width: "fit-content",
      height: "fit-content"
    });

    // Inherit the canvas's display property to maintain layout integrity
    const canvasDisplay = window.getComputedStyle(this.#canvas).display;
    this.#container.style.display = (canvasDisplay === "inline" || canvasDisplay === "inline-block") 
      ? "inline-block" 
      : "block";

    if (this.#canvas.parentElement) {
      this.#canvas.parentElement.insertBefore(this.#container, this.#canvas);
    }
    this.#container.appendChild(this.#canvas);

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
      if (shape && shape.cursor) {
        this.#canvas.style.cursor = shape.cursor;
      } else {
        this.#canvas.style.cursor = "default";
      }

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
      if (shape && shape.metadata && shape.metadata.url) {
        console.log("TournamentBracket: Opening URL", shape.metadata.url);
        window.open(shape.metadata.url, "_blank");
      }
    }
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
    this.#centerButton = document.createElement("button");
    this.#centerButton.innerText = this.#theme.centerButtonText;
    this.#centerButton.id = "tournament-center-btn";
    
    // Apply styles
    Object.assign(this.#centerButton.style, {
      position: "absolute",
      bottom: "20px",
      right: "20px",
      zIndex: "10",
      ...this.#theme.centerButtonStyle
    });

    // Hover effect
    this.#centerButton.onmouseover = () => {
      this.#centerButton.style.opacity = "0.9";
      this.#centerButton.style.transform = "scale(1.05)";
    };
    this.#centerButton.onmouseout = () => {
      this.#centerButton.style.opacity = "1";
      this.#centerButton.style.transform = "scale(1)";
    };

    this.#centerButton.onclick = () => {
      this.centerCamera();
      this.render();
    };

    // Append to our internal container
    this.#container.appendChild(this.#centerButton);
  }
}

export default TournamentBracket;
