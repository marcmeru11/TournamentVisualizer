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
  this.render();
  }

  #onInputUpdate(event) {
    if (event && event.type === "resize") {
      this.resize(this.#canvas.clientWidth, this.#canvas.clientHeight);
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

  /**
   * Centers the camera on the current bracket.
   */
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

    // Center the bracket in the canvas
    this.#camera.x = (canvasWidth - bracketWidth) / 2 - minX;
    this.#camera.y = (canvasHeight - bracketHeight) / 2 - minY;
    this.#camera.zoom = Math.min(
        (canvasWidth * 0.8) / bracketWidth,
        (canvasHeight * 0.8) / bracketHeight,
        1
    );
    
    console.log("TournamentBracket: Camera centered at", this.#camera.x, this.#camera.y, "zoom", this.#camera.zoom);
  }
}

export default TournamentBracket;
