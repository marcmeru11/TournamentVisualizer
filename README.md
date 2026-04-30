# Tournament Visualizer

A standalone, modular tournament bracket renderer for HTML5 Canvas. This library provides a highly customizable and performance-oriented engine for displaying tournament progression with support for interactive camera controls, movement constraints, team logos, and comprehensive visual themes.

## Features

*   **Modular Architecture**: Decoupled core engine, camera management, and layout strategies using the Facade pattern.
*   **Interactive Viewport**: Full support for **Zoom (Scroll)** and **Pan (Drag)** to navigate large tournament structures.
*   **Smart Constraints**: Built-in camera limits (30% margin logic) to prevent losing the bracket off-screen.
*   **Interactive Elements**: Support for team-specific URLs and match-level links (pill, circle, or line indicators).
*   **Team Logos**: Automatic preloading and rendering of team images with customizable shape (circle/rect), size, and position.
*   **Hover Effects**: Grouped hover system — hovering any part of a team box (name, score, logo, background) highlights the entire block with customizable colors.
*   **Round Headers**: Customizable round titles with per-round colors, links, and automatic alignment.
*   **Optional UI Components**: Built-in "Center View" button with customizable styling and automatic DOM placement.
*   **Dynamic Layouts**: Supports both standard single-sided brackets and symmetric split (dual-sided) brackets.
*   **Theme System**: Dedicated theme class with built-in presets (LIGHT, DARK, BLUE) and granular customization.
*   **Winner & Champion Highlighting**: Robust system to highlight winners, losers, and champions with specific box colors, text styles, and line paths.
*   **Extra Matches Support**: Native support for third-place matches or any additional matches outside the main bracket, with custom titles and flexible alignment.
*   **Adaptive Box Sizing**: Automatic calculation of box widths based on team name length, logo presence, and score.
*   **HiDPI / Retina**: Automatic pixel-ratio scaling for crisp rendering on all displays.
*   **Zero Dependencies**: Built with vanilla JavaScript and the native Canvas 2D API.

## Installation

```bash
npm install tournament-visualizer
```

## Quick Start

```html
<canvas id="canvas" style="width: 100%; height: 100vh;"></canvas>
<script type="module">
  import TournamentBracket from 'tournament-visualizer';
  import TournamentTheme from 'tournament-visualizer/assets/js/models/TournamentTheme.js';

  const bracket = new TournamentBracket('canvas', TournamentTheme.DARK);

  bracket.setData({
    teams: {
      "RMA": { name: "Real Madrid", url: "https://example.com/rma", image: "/logos/real_madrid.png" },
      "FCB": { name: "FC Barcelona", url: "https://example.com/fcb", image: "/logos/barcelona.png" },
      "BAY": { name: "Bayern M.", url: "https://example.com/bay", image: "/logos/bayern.png" },
      "LIV": { name: "Liverpool", url: "https://example.com/liv", image: "/logos/liverpool.png" }
    },
    championId: "RMA",
    rounds: [
      {
        name: "Semifinals",
        matches: [
          { id: "sf1", teams: [{ id: "RMA", score: 3 }, { id: "FCB", score: 1 }] },
          { id: "sf2", teams: [{ id: "BAY", score: 0 }, { id: "LIV", score: 2 }] }
        ]
      },
      {
        name: "Final",
        matches: [
          { id: "final", teams: [{ id: "RMA", score: 2 }, { id: "LIV", score: 1 }] }
        ]
      }
    ]
  });
</script>
```

## Documentation

### TournamentBracket

The main facade for the library.

*   **`constructor(canvasElement, themeOrOptions)`**: Initializes the visualizer. Accepts a canvas ID or DOM element.
*   **`setData(data)`**: Updates the bracket with new data. Accepts the new object format or a legacy array. Returns a `Promise` that resolves when all team logos have been preloaded.
*   **`centerCamera()`**: Recalculates the optimal zoom and position to fit the current bracket in the viewport.
*   **`render()`**: Triggers a manual re-render of the scene.
*   **`resize()`**: Updates the internal canvas dimensions to match the client container.

### TournamentTheme

The configuration class for visual styling and behavior.

*   **Presets**: `TournamentTheme.LIGHT`, `TournamentTheme.DARK`, `TournamentTheme.BLUE`.
*   **`extend(overrides)`**: Creates a new theme instance with specific overrides.

#### Configuration Options

##### Box & Text

| Property | Description | Default |
| :--- | :--- | :--- |
| `boxFillColor` | Team box background color | `#dbeafe` |
| `boxStrokeColor` | Team box border color | `#1e293b` |
| `boxLineWidth` | Team box border thickness | `2` |
| `boxBorderRadius` | Corner radius for team boxes | `0` |
| `textColor` | Team name text color | `#111827` |
| `fontSize` | Font size for team names and scores | `16` |
| `fontFamily` | Font family for text | `"Arial"` |

