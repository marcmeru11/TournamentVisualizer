import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TouchInput from '../../../assets/js/core/inputs/TouchInput.js';
import Camera from '../../../assets/js/core/Camera.js';

describe('TouchInput', () => {
  let canvas;
  let camera;
  let onUpdate;
  let onInput;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.getBoundingClientRect = vi.fn(() => ({
      left: 10,
      top: 10,
      width: 500,
      height: 500
    }));
    document.body.appendChild(canvas);
    camera = new Camera();
    onUpdate = vi.fn();
    onInput = vi.fn();
  });

  afterEach(() => {
    document.body.removeChild(canvas);
  });

  const createTouchEvent = (type, touches, changedTouches = touches) => {
    const event = new Event(type, { cancelable: true });
    event.touches = touches;
    event.changedTouches = changedTouches;
    event.preventDefault = vi.fn();
    return event;
  };

  it('should initialize and attach touch events', () => {
    const touchInput = new TouchInput(canvas, camera, onUpdate, onInput);
    expect(touchInput).toBeDefined();
  });

  it('should handle single touch drag for panning', () => {
    new TouchInput(canvas, camera, onUpdate, onInput);
    
    // touchstart
    canvas.dispatchEvent(createTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }]));
    expect(canvas.classList.contains('dragging')).toBe(true);

    // touchmove
    window.dispatchEvent(createTouchEvent('touchmove', [{ clientX: 150, clientY: 120 }]));
    expect(camera.x).toBe(50);
    expect(camera.y).toBe(20);
    expect(onUpdate).toHaveBeenCalled();

    // touchend
    window.dispatchEvent(createTouchEvent('touchend', [], [{ clientX: 150, clientY: 120 }]));
    expect(canvas.classList.contains('dragging')).toBe(false);
  });

  it('should detect single touch taps (clicks)', () => {
    new TouchInput(canvas, camera, onUpdate, onInput);
    
    canvas.dispatchEvent(createTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }]));
    
    // Minimal movement within clickThreshold
    window.dispatchEvent(createTouchEvent('touchend', [], [{ clientX: 102, clientY: 102 }]));
    
    expect(onInput).toHaveBeenCalledWith(expect.objectContaining({ type: 'click' }));
  });

  it('should not fire click if dragged beyond threshold', () => {
    new TouchInput(canvas, camera, onUpdate, onInput);
    
    canvas.dispatchEvent(createTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }]));
    
    window.dispatchEvent(createTouchEvent('touchend', [], [{ clientX: 200, clientY: 200 }])); 
    
    expect(onInput).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'click' }));
  });

  it('should handle multi-touch pinch-to-zoom', () => {
    new TouchInput(canvas, camera, onUpdate, onInput);
    const initialZoom = camera.zoom;
    
    // 2 fingers down
    canvas.dispatchEvent(createTouchEvent('touchstart', [
      { clientX: 100, clientY: 100 },
      { clientX: 200, clientY: 100 }
    ]));
    
    expect(canvas.classList.contains('dragging')).toBe(false);

    // fingers move apart (zoom in)
    window.dispatchEvent(createTouchEvent('touchmove', [
      { clientX: 50, clientY: 100 },
      { clientX: 250, clientY: 100 }
    ]));
    
    expect(camera.zoom).toBe(initialZoom * 2);
    expect(onUpdate).toHaveBeenCalled();

    // one finger lifts, reverting to panning state
    window.dispatchEvent(createTouchEvent('touchend', [
      { clientX: 250, clientY: 100 }
    ]));
    
    // Simulate panning with the remaining finger
    const prevX = camera.x;
    window.dispatchEvent(createTouchEvent('touchmove', [
      { clientX: 260, clientY: 100 }
    ]));
    expect(camera.x).toBe(prevX + 10);
  });

  it('should call preventDefault on touchmove when interacting', () => {
    new TouchInput(canvas, camera, onUpdate, onInput);
    
    canvas.dispatchEvent(createTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }]));
    
    const moveEvent = createTouchEvent('touchmove', [{ clientX: 150, clientY: 120 }]);
    window.dispatchEvent(moveEvent);
    
    expect(moveEvent.preventDefault).toHaveBeenCalled();
  });
});
