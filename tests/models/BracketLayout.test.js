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

  it('should render score boxes when score is provided', () => {
    const tournament = new Tournament([
      [{ name: 'T1', score: 2 }, { name: 'T2', score: 1 }],
      [{ name: 'T1', score: 0 }]
    ]);
    const shapes = layout.generateShapes(tournament, mockCtx);
    
    // Check that we generated the symmetric score boxes
    // TextShapes should include the scores '2', '1', '0'
    const textShapes = shapes.filter(s => s.constructor.name === 'TextShape');
    const texts = textShapes.map(ts => ts.text); // Assuming TextShape has text or we just check they exist
    expect(textShapes.length).toBeGreaterThan(3); // 3 names + 3 scores = 6
  });

  it('should render circle match indicators', () => {
    const customTheme = theme.extend({ matchIndicatorType: 'circle' });
    const localLayout = new BracketLayout(customTheme);
    const tournament = new Tournament([
      [{ name: 'T1', matchUrl: 'url1' }, { name: 'T2' }],
      [{ name: 'T1' }]
    ]);
    const shapes = localLayout.generateShapes(tournament, mockCtx);
    expect(shapes.length).toBeGreaterThan(0);
  });

  it('should render pill match indicators', () => {
    const customTheme = theme.extend({ matchIndicatorType: 'pill' });
    const localLayout = new BracketLayout(customTheme);
    const tournament = new Tournament([
      [{ name: 'T1', matchUrl: 'url1' }, { name: 'T2' }],
      [{ name: 'T1' }]
    ]);
    const shapes = localLayout.generateShapes(tournament, mockCtx);
    expect(shapes.length).toBeGreaterThan(0);
  });

  it('should render line match indicators (invisible hotspots)', () => {
    const customTheme = theme.extend({ matchIndicatorType: 'line' });
    const localLayout = new BracketLayout(customTheme);
    const tournament = new Tournament([
      [{ name: 'T1' }, { name: 'T2', matchUrl: 'url1' }], // Test partner having url
      [{ name: 'T2' }]
    ]);
    const shapes = localLayout.generateShapes(tournament, mockCtx);
    expect(shapes.length).toBeGreaterThan(0);
  });

  it('should not render match indicators when hidden', () => {
    const customTheme = theme.extend({ matchIndicatorType: 'hidden' });
    const localLayout = new BracketLayout(customTheme);
    const tournament = new Tournament([
      [{ name: 'T1', matchUrl: 'url1' }, { name: 'T2' }],
      [{ name: 'T1' }]
    ]);
    const shapes = localLayout.generateShapes(tournament, mockCtx);
    expect(shapes.length).toBeGreaterThan(0);
  });

  it('should generate shapes for multiple extra matches', () => {
    const tournament = new Tournament({
      teams: { "T1": { name: "Team 1" }, "T2": { name: "Team 2" } },
      rounds: [{ 
        name: "Final",
        matches: [{ teams: [{ id: "T1" }, { id: "T2" }] }] 
      }],
      extraMatches: [
        {
          title: "Extra A",
          match: { id: "a", teams: [{ id: "T1" }, { id: "T2" }] }
        },
        {
          title: "Extra B",
          match: { id: "b", teams: [{ id: "T1" }, { id: "T2" }] }
        }
      ]
    });
    const shapes = layout.generateShapes(tournament, mockCtx);
    
    // Check that we have both headers
    const headerA = shapes.find(s => s.constructor.name === 'TextShape' && s.text === 'Extra A');
    const headerB = shapes.find(s => s.constructor.name === 'TextShape' && s.text === 'Extra B');
    expect(headerA).toBeDefined();
    expect(headerB).toBeDefined();
    
    // Check for team boxes (2 groups * 2 teams = 4 boxes)
    const boxes = shapes.filter(s => s.constructor.name === 'RectShape' && s.hoverGroupId && s.hoverGroupId.startsWith('extra-'));
    expect(boxes.length).toBeGreaterThanOrEqual(4);
  });
});
