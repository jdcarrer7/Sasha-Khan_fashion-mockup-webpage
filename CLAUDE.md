# Sasha Khan — Ultra-Luxurious Fashion Website

## Project Overview

An ultra-luxurious fashion website for "Sasha Khan" — a high-end fashion brand targeting the elite. This digital experience embodies opulent maximalism meets editorial refinement.

## Design System

### Color Palette

| Name           | Hex       | Usage                          |
|----------------|-----------|--------------------------------|
| Noir           | `#0A0A0A` | Primary background             |
| Ivory          | `#F8F6F2` | Primary text, accents          |
| Champagne Gold | `#D4AF37` | Highlights, decorative elements|
| Platinum       | `#E5E4E2` | Secondary text, borders        |

### Typography

| Role     | Font Family        | Weight      | Usage                    |
|----------|--------------------|-------------|--------------------------|
| Display  | Cormorant Garamond | 400, 600    | Elegant display text     |
| Headings | Bebas Neue         | 400         | Bold, commanding titles  |
| Body     | Montserrat         | 300, 400, 500 | Refined body text      |

### Spacing Scale

```
--space-xs: 0.25rem   (4px)
--space-sm: 0.5rem    (8px)
--space-md: 1rem      (16px)
--space-lg: 2rem      (32px)
--space-xl: 4rem      (64px)
--space-2xl: 8rem     (128px)
```

### Transitions

- **Luxury Easing**: `cubic-bezier(0.19, 1, 0.22, 1)`
- **Standard Duration**: 300-500ms
- **Slow Reveal**: 800-1200ms

## Project Structure

```
Claude Code/
├── CLAUDE.md              # This file
├── README.md              # Project readme
├── index.html             # Main entry point
├── src/
│   ├── css/
│   │   ├── variables.css  # Design tokens
│   │   ├── main.css       # Global styles
│   │   ├── hero.css       # Hero section styles
│   │   ├── animations.css # Keyframe animations
│   │   └── responsive.css # Media queries
│   └── js/
│       ├── main.js        # Main JavaScript
│       └── hero.js        # Hero section interactions
└── assets/
    ├── videos/
    │   └── hero-section/
    │       ├── modeling1.mp4
    │       ├── modeling2.mp4
    │       └── modeling3.mp4
    ├── images/
    │   └── hero-section/
    │       └── lux-bag-1-hero-section.png
    └── logo/
        └── sasha-khan-logo.png
```

## Hero Section Architecture

### Diagonal Triangle Layout

The hero section divides the viewport into 4 triangular sections using CSS `clip-path`, creating a "shattered mirror" effect.

```
        ┌────────────────────────────────┐
        │╲          TOP                ╱│
        │  ╲       FREEDOM           ╱  │
        │    ╲                     ╱    │
        │      ╲                 ╱      │
        │ LEFT   ╲    LOGO     ╱ RIGHT  │
        │ ELITE    ╲         ╱ GLAMOUR  │
        │            ╲     ╱            │
        │             ╲   ╱             │
        │              ╲ ╱              │
        │              ╱ ╲              │
        │            ╱     ╲            │
        │          ╱ BOTTOM  ╲          │
        │        ╱ COLLECTIONS ╲        │
        └────────────────────────────────┘
```

### Clip-Path Formulas

- **Top**: `polygon(0 0, 100% 0, 50% 50%)`
- **Bottom**: `polygon(50% 50%, 0 100%, 100% 100%)`
- **Left**: `polygon(0 0, 50% 50%, 0 100%)`
- **Right**: `polygon(100% 0, 50% 50%, 100% 100%)`

### Video Hover Behavior

1. **Default**: Videos paused at first frame
2. **On Hover**: Video plays in loop; other sections dimmed (opacity 0.3)
3. **On Leave**: Video pauses at current frame (does not reset)
4. **On Re-hover**: Video resumes from paused position

## Development Guidelines

### CSS Best Practices

- Use CSS custom properties from `variables.css`
- Follow BEM naming convention (`.hero-triangle--video`)
- Mobile-first responsive approach
- Support reduced motion preferences

### JavaScript

- Vanilla JavaScript only (no frameworks)
- ES6+ class-based architecture
- Event delegation where appropriate

### Accessibility

- Proper `aria-labels` on interactive elements
- `prefers-reduced-motion` support
- Semantic HTML structure
- Videos muted with `playsinline`

### Performance

- Videos: `preload="metadata"`
- Images: Lazy loading where appropriate
- CSS: Critical styles inlined (optional)

## Commands

```bash
# Start local development server
npx serve .

# Or use Python
python3 -m http.server 8000
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
