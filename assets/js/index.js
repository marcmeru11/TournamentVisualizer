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
    this.#canvas = typeof canvasElement === "string" 
      ? document.getElementById(canvasElement) 
      : canvasElement;

    if (!this.#canvas) {
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

    this.resize();
  }

  /**
   * Updates the tournament data and regenerates the layout.
   * @param {Array<Array<string>>} rounds - The tournament rounds and teams.
   */
  setData(rounds) {
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
    this.#renderer.begin();
    for (const shape of this.#sceneShapes) {
      shape.draw(this.#renderer.ctx, this.#camera);
    }
  }

  /**
   * Resizes the canvas to match its container or window.
   */
  resize() {
    this.#renderer.resize(window.innerWidth, window.innerHeight);
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
    this.render();
  }
}

export default TournamentBracket;
