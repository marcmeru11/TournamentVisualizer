import { describe, it, expect, vi, beforeEach } from 'vitest';
import ImageLoader from '../../assets/js/core/ImageLoader.js';

describe('ImageLoader', () => {
  beforeEach(() => {
    ImageLoader.clear();
    vi.restoreAllMocks();
    
    // Default Mock Image
    vi.stubGlobal('Image', class {
      constructor() {
        this.onload = null;
        this.onerror = null;
        this.crossOrigin = '';
        this._src = '';
      }
      set src(val) {
        this._src = val;
        if (val) {
          setTimeout(() => {
            if (val.includes('fail')) {
              if (this.onerror) this.onerror();
            } else {
              if (this.onload) this.onload();
            }
          }, 1);
        }
      }
      get src() { return this._src; }
    });
  });

  it('should load an image successfully', async () => {
    const url = 'http://test.com/image.png';
    const img = await ImageLoader.load(url);

    expect(img).toBeDefined();
    expect(img.src).toBe(url);
    expect(img.crossOrigin).toBe('anonymous');
    expect(ImageLoader.get(url)).toBe(img);
  });

  it('should return null on load error', async () => {
    const url = 'http://test.com/fail.png';
    const img = await ImageLoader.load(url);

    expect(img).toBeNull();
    expect(ImageLoader.get(url)).toBeNull();
  });

  it('should use cache for repeated calls', async () => {
    const url = 'http://test.com/cache.png';
    const img1 = await ImageLoader.load(url);
    const img2 = await ImageLoader.load(url);

    expect(img1).toBe(img2);
  });

  it('should handle pending requests', async () => {
    const url = 'http://test.com/pending.png';
    const p1 = ImageLoader.load(url);
    const p2 = ImageLoader.load(url);

    expect(p1).toBe(p2);
    
    const [img1, img2] = await Promise.all([p1, p2]);
    expect(img1).toBe(img2);
  });

  it('should load multiple images with loadAll', async () => {
    const urls = ['u1', 'u2', 'u1'];
    const cache = await ImageLoader.loadAll(urls);

    expect(cache.has('u1')).toBe(true);
    expect(cache.has('u2')).toBe(true);
    expect(cache.size).toBe(2);
  });

  it('should clear cache', async () => {
    await ImageLoader.load('u1');
    expect(ImageLoader.get('u1')).not.toBeNull();

    ImageLoader.clear();
    expect(ImageLoader.get('u1')).toBeNull();
  });
});
