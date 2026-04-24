import { describe, it, expect, vi } from 'vitest';
import BracketLayout from '../../assets/js/models/BracketLayout.js';
import Tournament from '../../assets/js/models/Tournament.js';
import TournamentTheme from '../../assets/js/models/TournamentTheme.js';

describe('BracketLayout', () => {
  const theme = TournamentTheme.LIGHT;
  const layout = new BracketLayout(theme);
  
  // Mock canvas context
  const mockCtx = {
    measureText: vi.fn().mockReturnValue({ width: 50 }),
    font: ''
  };

  it('should return empty shapes for empty tournament', () => {
    const tournament = new Tournament();
    const shapes = layout.generateShapes(tournament, mockCtx);
    expect(shapes).toEqual([]);
  });

  it('should generate shapes for a simple tournament', () => {
    const tournament = new Tournament([
      [{ name: 'Team 1' }, { name: 'Team 2' }],
      [{ name: 'Winner' }]
    ]);
    const shapes = layout.generateShapes(tournament, mockCtx);
    
    // Should have rects, lines and texts
    // At least 2 boxes for round 1 + 1 box for round 2
    expect(shapes.length).toBeGreaterThan(0);
    
    // Check if we have RectShape, TextShape, etc.
    const rects = shapes.filter(s => s.constructor.name === 'RectShape');
    expect(rects.length).toBeGreaterThanOrEqual(3); 
  });

  it('should handle split layout type', () => {
    const splitTheme = theme.extend({ layoutType: 'split' });
    const splitLayout = new BracketLayout(splitTheme);
    const tournament = new Tournament([
      [{ name: 'T1' }, { name: 'T2' }, { name: 'T3' }, { name: 'T4' }],
      [{ name: 'W1' }, { name: 'W2' }],
      [{ name: 'Final Winner' }]
    ]);
    
    const shapes = splitLayout.generateShapes(tournament, mockCtx);
    expect(shapes.length).toBeGreaterThan(0);
  });
});
