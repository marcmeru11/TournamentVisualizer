import BaseInput from './BaseInput.js';

export default class TouchInput extends BaseInput {
  #dragging = false;
  #lastTouchX = 0;
  #lastTouchY = 0;
  #touchDownX = 0;
  #touchDownY = 0;
  #initialPinchDistance = null;

  constructor(canvas, camera, onUpdate, onInput) {
    super(canvas, camera, onUpdate, onInput);
    this.#initEvents();
  }

  #initEvents() {
    this.canvas.addEventListener("touchstart", this.#onTouchStart.bind(this), { passive: false });
    window.addEventListener("touchmove", this.#onTouchMove.bind(this), { passive: false });
    window.addEventListener("touchend", this.#onTouchEnd.bind(this));
    window.addEventListener("touchcancel", this.#onTouchEnd.bind(this));
  }

  #getPinchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  #getPinchCenter(touches) {
    return {
      clientX: (touches[0].clientX + touches[1].clientX) / 2,
      clientY: (touches[0].clientY + touches[1].clientY) / 2
    };
  }

  #onTouchStart(event) {
    if (event.touches.length === 1) {
      this.#dragging = true;
      this.#lastTouchX = event.touches[0].clientX;
      this.#lastTouchY = event.touches[0].clientY;
      this.#touchDownX = event.touches[0].clientX;
      this.#touchDownY = event.touches[0].clientY;
      this.canvas.classList.add("dragging");
    } else if (event.touches.length === 2) {
      this.#dragging = false; // Stop panning
      this.#initialPinchDistance = this.#getPinchDistance(event.touches);
    }
  }

  #onTouchMove(event) {
    if (!this.#dragging && this.#initialPinchDistance === null) return;
    
    // Prevent default scrolling/zooming while interacting with the canvas
    if (event.cancelable) {
      event.preventDefault();
    }

    if (this.#dragging && event.touches.length === 1) {
      const dx = event.touches[0].clientX - this.#lastTouchX;
      const dy = event.touches[0].clientY - this.#lastTouchY;

      this.camera.x += dx;
      this.camera.y += dy;

      this.#lastTouchX = event.touches[0].clientX;
      this.#lastTouchY = event.touches[0].clientY;

      this.triggerUpdate();
    } else if (event.touches.length === 2 && this.#initialPinchDistance !== null) {
      const newDistance = this.#getPinchDistance(event.touches);
      const zoomFactor = newDistance / this.#initialPinchDistance;
      
      const center = this.#getPinchCenter(event.touches);
      const coords = this.getWorldCoords(center.clientX, center.clientY);

      this.camera.zoom *= zoomFactor;

      this.camera.x = coords.canvasX - coords.x * this.camera.zoom;
      this.camera.y = coords.canvasY - coords.y * this.camera.zoom;

      this.#initialPinchDistance = newDistance; // Update for next move

      this.triggerUpdate();
    }
  }

  #onTouchEnd(event) {
    if (event.touches.length < 2) {
      this.#initialPinchDistance = null;
    }

    if (event.touches.length === 1) {
      // User lifted one finger from a pinch, revert to panning
      this.#dragging = true;
      this.#lastTouchX = event.touches[0].clientX;
      this.#lastTouchY = event.touches[0].clientY;
    } else if (event.touches.length === 0) {
      if (this.#dragging) {
        // Evaluate tap
        const touch = event.changedTouches[0];
        const dist = Math.sqrt(
          Math.pow(touch.clientX - this.#touchDownX, 2) + 
          Math.pow(touch.clientY - this.#touchDownY, 2)
        );

        if (dist < this.clickThreshold) {
          this.triggerInput("click", touch.clientX, touch.clientY);
        }
      }

      this.#dragging = false;
      this.canvas.classList.remove("dragging");
    }
  }
}
