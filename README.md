# Sasha Khan — Ultra-Luxurious Fashion Website

An ultra-luxurious fashion website for **Sasha Khan** — a high-end fashion brand targeting the elite. This digital experience embodies opulent maximalism meets editorial refinement.

## Features

- **Diagonal Triangle Hero Layout** — A unique "shattered mirror" effect dividing the viewport into 4 triangular sections
- **Interactive Video Hover** — Videos play on hover, pause when leaving, and resume from the paused position
- **Responsive Design** — Mobile-first approach with elegant fallbacks for all device sizes
- **Accessibility** — Full keyboard navigation, reduced motion support, and proper ARIA labels
- **Performance Optimized** — Video preload strategies, lazy loading, and efficient animations

## Tech Stack

- HTML5
- CSS3 (Custom Properties, Clip-path, Animations)
- Vanilla JavaScript (ES6+)
- No frameworks or dependencies

## Getting Started

### Prerequisites

- A modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- A local development server (optional but recommended for video playback)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Sasha-Khan_fashion-mockup-webpage.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Sasha-Khan_fashion-mockup-webpage
   ```

3. Start a local server:
   ```bash
   # Using Python
   python3 -m http.server 8000

   # Or using Node.js
   npx serve .
   ```

4. Open `http://localhost:8000` in your browser

## Project Structure

```
├── CLAUDE.md              # Project documentation
├── README.md              # This file
├── index.html             # Main entry point
├── src/
│   ├── css/
│   │   ├── variables.css  # Design tokens
│   │   ├── main.css       # Global styles
│   │   ├── hero.css       # Hero section styles
│   │   ├── animations.css # Keyframe animations
│   │   └── responsive.css # Media queries
│   └── js/
│       ├── main.js        # Global utilities
│       └── hero.js        # Hero section interactions
└── assets/
    ├── videos/
    │   └── hero-section/
    ├── images/
    │   └── hero-section/
    └── logo/
```

## Design System

### Colors

| Name           | Hex       |
|----------------|-----------|
| Noir           | `#0A0A0A` |
| Ivory          | `#F8F6F2` |
| Champagne Gold | `#D4AF37` |
| Platinum       | `#E5E4E2` |

### Typography

- **Display**: Cormorant Garamond
- **Headings**: Bebas Neue
- **Body**: Montserrat

## License

This project is for demonstration purposes only. All brand assets are fictional.
