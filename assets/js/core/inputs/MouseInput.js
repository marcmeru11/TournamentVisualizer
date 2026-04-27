import BaseInput from './BaseInput.js';

export default class MouseInput extends BaseInput {
  #dragging = false;
  #lastMouseX = 0;
  #lastMouseY = 0;
  #mouseDownX = 0;
  #mouseDownY = 0;

  constructor(canvas, camera, onUpdate, onInput) {
    super(canvas, camera, onUpdate, onInput);
    this.#initEvents();
  }

  #initEvents() {
    this.canvas.addEventListener("mousedown", this.#onMouseDown.bind(this));
    window.addEventListener("mousemove", this.#onMouseMove.bind(this));
    window.addEventListener("mouseup", this.#onMouseUp.bind(this));
    this.canvas.addEventListener("wheel", this.#onWheel.bind(this), { passive: false });
  }

  #onMouseDown(event) {
    this.#dragging = true;
    this.#lastMouseX = event.clientX;
    this.#lastMouseY = event.clientY;
    this.#mouseDownX = event.clientX;
    this.#mouseDownY = event.clientY;
    this.canvas.classList.add("dragging");
  }

  #onMouseMove(event) {
    // Report mouse move for hover effects
    this.triggerInput("hover", event.clientX, event.clientY);

    if (!this.#dragging) return;

    const dx = event.clientX - this.#lastMouseX;
    const dy = event.clientY - this.#lastMouseY;

    this.camera.x += dx;
    this.camera.y += dy;

    this.#lastMouseX = event.clientX;
    this.#lastMouseY = event.clientY;

    this.triggerUpdate();
  }

  #onMouseUp(event) {
    if (this.#dragging) {
      const dist = Math.sqrt(
        Math.pow(event.clientX - this.#mouseDownX, 2) + 
        Math.pow(event.clientY - this.#mouseDownY, 2)
      );

      if (dist < this.clickThreshold) {
        this.triggerInput("click", event.clientX, event.clientY);
      }
    }

    this.#dragging = false;
    this.canvas.classList.remove("dragging");
  }

  #onWheel(event) {
    event.preventDefault();

    const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
    
    // event.offsetX/Y is relative to canvas, convert to clientX/Y roughly or just use getWorldCoords directly.
    // BaseInput's getWorldCoords needs clientX/Y.
    // event.clientX/Y works perfectly on wheel events on canvas.
    const coords = this.getWorldCoords(event.clientX, event.clientY);

    this.camera.zoom *= zoomFactor;

    this.camera.x = coords.canvasX - coords.x * this.camera.zoom;
    this.camera.y = coords.canvasY - coords.y * this.camera.zoom;

    this.triggerUpdate();
  }
}