##### Hover Effects

| Property | Description | Default |
| :--- | :--- | :--- |
| `boxHoverFillColor` | Box background on hover | Same as `boxFillColor` |
| `boxHoverStrokeColor` | Box border on hover | Same as `boxStrokeColor` |
| `textColorHover` | Team name color on hover | Same as `textColor` |
| `scoreBoxHoverFillColor` | Score box background on hover | Same as `scoreBoxFillColor` |
| `scoreTextColorHover` | Score text color on hover | Same as `scoreTextColor` |

##### Score Box

| Property | Description | Default |
| :--- | :--- | :--- |
| `scoreBoxWidth` | Width of the score sub-box | `30` |
| `scoreBoxFillColor` | Background for score boxes | `#1e293b` |
| `scoreTextColor` | Text color for scores | `#ffffff` |

##### Layout & Spacing

| Property | Description | Default |
| :--- | :--- | :--- |
| `layoutType` | `"single"` or `"split"` layout | `"single"` |
| `backgroundColor` | Canvas background color | `null` (transparent) |
| `roundSpacingX` | Horizontal gap between rounds | `100` |
| `teamSpacingY` | Vertical gap between teams | `20` |
| `teamYsize` | Height of each team box | `50` |
| `minWidth` | Minimum width for team boxes | `100` |
| `paddingX` | Horizontal padding inside boxes | `24` |
| `centerGap` | Gap for split layout center | `200` |

##### Round Headers

| Property | Description | Default |
| :--- | :--- | :--- |
| `roundHeaderFontSize` | Font size for round titles | `18` |
| `roundHeaderTextColor` | Text color for round titles | `#64748b` |
| `roundHeaderMarginBottom` | Space between header and first box | `30` |

##### Match Indicators

| Property | Description | Default |
| :--- | :--- | :--- |
| `matchIndicatorType` | `"circle"`, `"pill"`, `"line"`, or `"hidden"` | `"circle"` |
| `matchIndicatorSize` | Base size for the indicator | `20` |
| `matchIndicatorColor` | Background/border color | Same as `boxStrokeColor` |
| `matchIndicatorIconColor` | Icon/Label text color | `#ffffff` |
| `matchIndicatorLabel` | Text inside the indicator (e.g. `"VS"`, `"i"`) | `"i"` |

##### Team Logos

| Property | Description | Default |
| :--- | :--- | :--- |
| `showTeamLogos` | Enable team logo rendering | `true` |
| `teamLogoSize` | Logo dimensions in pixels (square) | `28` |
| `teamLogoShape` | Clipping shape: `"circle"` or `"rect"` | `"circle"` |
| `teamLogoBorderRadius` | Border radius when shape is `"rect"` | `4` |
| `teamLogoMargin` | Margin between logo and box edges | `8` |
| `teamLogoPosition` | Logo placement: `"left"` or `"right"` | `"left"` |

##### UI Controls

| Property | Description | Default |
| :--- | :--- | :--- |
| `showCenterButton` | Enable the "Center View" UI button | `false` |
| `centerButtonText` | Text for the center button | `"Center View"` |
| `centerButtonStyle` | CSS object for button customization | (Premium Defaults) |

##### Winner & Champion Highlighting

| Property | Description | Default |
| :--- | :--- | :--- |
| `highlightWinner` | Enable special styling for winners | `true` |
| `winnerBoxFillColor` | Background for winner boxes | `null` (uses default) |
| `winnerBoxStrokeColor`| Border color for winner boxes | `null` |
| `winnerTextColor` | Text color for winners | `null` |
| `highlightWinnerLines`| Highlight connector lines for winners| `true` |
| `winnerLineColor` | Color for winner progress lines | `null` |
| `highlightChampion` | Enable special styling for champions | `true` |
| `championBoxFillColor` | Background for the champion box | `null` |
| `championTextColor` | Text color for the champion | `null` |
| `championFontSize` | Font size for the champion | `null` |
| `championLogoSize` | Logo size for the champion | `null` |

##### Extra Matches

| Property | Description | Default |
| :--- | :--- | :--- |
| `extraMatchesMarginTop`| Margin above extra matches section | `60` |
| `extraMatchSpacingY` | Gap between extra match groups | `40` |
| `extraMatchesDefaultLabel`| Default title for extra matches | `"Extra Match"` |

## Data Format

### Recommended: Object Format (v2.0)

The recommended way to pass data is a single object with a **teams dictionary**, a **`championId`**, and a **`rounds`** array. Teams are referenced by ID within matches, keeping the data DRY and easy to maintain.

