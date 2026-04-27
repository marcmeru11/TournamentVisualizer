class Camera {
  #x = 0;
  #y = 0;
  #zoom = 1;
  #minZoom = 0.2;
  #maxZoom = 4;
  #bounds = null;
  #canvasWidth = 0;
  #canvasHeight = 0;

  constructor() {
    this.minZoom = 0.2;
    this.maxZoom = 4;
  }

  get x() { return this.#x; }
  set x(value) {
    this.#x = value;
    this.#clamp();
  }

  get y() { return this.#y; }
  set y(value) {
    this.#y = value;
    this.#clamp();
  }

  get zoom() { return this.#zoom; }
  set zoom(value) {
    this.#zoom = Math.max(this.#minZoom, Math.min(this.#maxZoom, value));
    this.#clamp();
  }

  setBounds(minX, minY, maxX, maxY) {
    this.#bounds = { minX, minY, maxX, maxY };
    this.#clamp();
  }

  setCanvasSize(width, height) {
    this.#canvasWidth = width;
    this.#canvasHeight = height;
    this.#clamp();
  }

  #clamp() {
    if (!this.#bounds || this.#canvasWidth === 0 || this.#canvasHeight === 0) return;

    const marginX = this.#canvasWidth * 0.3;
    const marginY = this.#canvasHeight * 0.3;
    
    const minX = marginX - this.#bounds.maxX * this.#zoom;
    
    const maxX = this.#canvasWidth - marginX - this.#bounds.minX * this.#zoom;

    const minY = marginY - this.#bounds.maxY * this.#zoom;
    const maxY = this.#canvasHeight - marginY - this.#bounds.minY * this.#zoom;

    if (minX > maxX) {
      this.#x = (minX + maxX) / 2;
    } else {
      this.#x = Math.max(minX, Math.min(maxX, this.#x));
    }

    if (minY > maxY) {
      this.#y = (minY + maxY) / 2;
    } else {
      this.#y = Math.max(minY, Math.min(maxY, this.#y));
    }
  }

  apply(ctx) {
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(this.#zoom * dpr, 0, 0, this.#zoom * dpr, this.#x * dpr, this.#y * dpr);
  }

  reset(ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}

export default Camera;
console.log("Camera loaded");
