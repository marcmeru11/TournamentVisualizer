import { describe, it, expect, vi } from 'vitest';
import RectShape from '../../assets/js/shapes/rect.js';
import LineShape from '../../assets/js/shapes/line.js';
import TextShape from '../../assets/js/shapes/text.js';
import ImageShape from '../../assets/js/shapes/image.js';

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
    arc: vi.fn(),
    clip: vi.fn(),
    drawImage: vi.fn(),
    roundRect: vi.fn(),
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

  describe('ImageShape', () => {
    const mockImage = { complete: true };

    it('should draw a circular image', () => {
      const img = new ImageShape(10, 10, 100, 100, mockImage, { clipShape: 'circle' });
      img.draw(mockCtx, mockCamera);
      expect(mockCtx.arc).toHaveBeenCalled();
      expect(mockCtx.clip).toHaveBeenCalled();
      expect(mockCtx.drawImage).toHaveBeenCalled();
    });

    it('should draw a rectangular image with rounded corners', () => {
      const img = new ImageShape(10, 10, 100, 100, mockImage, { clipShape: 'rect', borderRadius: 5 });
      img.draw(mockCtx, mockCamera);
      expect(mockCtx.roundRect).toHaveBeenCalledWith(10, 10, 100, 100, 5);
      expect(mockCtx.clip).toHaveBeenCalled();
    });

    it('should fallback to rect if roundRect is missing', () => {
      const ctxWithoutRoundRect = { ...mockCtx, roundRect: undefined, rect: vi.fn() };
      const img = new ImageShape(10, 10, 100, 100, mockImage, { clipShape: 'rect' });
      img.draw(ctxWithoutRoundRect, mockCamera);
      expect(ctxWithoutRoundRect.rect).toHaveBeenCalled();
    });

    it('should not draw if image is not complete', () => {
      const incompleteImg = { complete: false };
      const img = new ImageShape(0, 0, 100, 100, incompleteImg);
      mockCtx.save.mockClear();
      img.draw(mockCtx, mockCamera);
      expect(mockCtx.save).not.toHaveBeenCalled();
    });

    it('should validate point inside bounds', () => {
      const img = new ImageShape(0, 0, 100, 100, mockImage);
      expect(img.isPointInside(50, 50)).toBe(true);
      expect(img.isPointInside(150, 50)).toBe(false);
    });
  });
});
