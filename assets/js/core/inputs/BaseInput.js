export default class BaseInput {
  constructor(canvas, camera, onUpdate, onInput) {
    this.canvas = canvas;
    this.camera = camera;
    this.onUpdate = onUpdate;
    this.onInput = onInput;
    this.clickThreshold = 5;
  }

  getWorldCoords(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const canvasX = clientX - rect.left;
    const canvasY = clientY - rect.top;
    
    return {
      x: (canvasX - this.camera.x) / this.camera.zoom,
      y: (canvasY - this.camera.y) / this.camera.zoom,
      canvasX,
      canvasY
    };
  }

  triggerUpdate() {
    if (this.onUpdate) this.onUpdate();
  }

  triggerInput(type, clientX, clientY) {
    if (this.onInput) {
      const coords = this.getWorldCoords(clientX, clientY);
      this.onInput({ type, x: coords.x, y: coords.y });
    }
  }
}
