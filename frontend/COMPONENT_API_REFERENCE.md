# Component API Reference

## UI Components Library

Complete documentation of all available components with props and usage examples.

---

## 📦 Core Components

### 1. NeonText

Glowing neon-style text component with color variants.

**Props:**
```typescript
interface NeonTextProps {
  children: React.ReactNode;
  className?: string;
  color?: 'cyan' | 'pink' | 'purple' | 'green';
}
```

**Usage:**
```tsx
<NeonText color="cyan" className="text-3xl">
  CHESS ARENA
</NeonText>
```

**Colors:**
- `cyan` - Bright cyan glow (#00d9ff)
- `pink` - Bright pink glow (#ec4899)
- `purple` - Purple glow (#a855f7)
- `green` - Green glow (#22c55e)

---

### 2. GlassCard

Glassmorphic container with frosted glass effect.

**Props:**
```typescript
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  neon?: boolean;
}
```

**Usage:**
```tsx
<GlassCard neon hover className="p-6">
  <h3>Game Stats</h3>
  {/* Content */}
</GlassCard>
```

**Features:**
- `hover` - Scale animation on hover (default: true)
- `neon` - Add neon glow border (default: false)
- Glassmorphism effect with backdrop blur
- Shine effect overlay

---

### 3. GamingButton

Premium gaming button with multiple variants and animations.

**Props:**
```typescript
interface GamingButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}
```

**Usage:**
```tsx
<GamingButton
  variant="primary"
  size="lg"
  onClick={handleClick}
>
  Play Game
</GamingButton>
```

**Variants:**
- `primary` - Purple to cyan gradient (default)
- `secondary` - Cyan to green gradient
- `accent` - Pink to purple gradient
- `danger` - Red gradient

**Sizes:**
- `sm` - Small button
- `md` - Medium button (default)
- `lg` - Large button

---

### 4. GamingModal

Cinematic modal dialog with animations.

**Props:**
```typescript
interface GamingModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  actions?: ModalAction[];
}

interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
}
```

**Usage:**
```tsx
<GamingModal
  title="VICTORY!"
  onClose={() => setShowModal(false)}
  actions={[
    { label: 'Play Again', onClick: handleReplay },
    { label: 'Menu', onClick: handleMenu, variant: 'secondary' }
  ]}
>
  <p>Congratulations! You won!</p>
</GamingModal>
```

**Features:**
- Backdrop with blur effect
- Glowing neon border
- Spring animations
- Action buttons with variants
- Close button with rotate animation

---

### 5. GlowingProgressBar

Animated progress bar with neon glow effects.

**Props:**
```typescript
interface GlowingProgressBarProps {
  value: number;
  max?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  label?: string;
  showPercentage?: boolean;
}
```

**Usage:**
```tsx
<GlowingProgressBar
  value={75}
  max={100}
  color="cyan"
  label="XP Progress"
  showPercentage={true}
/>
```

**Features:**
- Smooth animated fill
- Shimmer shine effect
- Percentage display
- Color variants with glow
- Optional label

---

### 6. AnimatedCounter

Smooth number counting animation.

**Props:**
```typescript
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  color?: 'cyan' | 'pink' | 'purple' | 'green';
}
```

**Usage:**
```tsx
<AnimatedCounter
  value={score}
  prefix="Score: "
  suffix=" pts"
  color="cyan"
  duration={0.6}
/>
```

**Features:**
- Smooth counting animation
- Customizable duration
- Prefix/suffix text
- Color variants
- Scale animation on value change

---

### 7. Toast

Notification component with types.

**Props:**
```typescript
interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: (id: string) => void;
}
```

**Usage:**
```tsx
const [toasts, setToasts] = useState<Toast[]>([]);

const showToast = (message: string, type: 'success' | 'error' = 'info') => {
  const id = Date.now().toString();
  setToasts([...toasts, { id, message, type }]);
};

<div>
  {toasts.map(toast => (
    <Toast
      key={toast.id}
      {...toast}
      onClose={(id) => setToasts(toasts.filter(t => t.id !== id))}
    />
  ))}
</div>
```

**Types:**
- `success` - Green gradient with checkmark
- `error` - Red gradient with alert icon
- `info` - Cyan gradient with info icon
- `warning` - Yellow gradient with alert icon

---

### 8. LoadingScreen

Immersive loading screen with animations.

**Props:**
```typescript
interface LoadingScreenProps {
  progress?: number;
  text?: string;
}
```

**Usage:**
```tsx
{isLoading && (
  <LoadingScreen
    progress={75}
    text="Loading game..."
  />
)}
```

**Features:**
- Animated title
- Multi-ring spinner
- Progress bar
- Custom loading text
- Gradient background animations

---

### 9. SettingsPanel

Settings panel with toggles and info.

**Props:**
```typescript
interface SettingsPanelProps {
  darkMode: boolean;
  soundEnabled: boolean;
  onDarkModeChange: (enabled: boolean) => void;
  onSoundChange: (enabled: boolean) => void;
  onClose: () => void;
}
```

**Usage:**
```tsx
<SettingsPanel
  darkMode={darkMode}
  soundEnabled={sound}
  onDarkModeChange={setDarkMode}
  onSoundChange={setSound}
  onClose={() => setShowSettings(false)}
/>
```

**Features:**
- Sound toggle with icon
- Dark mode toggle with icon
- Game info section
- Animated toggle switches
- Close button

---

### 10. ParticleBackground

Animated particle background system.

**Props:**
```typescript
// No props - mounts globally
```

**Usage:**
```tsx
<ParticleBackground />
```

**Features:**
- 50 animated particles
- Gradient overlays (purple, cyan, pink)
- Grid pattern overlay
- Floating animations
- Responsive sizing

---

### 11. GameBoard

Interactive chess board component.

**Props:**
```typescript
interface GameBoardProps {
  onScoreUpdate?: (points: number, isCombo?: boolean) => void;
}
```

**Usage:**
```tsx
<GameBoard onScoreUpdate={(points) => updateScore(points)} />
```

**Features:**
- 8x8 chess grid
- Square coordinates
- Click to select squares
- Animated piece placement
- Wood texture background
- Status display

---

### 12. ScoreDisplay

Animated statistics and score display.

**Props:**
```typescript
interface GameStats {
  score: number;
  combo: number;
  level: number;
  xp: number;
  nextLevelXp: number;
  moves: number;
  accuracy: number;
}

interface ScoreDisplayProps {
  stats: GameStats;
}
```

**Usage:**
```tsx
<ScoreDisplay
  stats={{
    score: 1000,
    combo: 5,
    level: 3,
    xp: 250,
    nextLevelXp: 500,
    moves: 15,
    accuracy: 95
  }}
/>
```

**Features:**
- Large level display
- XP progress bar
- 4-stat grid (score, combo, accuracy, moves)
- Total score display
- Combo indicator
- Animated counter for all numbers

---

## 🎨 Color System

### Available Colors

```typescript
type NeonColor = 'cyan' | 'pink' | 'purple' | 'green'

// Hex values
cyan:    '#00d9ff'
pink:    '#ec4899'
purple:  '#a855f7'
green:   '#22c55e'
```

---

## 🎬 Animation Utilities

### Framer Motion Variants

```typescript
// Container variant
{
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

// Stagger children
{
  variants: containerVariants,
  initial: 'initial',
  animate: 'animate',
  transition: { staggerChildren: 0.2 }
}
```

### Custom Animations

```css
/* Available animations in Tailwind */
animate-pulse-glow    /* Pulsing glow effect */
animate-float         /* Floating up and down */
animate-shimmer       /* Shimmer effect */
animate-neon-flicker  /* Glitch flickering */
```

---

## 💡 Usage Patterns

### Layout Pattern

```tsx
<div className="min-h-screen bg-gaming-dark">
  <ParticleBackground />
  
  <header className="fixed top-0 z-40 backdrop-blur-md">
    {/* Header content */}
  </header>

  <main className="pt-20">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div>{/* Left content */}</div>
      <div>{/* Center content */}</div>
      <div>{/* Right content */}</div>
    </div>
  </main>
</div>
```

### Modal Pattern

```tsx
import { AnimatePresence } from 'framer-motion';

<AnimatePresence>
  {showModal && (
    <GamingModal
      title="Title"
      onClose={() => setShowModal(false)}
      actions={[...]}
    >
      {/* Content */}
    </GamingModal>
  )}
</AnimatePresence>
```

### Button Group Pattern

```tsx
<div className="space-y-3">
  <GamingButton variant="primary" className="w-full">
    Option 1
  </GamingButton>
  <GamingButton variant="secondary" className="w-full">
    Option 2
  </GamingButton>
</div>
```

### Stats Display Pattern

```tsx
<GlassCard>
  <h3 className="text-lg font-bold text-neon-cyan mb-4">
    Stats
  </h3>
  <div className="grid grid-cols-2 gap-3">
    <div>
      <div className="text-xs text-gray-400">Label</div>
      <AnimatedCounter value={number} />
    </div>
    {/* More stats */}
  </div>
</GlassCard>
```

---

## 🔧 Props Cheat Sheet

```typescript
// NeonText
color?: 'cyan' | 'pink' | 'purple' | 'green'

// GlassCard
hover?: boolean       // Scale on hover
neon?: boolean        // Add glow border

// GamingButton
variant?: 'primary' | 'secondary' | 'accent' | 'danger'
size?: 'sm' | 'md' | 'lg'
disabled?: boolean

// GlowingProgressBar
value: number
max?: number
color?: 'cyan' | 'purple' | 'pink' | 'green'
label?: string
showPercentage?: boolean

// AnimatedCounter
value: number
duration?: number
prefix?: string
suffix?: string
color?: 'cyan' | 'pink' | 'purple' | 'green'
```

---

## 🎯 Component Selection Guide

| Use Case | Component |
|----------|-----------|
| Section title | NeonText |
| Card container | GlassCard |
| Action button | GamingButton |
| Popup dialog | GamingModal |
| Progress display | GlowingProgressBar |
| Number animation | AnimatedCounter |
| Temporary message | Toast |
| Startup UI | LoadingScreen |
| Settings menu | SettingsPanel |
| Background | ParticleBackground |
| Game area | GameBoard |
| Stats display | ScoreDisplay |

---

## 📝 TypeScript Support

All components are fully typed with TypeScript. Example:

```typescript
import type { GamingButtonProps, NeonColor } from './components/ui'

const MyComponent: React.FC = () => {
  const color: NeonColor = 'cyan' // Typed color
  
  const handleClick: GamingButtonProps['onClick'] = () => {
    // Handle click
  }

  return (
    <GamingButton onClick={handleClick}>
      Click me
    </GamingButton>
  )
}
```

---

## 🐛 Troubleshooting

### Component Not Showing
- Check if parent has `z-index` constraints
- Verify imports are correct
- Ensure Framer Motion is installed

### Animation Jittery
- Check GPU acceleration with DevTools
- Reduce particle count
- Profile with Chrome DevTools Performance tab

### Styles Not Applied
- Verify Tailwind content paths
- Check for CSS conflicts
- Clear browser cache

### TypeScript Errors
- Ensure all required props are provided
- Check interface imports
- Verify React version compatibility

---

## 📚 Further Reading

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Component library documentation v1.0**
