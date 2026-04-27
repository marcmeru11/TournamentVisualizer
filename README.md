# Tournament Visualizer

A standalone, modular tournament bracket renderer for HTML5 Canvas. This library provides a highly customizable and performance-oriented engine for displaying tournament progression with support for interactive camera controls, movement constraints, and comprehensive visual themes.

## Features

*   **Modular Architecture**: Decoupled core engine, camera management, and layout strategies using the Facade pattern.
*   **Interactive Viewport**: Full support for **Zoom (Scroll)** and **Pan (Drag)** to navigate large tournament structures.
*   **Smart Constraints**: Built-in camera limits (30% margin logic) to prevent losing the bracket off-screen.
*   **Interactive Elements**: Support for team-specific URLs and match-level links (pill, circle, or line indicators).
*   **Hover Effects**: Grouped hover system — hovering any part of a team box (name, score, background) highlights the entire block with customizable colors.
*   **Round Headers**: Customizable round titles with per-round colors, links, and automatic alignment.
*   **Optional UI Components**: Built-in "Center View" button with customizable styling and automatic DOM placement.
*   **Dynamic Layouts**: Supports both standard single-sided brackets and symmetric split (dual-sided) brackets.
*   **Theme System**: Dedicated theme class with built-in presets (LIGHT, DARK, BLUE) and granular customization.
*   **Adaptive Box Sizing**: Automatic calculation of box widths based on team name length and score presence.
*   **HiDPI / Retina**: Automatic pixel-ratio scaling for crisp rendering on all displays.
*   **Zero Dependencies**: Built with vanilla JavaScript and the native Canvas 2D API.

## Installation

```bash
npm install tournament-visualizer
```

## Quick Start

```javascript
import TournamentBracket from './assets/js/index.js';
import TournamentTheme from './assets/js/models/TournamentTheme.js';

const customTheme = TournamentTheme.DARK.extend({
  showCenterButton: true,
  boxBorderRadius: 12
});

const bracket = new TournamentBracket('canvas-id', customTheme);

const tournamentData = {
  teams: {
    "LIV": { name: "Liverpool", url: "https://example.com/liverpool" },
    "PSG": { name: "Paris SG", url: "https://example.com/psg" },
    "RMA": { name: "Real Madrid", url: "https://example.com/real-madrid" },
    "BAY": { name: "Bayern M.", url: "https://example.com/bayern" }
  },
  championId: "RMA",
  rounds: [
    {
      name: "Semifinals",
      matches: [
        {
          id: "sf1",
          url: "https://example.com/match-sf1",
          teams: [
            { id: "LIV", score: 0 },
            { id: "PSG", score: 2 }
          ]
        },
        {
          id: "sf2",
          teams: [
            { id: "RMA", score: 1 },
            { id: "BAY", score: 0 }
          ]
        }
      ]
    },
    {
      name: "Final",
      matches: [
        {
          id: "final",
          teams: [
            { id: "PSG", score: 1 },
            { id: "RMA", score: 2 }
          ]
        }
      ]
    }
  ]
};

bracket.setData(tournamentData);
```

## Documentation

### TournamentBracket

The main facade for the library.

*   **`constructor(canvasElement, themeOrOptions)`**: Initializes the visualizer. Accepts a canvas ID or DOM element.
*   **`setData(data)`**: Updates the bracket with new data. Accepts the new object format or a legacy array.
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

##### UI Controls

| Property | Description | Default |
| :--- | :--- | :--- |
| `showCenterButton` | Enable the "Center View" UI button | `false` |
| `centerButtonText` | Text for the center button | `"Center View"` |
| `centerButtonStyle` | CSS object for button customization | (Premium Defaults) |

## Data Format

### Recommended: Object Format (v2.0)

The recommended way to pass data is a single object with a **teams dictionary**, a **`championId`**, and a **`rounds`** array. Teams are referenced by ID within matches, keeping the data DRY and easy to maintain.

```javascript
const data = {
  // Team dictionary — define each team once
  teams: {
    "T1": { name: "Cloud9", url: "https://example.com/cloud9" },
    "T2": { name: "Fnatic", url: "https://example.com/fnatic" }
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
  ]
};
```

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

## Interactive Features

*   **Team Links**: Provide a `url` property in the teams dictionary to make team boxes clickable.
*   **Match Links**: Provide a `url` property at the match level to make the VS indicator clickable.
*   **Round Links**: Provide a `url` property at the round level to make round headers clickable.
*   **Hover Effects**: All parts of a team box (name, score, background) highlight together on hover.
*   **Camera Pan**: Click and drag anywhere on the canvas to move the view.
*   **Camera Zoom**: Use the mouse wheel to zoom in/out at the cursor position.
*   **Touch Support**: Pinch-to-zoom and drag gestures work on mobile devices.
*   **Constraints**: The camera is automatically restricted to prevent the bracket from being panned too far off-screen.

## Testing

```bash
npm test
```

Runs the full test suite with Vitest including coverage reports.

## Contributing

1.  Fork the repository.
2.  Create a feature branch: `git checkout -b feature/your-feature`.
3.  Follow the modular patterns in `assets/js/core`.
4.  Submit a pull request.
