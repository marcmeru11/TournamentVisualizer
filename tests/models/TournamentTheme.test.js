import { describe, it, expect } from 'vitest';
import TournamentTheme from '../../assets/js/models/TournamentTheme.js';

describe('TournamentTheme Model', () => {
  it('should initialize with default values', () => {
    const theme = new TournamentTheme();
    expect(theme.boxFillColor).toBe("#dbeafe");
    expect(theme.layoutType).toBe("single");
  });

  it('should override default values', () => {
    const theme = new TournamentTheme({ boxFillColor: "#ff0000", layoutType: "split" });
    expect(theme.boxFillColor).toBe("#ff0000");
    expect(theme.layoutType).toBe("split");
  });

  it('should extend correctly', () => {
    const darkTheme = TournamentTheme.DARK;
    const customTheme = darkTheme.extend({ boxBorderRadius: 20 });
    expect(customTheme.backgroundColor).toBe(darkTheme.backgroundColor);
    expect(customTheme.boxBorderRadius).toBe(20);
  });

  it('should provide presets', () => {
    expect(TournamentTheme.LIGHT).toBeInstanceOf(TournamentTheme);
    expect(TournamentTheme.DARK).toBeInstanceOf(TournamentTheme);
    expect(TournamentTheme.BLUE).toBeInstanceOf(TournamentTheme);
  });
});
