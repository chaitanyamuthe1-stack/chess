# ♟️ Chess Arena - Premium Gaming UI

<div align="center">

![Chess Arena](https://img.shields.io/badge/Chess%20Arena-Gaming%20UI-purple?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.3-38bdf8?style=flat-square&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12.38-000?style=flat-square)

A **professional, immersive, AAA-quality gaming interface** for Chess Arena, featuring modern animations, glassmorphism effects, and premium UI components.

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Components](#-components) • [Contributing](#-contributing)

</div>

---

## 🎮 Features

### ✨ Visual Design
- **Glassmorphism Effects**: Modern frosted glass UI with backdrop blur
- **Neon Gaming Aesthetic**: Cyan, Pink, Purple, Green glowing accents
- **Dark Gaming Theme**: Professional dark color scheme inspired by AAA games
- **Animated Particles**: Dynamic background particle system
- **Premium Gradients**: Cinematic multi-directional gradient effects

### 🎬 Animations & Interactions
- **Framer Motion Integration**: Smooth spring physics-based animations
- **Interactive Hover Effects**: Buttons scale and glow on interaction
- **Cinematic Transitions**: Smooth page and modal opening/closing
- **Floating Elements**: Subtle immersive animations
- **Auto-Counting Numbers**: Smooth score and stat animations

### 🛠️ Component Library
**12+ Reusable Premium Components**:
- NeonText, GlassCard, GamingButton (4 variants)
- GamingModal, GlowingProgressBar, AnimatedCounter
- Toast Notifications, LoadingScreen, SettingsPanel
- ParticleBackground, GameBoard, ScoreDisplay

### 🎯 Gaming Features
- **Animated Score Tracking**: Real-time score with smooth counting
- **Combo System**: Visual combo multiplier with glow effects
- **Level Progression**: XP progress bar with animations
- **Statistics Dashboard**: Moves, accuracy, combo tracking
- **Achievement Panel**: Unlockable achievements display
- **Game Modals**: Pause, Victory, Defeat screens with animations

### 📱 Responsive Design
- Fully responsive for all screen sizes
- Mobile, Tablet, Desktop optimized layouts
- Touch-friendly interactions
- Adaptive UI components

### ♿ Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Focus states for all interactive elements
- High contrast text
- Reduced motion preferences support

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone repository
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📚 Documentation

- [**Implementation Details**](./IMPLEMENTATION_COMPLETE.md) - Complete feature breakdown
- [**Gaming UI Guide**](./README_GAMING_UI.md) - Component library & design system
- [**Backend Integration**](./BACKEND_INTEGRATION_GUIDE.md) - API integration examples
- [**Architecture Guide**](./ARCHITECTURE.md) - Project structure & patterns

---

## 🧩 Core Components

### UI Components

```tsx
import {
  NeonText,           // Glowing neon text
  GlassCard,          // Glassmorphic container
  GamingButton,       // Premium button (4 variants)
  GamingModal,        // Cinematic modal
  GlowingProgressBar, // Animated progress
  AnimatedCounter,    // Number animation
  Toast,              // Notifications
  LoadingScreen,      // Loading UI
  SettingsPanel,      // Settings menu
  ParticleBackground  // Animated background
} from './components/ui'

import {
  GameBoard,          // Interactive chess board
  ScoreDisplay        // Stats & score display
} from './components/game'
```

### Example Usage

```tsx
<GamingButton
  variant="primary"
  onClick={() => handlePlay()}
  size="lg"
>
  Play Game
</GamingButton>

<GlassCard neon className="p-6">
  <NeonText color="cyan" className="text-2xl">
    Your Stats
  </NeonText>
  <AnimatedCounter value={score} color="cyan" />
</GlassCard>
```

---

## 🎨 Design System

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Neon Cyan | #00d9ff | Primary accent |
| Neon Purple | #a855f7 | Secondary accent |
| Neon Pink | #ec4899 | Tertiary accent |
| Neon Green | #22c55e | Success |
| Gaming Dark | #0a0e27 | Main BG |
| Gaming Darker | #030812 | Deep BG |

### Typography
- **Headings**: Orbitron (gaming font)
- **Body**: Inter (modern sans-serif)

### Animations
- Spring physics-based motion
- Staggered child animations
- Smooth entry/exit transitions
- Interactive feedback effects

---

## 🔧 Configuration

### Environment Variables

```bash
# .env
VITE_API_URL=http://localhost:8000
VITE_API_TIMEOUT=10000
```

### Tailwind CSS Customization

Edit `tailwind.config.js` to customize:
- Colors
- Animations
- Fonts
- Breakpoints

---

## 📊 Project Structure

```
src/
├── components/
│   ├── ui/                    # Reusable components
│   │   ├── ParticleBackground.tsx
│   │   ├── NeonText.tsx
│   │   ├── GlassCard.tsx
│   │   ├── GamingButton.tsx
│   │   ├── GamingModal.tsx
│   │   ├── GlowingProgressBar.tsx
│   │   ├── AnimatedCounter.tsx
│   │   ├── Toast.tsx
│   │   ├── LoadingScreen.tsx
│   │   └── SettingsPanel.tsx
│   └── game/
│       ├── GameBoard.tsx
│       └── ScoreDisplay.tsx
├── App.tsx                    # Main component
├── App.css                    # App styles
├── index.css                  # Global styles
└── main.tsx                   # Entry point
```

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Framer Motion 12** - Animations
- **Lucide React 1.14** - Icons
- **Vite 8** - Build tool

### Development
- **PostCSS** - CSS processing
- **ESLint** - Code quality
- **Tailwind Forms** - Form styling

---

## 📖 API Integration

The frontend is ready for backend integration. See [Backend Integration Guide](./BACKEND_INTEGRATION_GUIDE.md) for:
- API endpoints configuration
- Service layer setup
- Error handling
- WebSocket integration
- Caching strategies

---

## 🎯 Performance

- ✅ Code splitting with Vite
- ✅ CSS purging in production
- ✅ GPU acceleration hints
- ✅ Optimized re-renders
- ✅ Lazy loading ready

---

## ♿ Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Focus states
- ✅ High contrast
- ✅ Reduced motion support

---

## 🚀 Future Enhancements

- [ ] Web Audio API sound effects
- [ ] Advanced particle effects
- [ ] Leaderboard system
- [ ] Game replay functionality
- [ ] Customizable themes
- [ ] Performance metrics
- [ ] Social features
- [ ] Advanced statistics

---

## 📱 Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 15+
- Edge 90+

---

## 🤝 Contributing

We welcome contributions! Please:

1. Follow the existing code style
2. Use TypeScript for new components
3. Test responsive design
4. Add documentation
5. Submit pull requests

---

## 📄 License

Part of Chess Arena project.

---

## 📞 Support

For issues and questions, check:
- [Implementation Guide](./IMPLEMENTATION_COMPLETE.md)
- [Backend Integration](./BACKEND_INTEGRATION_GUIDE.md)
- Component documentation in code

---

<div align="center">

**Built with ❤️ for a premium gaming experience**

[⬆ back to top](#-chess-arena---premium-gaming-ui)

</div>
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
