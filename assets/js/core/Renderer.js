/**
 * Renderer.js
 * Encapsulates the Canvas 2D context and manages clearing and camera application.
 */
class Renderer {
  #canvas;
  #ctx;
  #camera;
  #backgroundColor;

  constructor(canvas, camera, backgroundColor = null) {
    this.#canvas = canvas;
    this.#ctx = canvas.getContext("2d");
    this.#camera = camera;
    this.#backgroundColor = backgroundColor;
  }

  get ctx() {
    return this.#ctx;
  }

  get canvas() {
    return this.#canvas;
  }

  /**
   * Clears the entire canvas viewport.
   */
  clear() {
    this.#camera.reset(this.#ctx);
    if (this.#backgroundColor && this.#backgroundColor !== "transparent") {
      this.#ctx.fillStyle = this.#backgroundColor;
      this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
    } else {
      this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    }
  }

  /**
   * Prepares the context for drawing by applying camera transformations.
   */
  begin() {
    this.clear();
    this.#camera.apply(this.#ctx);
  }

  /**
   * Prepares the context for drawing fixed UI elements in screen space.
   */
  beginUI() {
    this.#camera.applyUIScale(this.#ctx);
  }

  /**
   * Resets transformations.
   */
  endUI() {
    this.#camera.reset(this.#ctx);
  }

  /**
   * Resizes the canvas and notifies if a re-render might be needed.
   */
  resize(width, height) {
    const dpr = window.devicePixelRatio || 1;
    this.#canvas.width = width * dpr;
    this.#canvas.height = height * dpr;
  }
}

export default Renderer;
