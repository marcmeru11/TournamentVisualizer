/**
 * InputManager.js
 * Centralizes DOM events and updates camera/state.
 */
class InputManager {
  #canvas;
  #camera;
  #onUpdate;
  #dragging = false;
  #lastMouseX = 0;
  #lastMouseY = 0;

  constructor(canvas, camera, onUpdate) {
    this.#canvas = canvas;
    this.#camera = camera;
    this.#onUpdate = onUpdate;

    this.#initEvents();
  }

  #initEvents() {
    this.#canvas.addEventListener("mousedown", this.#onMouseDown.bind(this));
    window.addEventListener("mousemove", this.#onMouseMove.bind(this));
    window.addEventListener("mouseup", this.#onMouseUp.bind(this));
    this.#canvas.addEventListener("wheel", this.#onWheel.bind(this), { passive: false });
    window.addEventListener("resize", this.#onResize.bind(this));
  }

  #onMouseDown(event) {
    this.#dragging = true;
    this.#lastMouseX = event.clientX;
    this.#lastMouseY = event.clientY;
    this.#canvas.classList.add("dragging");
  }

  #onMouseMove(event) {
    if (!this.#dragging) return;

    const dx = event.clientX - this.#lastMouseX;
    const dy = event.clientY - this.#lastMouseY;

    this.#camera.x += dx;
    this.#camera.y += dy;

    this.#lastMouseX = event.clientX;
    this.#lastMouseY = event.clientY;

    if (this.#onUpdate) this.#onUpdate();
  }

  #onMouseUp() {
    this.#dragging = false;
    this.#canvas.classList.remove("dragging");
  }

  #onWheel(event) {
    event.preventDefault();

    const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    const worldX = (mouseX - this.#camera.x) / this.#camera.zoom;
    const worldY = (mouseY - this.#camera.y) / this.#camera.zoom;

    this.#camera.zoom *= zoomFactor;

    this.#camera.x = mouseX - worldX * this.#camera.zoom;
    this.#camera.y = mouseY - worldY * this.#camera.zoom;

    if (this.#onUpdate) this.#onUpdate();
  }

  #onResize() {
    if (this.#onUpdate) this.#onUpdate({ type: "resize" });
  }
}

export default InputManager;
