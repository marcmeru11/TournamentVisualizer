# Tournament Visualizer

A standalone, modular tournament bracket renderer for HTML5 Canvas. This library provides a highly customizable and performance-oriented engine for displaying tournament progression with support for interactive camera controls, movement constraints, and comprehensive visual themes.

## Features

*   **Modular Architecture**: Decoupled core engine, camera management, and layout strategies using the Facade pattern.
*   **Interactive Viewport**: Full support for **Zoom (Scroll)** and **Pan (Drag)** to navigate large tournament structures.
*   **Smart Constraints**: Built-in camera limits (30% margin logic) to prevent losing the bracket off-screen.
*   **Interactive Elements**: Support for team-specific URLs and match-specific info links ("i" indicators).
*   **Optional UI Components**: Built-in "Center View" button with customizable styling and automatic DOM placement.
*   **Dynamic Layouts**: Supports both standard single-sided brackets and symmetric split (dual-sided) brackets.
*   **Theme System**: Dedicated theme class with built-in presets (LIGHT, DARK, BLUE) and granular customization.
*   **Adaptive Box Sizing**: Automatic calculation of box widths based on team name length and score presence.
*   **Zero Dependencies**: Built with vanilla JavaScript and the native Canvas 2D API.

## Installation

```bash
npm install tournament-visualizer
```

## Quick Start

Initialize a tournament bracket by providing a target canvas element and an optional theme configuration.

```javascript
import TournamentBracket from './assets/js/index.js';
import TournamentTheme from './assets/js/models/TournamentTheme.js';

// Initialize with a premium dark theme and a center button
const customTheme = TournamentTheme.DARK.extend({
  showCenterButton: true,
  boxBorderRadius: 10
});

const bracket = new TournamentBracket('canvas-id', customTheme);

const data = [
  [
    { name: 'Team A', score: 2, url: 'https://team-a.com' }, 
    { name: 'Team B', score: 1, matchUrl: 'https://match-details.com' },
    'Team C', 
    'Team D'
  ],
  ['Team A', 'Team C'],
  ['Team A']
];

bracket.setData(data);
```

## Documentation

### TournamentBracket

The main facade for the library.

*   **`constructor(canvasElement, themeOrOptions)`**: Initializes the visualizer. Accepts a canvas ID or DOM element.
*   **`setData(rounds)`**: Updates the bracket with new data. The input should be an array of rounds, each containing an array of teams.
*   **`centerCamera()`**: Recalculates the optimal zoom and position to fit the current bracket in the viewport.
*   **`render()`**: Triggers a manual re-render of the scene.
*   **`resize()`**: Updates the internal canvas dimensions to match the client container.

### TournamentTheme

The configuration class for visual styling and behavior.

*   **Presets**: `TournamentTheme.LIGHT`, `TournamentTheme.DARK`, `TournamentTheme.BLUE`.
*   **`extend(overrides)`**: Creates a new theme instance with specific overrides.

#### Configuration Options

| Property | Description | Default |
| :--- | :--- | :--- |
| `layoutType` | `single` or `split` layout | `"single"` |
| `backgroundColor` | Canvas background color | `null` (transparent) |
| `boxFillColor` | Team box background color | `#dbeafe` |
| `boxStrokeColor` | Team box border color | `#1e293b` |
| `boxLineWidth` | Team box border thickness | `2` |
| `boxBorderRadius` | Corner radius for team boxes | `0` |
| `textColor` | Team name text color | `#111827` |
| `fontSize` | Font size for team names and scores | `16` |
| `fontFamily` | Font family for text | `"Arial"` |
| `lineColor` | Connector line color | `#0f172a` |
| `lineWidth` | Thickness of connector lines | `3` |
| `roundSpacingX` | Horizontal gap between rounds | `100` |
| `teamSpacingY` | Vertical gap between teams | `20` |
| `teamYsize` | Height of each team box | `50` |
| `minWidth` | Minimum width for team boxes | `100` |
| `paddingX` | Horizontal padding inside boxes | `24` |
| `scoreBoxWidth` | Width of the score sub-box | `30` |
| `scoreBoxFillColor` | Background for score boxes | `#1e293b` |
| `scoreTextColor` | Text color for scores | `#ffffff` |
| `matchIndicatorType` | Style of match links (`circle`, `pill`, `line`, `hidden`) | `"circle"` |
| `matchIndicatorSize` | Base size for the indicator | `20` |
| `matchIndicatorColor` | Background/border color | (Same as boxStrokeColor) |
| `matchIndicatorIconColor` | Icon/Label text color | `#ffffff` |
| `matchIndicatorLabel` | Text inside the indicator (e.g. "VS", "i") | `"i"` |
| `centerGap` | Gap for split layout center | `200` |
| `showCenterButton` | Enable the "Center View" UI button | `false` |
| `centerButtonText` | Text for the center button | `"Center View"` |
| `centerButtonStyle` | CSS object for button customization | (Premium Defaults) |

## Custom Indicators

You can customize how match links (info links between teams) are displayed using the `matchIndicatorType` property:

*   **`pill`**: A modern, elongated badge (rounded rectangle). Ideal for "VS" or "INFO" labels.
*   **`circle`**: A classic circular indicator.
*   **`line`**: No separate icon; instead, the connector lines for matches with a URL will use the `matchIndicatorColor`. **Note:** The junction remains interactive via an invisible hotspot.
*   **`hidden`**: No visual indicator is drawn and interaction is disabled for the match.

Example of a modern "VS" badge:
```javascript
const theme = TournamentTheme.DARK.extend({
  matchIndicatorType: 'pill',
  matchIndicatorLabel: 'VS',
  matchIndicatorColor: '#1e293b',
  matchIndicatorIconColor: '#38bdf8'
});
```

## Interactive Features

*   **Team Links**: Provide a `url` property in the team object to make the entire box clickable.
*   **Match Links**: Provide a `matchUrl` property to render a small "i" indicator between teams that opens the URL.
*   **Camera Pan**: Click and drag anywhere on the canvas to move the view.
*   **Camera Zoom**: Use the mouse wheel to zoom in/out at the cursor position.
*   **Constraints**: The camera is automatically restricted to prevent the bracket from being panned too far off-screen.

## Data Format

The visualizer accepts an array of rounds. Each team can be a string or a rich object:

```javascript
[
  [ // Round 1
    { 
      name: "Alpha", 
      score: 3, 
      url: "/teams/alpha", 
      matchUrl: "/matches/101" 
    },
    { name: "Beta", score: 1 }
  ],
  [ // Round 2 (Finals)
    { name: "Alpha" }
  ]
]
```

## Contributing

1.  Fork the repository.
2.  Create a feature branch: `git checkout -b feature/your-feature`.
3.  Follow the modular patterns in `assets/js/core`.
4.  Submit a pull request.
