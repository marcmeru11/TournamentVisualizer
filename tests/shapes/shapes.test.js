import { describe, it, expect, vi } from 'vitest';
import RectShape from '../../assets/js/shapes/rect.js';
import LineShape from '../../assets/js/shapes/line.js';
import TextShape from '../../assets/js/shapes/text.js';

describe('Shapes', () => {
  const mockCtx = {
    beginPath: vi.fn(),
    rect: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn().mockReturnValue({ width: 10 }),
    arcTo: vi.fn(),
    closePath: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
  };

  const mockCamera = { x: 0, y: 0, zoom: 1 };

  it('RectShape should call canvas methods', () => {
    const rect = new RectShape(0, 0, 100, 50, '#ff0000', true);
    rect.draw(mockCtx, mockCamera);
    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.fill).toHaveBeenCalled();
  });

  it('LineShape should call canvas methods', () => {
    const line = new LineShape(0, 0, 100, 100, '#000000');
    line.draw(mockCtx, mockCamera);
    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.stroke).toHaveBeenCalled();
  });

  it('TextShape should call canvas methods', () => {
    const text = new TextShape(0, 0, 'Hello', '#000000');
    text.draw(mockCtx, mockCamera);
    expect(mockCtx.fillText).toHaveBeenCalledWith('Hello', 0, 0);
  });
});
