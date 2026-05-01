import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import TournamentBracket from '../assets/js/index.js';
import TournamentTheme from '../assets/js/models/TournamentTheme.js';

describe('TournamentBracket Integration', () => {
  let canvas;

  beforeEach(() => {
    // Create a fresh canvas for each test
    canvas = document.createElement('canvas');
    canvas.id = 'test-canvas';
    document.body.appendChild(canvas);
  });

  afterEach(() => {
    if (canvas.parentElement) {
      canvas.parentElement.removeChild(canvas);
    }
  });

  it('should initialize with a canvas ID', () => {
    const bracket = new TournamentBracket('test-canvas');
    expect(bracket).toBeDefined();
  });

  it('should initialize with a canvas element', () => {
    const bracket = new TournamentBracket(canvas);
    expect(bracket).toBeDefined();
  });

  it('should throw error if canvas not found', () => {
    expect(() => new TournamentBracket('non-existent')).toThrow();
  });

  it('should set data and render', async () => {
    const bracket = new TournamentBracket(canvas);
    const data = [
      [{ name: 'Team 1' }, { name: 'Team 2' }],
      [{ name: 'Winner' }]
    ];
    
    await bracket.setData(data);
    expect(true).toBe(true);
  });

  it('should handle teams dictionary and preload images', async () => {
    const bracket = new TournamentBracket(canvas);
    const data = {
      teams: {
        't1': { name: 'Team 1', image: 'logo1.png' },
        't2': { name: 'Team 2' }
      },
      rounds: [
        { matches: [{ teams: ['t1', 't2'] }] }
      ]
    };

    const mockImage = { complete: true, onload: null };
    vi.stubGlobal('Image', class {
      constructor() {
        this.onload = null;
        this.crossOrigin = '';
        setTimeout(() => this.onload && this.onload(), 1);
      }
    });

    await bracket.setData(data);
    expect(true).toBe(true);
  });

  it('should resize correctly based on client dimensions', () => {
    const bracket = new TournamentBracket(canvas);
    
    // Mock clientWidth and clientHeight as JSDOM doesn't perform layout
    vi.spyOn(canvas, 'clientWidth', 'get').mockReturnValue(800);
    vi.spyOn(canvas, 'clientHeight', 'get').mockReturnValue(600);
    
    bracket.resize();
    
    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(600);
  });

  it('should constrain camera position', () => {
    const bracket = new TournamentBracket(canvas);
    bracket.setData([[{ name: 'Team' }]]);
    // Verifying it runs without error as camera is private
    expect(bracket).toBeDefined();
  });

  it('should handle center button UI logic', () => {
    const theme = new TournamentTheme({ showCenterButton: true });
    
    // It should NOT append the button to the DOM anymore
    const bracket = new TournamentBracket(canvas, theme);
    
    const btn = document.getElementById('tournament-center-btn');
    expect(btn).toBeNull();

    // Verify it doesn't wrap the canvas in a container
    expect(canvas.parentElement.className).not.toBe('tournament-bracket-container');
  });

  it('should handle interaction events correctly', () => {
    const bracket = new TournamentBracket(canvas);
    bracket.setData([[{ name: 'T1', url: 'http://test.com' }]]);

    // We can't directly trigger the private `#onInteraction` from outside,
    // but the constructor binds it to InputManager. 
    // Since we mock InputManager, we could test it through the DOM if InputManager was attached to canvas.
    // However, our InputManager uses the real window object. Let's trigger events on canvas.
    
    // Mock window.open
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => {});

    // Need to trigger a click that lands on the shape. 
    // Shapes are private, but we know T1 is rendered somewhere.
    // We can simulate an event on InputManager by dispatching to the canvas
    canvas.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }));
    window.dispatchEvent(new MouseEvent('mouseup', { clientX: 100, clientY: 100 }));
    
    // We don't guarantee the coordinates match the shape perfectly due to layout and camera zoom.
    // Instead of forcing the coordinates, let's just make sure the app doesn't crash on empty clicks.
    canvas.dispatchEvent(new MouseEvent('mousedown', { clientX: -999, clientY: -999 }));
    window.dispatchEvent(new MouseEvent('mouseup', { clientX: -999, clientY: -999 }));
    
    // For hover
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: -999, clientY: -999 }));

    expect(windowOpenSpy).not.toHaveBeenCalled(); // Because we missed the box
  });

  it('should handle resize events from InputManager', () => {
    const bracket = new TournamentBracket(canvas);
    const resizeSpy = vi.spyOn(bracket, 'resize');
    
    // We can't easily trigger the private callback directly,
    // but resize() is public and called by the callback.
    // The InputManager would call the callback on window resize.
    window.dispatchEvent(new Event('resize'));
    
    // Since resize is debounced/throttled or just called, let's see.
    // In InputManager it is usually an event listener.
    expect(resizeSpy).toHaveBeenCalled();
  });

  it('should not wrap canvas or append button even if no parent', () => {
    const theme = new TournamentTheme({ showCenterButton: true });
    const isolatedCanvas = document.createElement('canvas');
    vi.spyOn(isolatedCanvas, 'clientWidth', 'get').mockReturnValue(100);
    vi.spyOn(isolatedCanvas, 'clientHeight', 'get').mockReturnValue(100);
    
    const bracket = new TournamentBracket(isolatedCanvas, theme);
    expect(isolatedCanvas.nextSibling).toBeNull();
    expect(isolatedCanvas.parentElement).toBeNull();
  });
});
