import MouseInput from './inputs/MouseInput.js';
import TouchInput from './inputs/TouchInput.js';

/**
 * InputManager.js
 * Facade that initializes concrete input handlers (Mouse and Touch).
 */
class InputManager {
  constructor(canvas, camera, onUpdate, onInput) {
    this.mouseInput = new MouseInput(canvas, camera, onUpdate, onInput);
    this.touchInput = new TouchInput(canvas, camera, onUpdate, onInput);

    window.addEventListener("resize", () => {
      if (onUpdate) onUpdate({ type: "resize" });
    });
  }
}

export default InputManager;