```javascript
const data = {
  // Team dictionary — define each team once
  teams: {
    "T1": { name: "Cloud9", url: "https://example.com/cloud9", image: "/logos/cloud9.png" },
    "T2": { name: "Fnatic", url: "https://example.com/fnatic", image: "/logos/fnatic.png" }
  },
  
  // ID of the tournament winner (auto-generates a final champion round)
  championId: "T1",
  
  rounds: [
    {
      name: "Final",           // Round header text (optional)
      url: "https://...",      // Makes the header clickable (optional)
      textColor: "#66fcf1",    // Per-round header color (optional)
      matches: [
        {
          id: "final",             // Match identifier (optional)
          url: "https://...",      // Makes the VS indicator clickable (optional)
          teams: [
            { id: "T1", score: 3 },  // References dictionary by ID
            { id: "T2", score: 1 }
          ]
        }
      ]
    }
  ],

  // Optional: Matches outside the main bracket (e.g. 3rd Place)
  extraMatches: [
    {
      title: "3rd Place Match",
      alignWithRound: 0,       // Align horizontally with a specific round index
      match: {
        id: "m3rd",
        teams: [{ id: "BAY", score: 2 }, { id: "FCB", score: 0 }],
        winnerId: "BAY"
      }
    }
  ]
};
```

#### Team Properties

| Property | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | Yes | Display name for the team |
| `url` | `string` | No | Makes the team box clickable |
| `image` | `string` | No | URL or path to the team's logo image. Loaded asynchronously and cached |

### Legacy: Array Format

For backward compatibility, the visualizer still accepts the original array-of-rounds format:

```javascript
const data = [
  [{ name: "Team A", score: 2 }, { name: "Team B", score: 1 }],
  [{ name: "Team A" }]
];
```

Or the intermediate format with round objects and flat teams:

```javascript
const data = [
  {
    name: "Semifinals",
    matches: [
      { teams: [{ name: "A", score: 1 }, { name: "B", score: 2 }] }
    ]
  }
];
```

## Custom Indicators

Customize how match indicators are displayed between rounds using `matchIndicatorType`:

*   **`pill`**: A modern, elongated badge (rounded rectangle). Ideal for "VS" or "INFO" labels.
*   **`circle`**: A classic circular indicator.
*   **`line`**: No separate icon; the connector lines for matches with a URL use the `matchIndicatorColor`. The junction remains interactive via an invisible hotspot.
*   **`hidden`**: No visual indicator is drawn.

> **Note:** Indicators are always rendered between matches. If a match has a `url`, the indicator becomes clickable.

```javascript
const theme = TournamentTheme.DARK.extend({
  matchIndicatorType: 'pill',
  matchIndicatorLabel: 'VS',
  matchIndicatorColor: '#1e293b',
  matchIndicatorIconColor: '#38bdf8'
});
```

## Team Logos

Team logos are loaded asynchronously and rendered inside the team boxes. Provide an `image` URL in the teams dictionary and the library handles preloading, caching, and rendering automatically.

```javascript
const data = {
  teams: {
    "RMA": { name: "Real Madrid", image: "/logos/real_madrid.png" }
  },
  // ...
};

// setData returns a Promise — the bracket renders immediately
// with placeholders, then re-renders once logos are loaded
await bracket.setData(data);
```

Customize logo appearance via the theme:

```javascript
const theme = TournamentTheme.DARK.extend({
  showTeamLogos: true,      // default: true
  teamLogoSize: 32,         // default: 28
  teamLogoShape: 'circle',  // 'circle' or 'rect'
  teamLogoPosition: 'left', // 'left' or 'right'
  teamLogoMargin: 10        // default: 8
});
```

Set `showTeamLogos: false` to hide logos even when image URLs are present.

## Interactive Features

*   **Team Links**: Provide a `url` property in the teams dictionary to make team boxes clickable.
*   **Match Links**: Provide a `url` property at the match level to make the VS indicator clickable.
*   **Round Links**: Provide a `url` property at the round level to make round headers clickable.
*   **Hover Effects**: All parts of a team box (name, score, logo, background) highlight together on hover.
*   **Camera Pan**: Click and drag anywhere on the canvas to move the view.
*   **Camera Zoom**: Use the mouse wheel to zoom in/out at the cursor position.
*   **Touch Support**: Pinch-to-zoom and drag gestures work on mobile devices.
*   **Constraints**: The camera is automatically restricted to prevent the bracket from being panned too far off-screen.

## Development

```bash
# Start the local demo server
npm run dev

# Run tests with coverage
npm test
```

> **Note:** Only the library source code (`assets/js/core/`, `assets/js/models/`, `assets/js/shapes/`, and the entry point `assets/js/index.js`) is published to npm. Demo files, logos, and tests are excluded to keep the package lightweight (~17 kB).

## Contributing

1.  Fork the repository.
2.  Create a feature branch: `git checkout -b feature/your-feature`.
3.  Follow the modular patterns in `assets/js/core`.
4.  Submit a pull request.
