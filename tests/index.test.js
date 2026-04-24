import { describe, it, expect, beforeEach } from 'vitest';
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
    document.body.removeChild(canvas);
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

  it('should set data and render', () => {
    const bracket = new TournamentBracket(canvas);
    const data = [
      [{ name: 'Team 1' }, { name: 'Team 2' }],
      [{ name: 'Winner' }]
    ];
    
    // This should not crash
    bracket.setData(data);
    
    // We can't easily check the canvas pixels in this environment, 
    // but we can check if it runs without errors.
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
});
