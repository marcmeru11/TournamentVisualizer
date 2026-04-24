import Camera from "./core/Camera.js";
import Renderer from "./core/Renderer.js";
import InputManager from "./core/InputManager.js";
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
  #sceneShapes = [];

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

    this.#camera = new Camera();
    this.#renderer = new Renderer(this.#canvas, this.#camera, this.#theme.backgroundColor);
    this.#tournament = new Tournament();
    this.#layout = new BracketLayout(this.#theme);
    
    this.#input = new InputManager(
      this.#canvas, 
      this.#camera, 
      this.#onInputUpdate.bind(this)
    );

    this.resize(this.#canvas.clientWidth, this.#canvas.clientHeight);
  }

  /**
   * Updates the tournament data and regenerates the layout.
   * @param {Array<Array<string>>} rounds - The tournament rounds and teams.
   */
  setData(rounds) {
    console.log("TournamentBracket: Setting data...", rounds);
    this.#tournament.clear();
    for (const teams of rounds) {
      this.#tournament.addRound(teams);
    }
    this.#updateScene();
  }

  /**
   * Triggers a manual re-render of the current scene.
   */
  render() {
    console.log("TournamentBracket: Rendering...", this.#sceneShapes.length, "shapes");
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
      if (shape.x !== undefined) {
        minX = Math.min(minX, shape.x);
        minY = Math.min(minY, shape.y);
        maxX = Math.max(maxX, shape.x + (shape.width || 0));
        maxY = Math.max(maxY, shape.y + (shape.height || 0));
      }
    }

    const bracketWidth = maxX - minX;
    const bracketHeight = maxY - minY;
    
    const canvasWidth = this.#canvas.width;
    const canvasHeight = this.#canvas.height;

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

}

export default TournamentBracket;
