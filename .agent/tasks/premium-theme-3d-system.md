# Premium Theme & 3D Animation System - Implementation Plan

## 🎯 Objective
Build a comprehensive light/dark theme system with 8 premium 3D animation effects, user-controlled performance toggles, progressive enhancement, and global application across all pages.

---

## 📊 User Requirements Summary

| Requirement | Specification |
|------------|---------------|
| **Performance Model** | Toggle system for heavy animations (user-controlled) |
| **Theme Scope** | Global application (Hero, About, Projects, Blog, Contact) |
| **Device Strategy** | Progressive enhancement (CSS base + WebGL bonus) |
| **Animation Intensity** | Match dark/light mode intensity (same angles, counts) |
| **Implementation Scope** | Entire site overhaul (header + all sections) |

---

## 🏗️ Architecture Overview

### **Core Systems**

```
src/
├── contexts/
│   ├── ThemeContext.tsx           # Enhanced theme provider with animation preferences
│   └── AnimationContext.tsx       # Centralized animation control system
├── hooks/
│   ├── useTheme.ts               # Theme consumer hook
│   ├── useAnimationPreference.ts # Animation toggle hook
│   └── useDeviceCapabilities.ts  # Device detection (WebGL, GPU, performance tier)
├── styles/
│   ├── theme.css                 # NEW: Centralized theme variables
│   ├── animations-3d.css         # NEW: 8 premium 3D effect classes
│   └── light-theme.css           # NEW: Light mode specific enhancements
├── components/
│   ├── theme/
│   │   ├── ThemeToggle.tsx       # Enhanced with animation controls
│   │   ├── AnimationToggle.tsx   # NEW: User preference toggle
│   │   └── ThemeControlPanel.tsx # NEW: Settings panel (theme + animations)
│   └── effects/
│       ├── CardTilt3D.tsx        # Effect 1: Soft 3D Card Tilt
│       ├── GlassPlane.tsx        # Effect 2: Glass/Light Refraction
│       ├── IsometricModel.tsx    # Effect 3: Isometric Campus (WebGL)
│       ├── FloatingOrbs.tsx      # Effect 4: Molecule Grid
│       ├── Typography3D.tsx      # Effect 5: Extruded Text
│       ├── MorphTransition.tsx   # Effect 6: Card→Modal Morph
│       ├── ParallaxLayers.tsx    # Effect 7: Depth Scroll
│       └── CinematicSweep.tsx    # Effect 8: Camera Pan
└── utils/
    ├── deviceDetection.ts        # WebGL check, GPU tier detection
    └── animationHelpers.ts       # FLIP, RAF utilities
```

---

## 🎨 Phase 1: Theme System Foundation

### **1.1 Enhanced Theme Context**

**File**: `src/contexts/ThemeContext.tsx`

**Features**:
- Light/Dark/System modes
- CSS variable injection for both themes
- LocalStorage persistence
- System preference detection

**Light Theme Colors**:
```css
/* Pure white & vibrant blue with gold accents */
--light-bg-primary: hsl(0, 0%, 100%);          /* Pure white */
--light-bg-secondary: hsl(214, 32%, 98%);      /* Off-white */
--light-accent-blue: hsl(217, 91%, 50%);       /* Vibrant blue */
--light-accent-gold: hsl(45, 100%, 51%);       /* Gold highlights */
--light-text-primary: hsl(222, 47%, 8%);       /* Deep blue-black */
--light-shadow: hsla(217, 91%, 50%, 0.12);     /* Soft blue shadow */

/* Card styles */
--light-card-bg: hsla(0, 0%, 100%, 0.95);      /* Porcelain white */
--light-card-border: hsla(217, 80%, 55%, 0.2); /* Subtle blue border */
--light-card-shadow: 0 8px 32px hsla(217, 91%, 50%, 0.08);
```

**Dark Theme Colors** (existing):
- Keep current cyan/deep-blue aesthetic
- Match intensity with light theme effects

### **1.2 Animation Preference System**

**File**: `src/contexts/AnimationContext.tsx`

**States**:
- `reducedMotion` (boolean) - OS preference
- `userPreference` ('full' | 'reduced' | 'off')
- `effectiveMode` - Computed final state

**Logic**:
```typescript
effectiveMode = 
  reducedMotion ? 'reduced' : 
  userPreference === 'off' ? 'off' :
  userPreference === 'reduced' ? 'reduced' : 
  'full'
```

**Storage**: LocalStorage key `animation-preference`

---

## 🌟 Phase 2: 8 Premium 3D Effects

### **Effect 1: Soft 3D Card Tilt + Multi-Layer Shadow**

**Component**: `CardTilt3D.tsx`

**Technical Spec**:
- **CSS Base**: `transform: perspective(1000px) rotateX() rotateY()`
- **JS Enhancement**: `pointermove` listener → tilt angle calculation
- **Layers**: 3 divs (content, shadow blur, sheen gradient)
- **Light Theme**: Porcelain white, warm-gray shadow, gold edge on hover
- **Dark Theme**: Deep blue card, cyan glow shadow, bright edge

**Performance**:
- Use `requestAnimationFrame` for smooth updates
- `will-change: transform` optimization
- Cap tilt: ±12° max
- Disable on `prefers-reduced-motion`

**CSS Classes**:
```css
.card-tilt-3d { /* base styles */ }
.card-tilt-3d-light { /* light theme overrides */ }
.card-tilt-3d-dark { /* dark theme overrides */ }
.card-tilt-3d-reduced { /* minimal motion fallback */ }
```

---

### **Effect 2: Glass Plane / Light Refraction**

**Component**: `GlassPlane.tsx`

**Technical Spec**:
- **CSS**: `backdrop-filter: blur(24px)`
- **Progressive**: CSS-only → WebGL shader (if supported)
- **Light Theme**: Pale frosted white, warm-gold sheen, rainbow dispersion (very low opacity)
- **Dark Theme**: Dark frosted glass, cyan edge glow

**Refraction Shader** (WebGL bonus):
```glsl
// Subtle holographic dispersion
uniform vec3 lightDirection;
varying vec2 vUv;

void main() {
  // Rainbow chromatic aberration
  float r = texture2D(tex, vUv + 0.002).r;
  float g = texture2D(tex, vUv).g;
  float b = texture2D(tex, vUv - 0.002).b;
  gl_FragColor = vec4(r, g, b, 0.9);
}
```

**Fallback**: Multi-layer CSS gradients

---

### **Effect 3: Isometric / Low-Poly Campus Model**

**Component**: `IsometricModel.tsx`

**Technical Spec**:
- **Library**: Three.js (lazy loaded)
- **Geometry**: Low-poly (~500 vertices max)
- **Light Theme**: Soft stone/off-white surfaces, muted gold roofs, pale shadows
- **Dark Theme**: Dark blue surfaces, cyan highlights

**Loading Strategy**:
```typescript
// Lazy load Three.js only if:
1. Device supports WebGL
2. Animation preference !== 'off'
3. IntersectionObserver detects visibility

// Placeholder: 2D SVG isometric illustration
```

**Performance**:
- Single directional light (no shadows)
- Baked ambient occlusion texture
- 30 FPS cap on mobile
- Pause when out of viewport

---

### **Effect 4: Floating Orbs / Molecule Grid**

**Component**: `FloatingOrbs.tsx`

**Technical Spec**:
- **CSS Mode**: 5-8 orbs, CSS animations
- **Canvas Mode**: 20-30 orbs, Canvas2D with parallax
- **WebGL Mode**: 50+ orbs, additive blending

**Light Theme**:
- Pearlescent spheres (opacity: 0.1-0.3)
- Gold rim highlights
- Soft blue glow

**Dark Theme**:
- Cyan/teal spheres (opacity: 0.2-0.4)
- Bright cyan rim

**Movement**: Perlin noise for organic motion

---

### **Effect 5: Subtle 3D Typographic Extrusion**

**Component**: `Typography3D.tsx`

**Technical Spec**:
- **CSS**: Text-shadow stacking (6-8 layers)
- **Light Theme**: Warm-gray extrusion, gilt edge on top
- **Dark Theme**: Deep blue extrusion, cyan highlight

**Animation**: Rotate light angle on scroll (cheap gradient shift)

```css
.typography-3d {
  text-shadow:
    1px 1px 0 hsl(var(--extrusion-1)),
    2px 2px 0 hsl(var(--extrusion-2)),
    /* ... 6 layers ... */
    6px 6px 20px hsla(var(--glow), 0.3);
}
```

---

### **Effect 6: Card → Modal Shared 3D Morph**

**Component**: `MorphTransition.tsx`

**Technical Spec**:
- **Pattern**: FLIP technique (First, Last, Invert, Play)
- **Library**: Framer Motion `layoutId`
- **Light Theme**: Pearl-white modal, gold focus outline
- **Dark Theme**: Deep blue modal, cyan outline

**Implementation**:
```tsx
<motion.div layoutId="card-123" className="card" />
// Becomes on click:
<motion.div layoutId="card-123" className="modal" />
```

**Depth Effect**: `translateZ(50px)` during transition

---

### **Effect 7: Parallax Layered Scroll with Depth**

**Component**: `ParallaxLayers.tsx`

**Technical Spec**:
- **Layers**: 3-4 planes (background, mid, foreground)
- **Movement**: 2-8% offset based on scroll
- **Light Theme**: White surfaces, soft indigo/gold accents
- **Dark Theme**: Dark blue surfaces, cyan accents

**Scroll Listener**:
```typescript
useEffect(() => {
  const handleScroll = () => {
    const scrollY = window.scrollY;
    layer1.style.transform = `translateY(${scrollY * 0.02}px)`;
    layer2.style.transform = `translateY(${scrollY * 0.05}px)`;
    layer3.style.transform = `translateY(${scrollY * 0.08}px)`;
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
}, []);
```

---

### **Effect 8: Mini Cinematic Camera Sweep**

**Component**: `CinematicSweep.tsx`

**Technical Spec**:
- **CSS Mode**: Parallax with CSS animations (2.5D)
- **WebGL Mode**: Three.js camera orbit (true 3D)
- **Duration**: 30-40s per loop
- **Easing**: `cubic-bezier(0.45, 0.05, 0.55, 0.95)`

**Light Theme**: Soft vignette, warm rim lighting
**Dark Theme**: Deep vignette, cyan edge glow

**Controls**: Pause/stop button (accessibility)

---

## 🎛️ Phase 3: User Controls

### **3.1 Animation Toggle Component**

**File**: `src/components/theme/AnimationToggle.tsx`

**UI Design**:
```
[Icon: ⚡] Animations
┌─────────────────────┐
│ ● Full Effects      │ <- Default
│ ○ Reduced Motion    │
│ ○ Disable All       │
└─────────────────────┘
```

**Integration**: Add to navbar or settings panel

### **3.2 Theme Control Panel**

**File**: `src/components/theme/ThemeControlPanel.tsx`

**Sections**:
1. **Theme**: Light / Dark / System
2. **Animations**: Full / Reduced / Off
3. **Preview**: Live card showing current settings

---

## 🚀 Phase 4: Global Application

### **4.1 Page-by-Page Integration**

| Page | Effects to Apply | Priority |
|------|------------------|----------|
| **Hero** | CardTilt3D, FloatingOrbs, Typography3D | High |
| **About** | GlassPlane, ParallaxLayers | High |
| **Skills** | CardTilt3D, MorphTransition | Medium |
| **Projects** | CardTilt3D, IsometricModel | High |
| **Blog** | GlassPlane, Typography3D | Medium |
| **Contact** | FloatingOrbs, CinematicSweep | Medium |

### **4.2 Header/Navbar Updates**

**Changes**:
- Replace current `ThemeToggle` with enhanced version
- Add `AnimationToggle` button
- Apply GlassPlane effect to navbar background
- Light theme: Pure white glass with blue accent
- Dark theme: Deep blue glass with cyan accent

---

## ⚡ Phase 5: Performance Optimization

### **5.1 Device Capability Detection**

**File**: `src/utils/deviceDetection.ts`

**Checks**:
```typescript
export const deviceCapabilities = {
  webGL: detectWebGL(),
  gpuTier: detectGPUTier(), // low/mid/high
  reducedMotion: window.matchMedia('(prefers-reduced-motion)').matches,
  deviceMemory: navigator.deviceMemory || 4,
  hardwareConcurrency: navigator.hardwareConcurrency || 2
};

export const shouldUseWebGL = () => {
  return deviceCapabilities.webGL && 
         deviceCapabilities.gpuTier !== 'low' &&
         !deviceCapabilities.reducedMotion;
};
```

### **5.2 Lazy Loading Strategy**

**Pattern**:
```tsx
// Heavy components only load when visible + capable
const IsometricModel = lazy(() => 
  shouldUseWebGL() 
    ? import('./effects/IsometricModel')
    : import('./effects/IsometricModelFallback')
);

<Suspense fallback={<IsometricPlaceholder />}>
  <IsometricModel />
</Suspense>
```

### **5.3 Progressive Enhancement Tiers**

| Device Tier | Effects Enabled | Notes |
|-------------|----------------|-------|
| **Low** (old mobile) | CSS-only (CardTilt, Typography) | No WebGL, reduced particles |
| **Mid** (modern mobile) | CSS + Canvas2D (FloatingOrbs) | Limited WebGL |
| **High** (desktop/gaming) | Full WebGL (IsometricModel, Shaders) | All effects unlocked |

---

## ✅ Verification Checklist

### **Functional Requirements**
- [ ] Light/Dark theme toggle works globally
- [ ] Theme persists across page reloads (localStorage)
- [ ] System theme detection works
- [ ] Animation toggle: Full/Reduced/Off modes
- [ ] `prefers-reduced-motion` auto-detection
- [ ] All 8 effects render correctly in light mode
- [ ] All 8 effects render correctly in dark mode
- [ ] Effects respect animation preference

### **Performance Requirements**
- [ ] WebGL checks before heavy effects
- [ ] Lazy loading for 3D components
- [ ] IntersectionObserver for viewport awareness
- [ ] 60 FPS on desktop (Chrome DevTools Performance)
- [ ] 30+ FPS on mid-tier mobile (throttled CPU)
- [ ] No layout shift (CLS < 0.1)
- [ ] Animations pause when tab inactive

### **Accessibility Requirements**
- [ ] Keyboard navigation for all controls
- [ ] ARIA labels on toggle buttons
- [ ] Focus visible on all interactive elements
- [ ] Pause/stop controls for continuous animations
- [ ] Reduced motion preference respected
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)

### **Browser Compatibility**
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS 15+)
- [ ] Chrome Android (latest)

---

## 📦 Dependencies to Install

```bash
# Three.js for WebGL effects
npm install three @types/three

# GSAP for advanced animations (optional, can use Framer Motion)
npm install gsap

# Device detection
npm install ua-parser-js

# Already have: framer-motion, lucide-react
```

---

## 🗂️ File Manifest

### **New Files (22)**
```
src/contexts/AnimationContext.tsx
src/hooks/useAnimationPreference.ts
src/hooks/useDeviceCapabilities.ts
src/styles/theme.css
src/styles/animations-3d.css
src/styles/light-theme.css
src/components/theme/AnimationToggle.tsx
src/components/theme/ThemeControlPanel.tsx
src/components/effects/CardTilt3D.tsx
src/components/effects/GlassPlane.tsx
src/components/effects/IsometricModel.tsx
src/components/effects/FloatingOrbs.tsx
src/components/effects/Typography3D.tsx
src/components/effects/MorphTransition.tsx
src/components/effects/ParallaxLayers.tsx
src/components/effects/CinematicSweep.tsx
src/utils/deviceDetection.ts
src/utils/animationHelpers.ts
```

### **Modified Files (8)**
```
src/components/ThemeToggle.tsx         # Enhanced version
src/components/theme-provider.tsx      # Add animation context
src/components/Navbar.tsx              # Integrate new controls
src/components/Hero.tsx                # Apply effects
src/components/About.tsx               # Apply effects
src/components/Projects.tsx            # Apply effects
src/components/Blog.tsx                # Apply effects (if exists)
src/components/Contact.tsx             # Apply effects
src/index.css                          # Import new CSS files
```

---

## 🎯 Implementation Order

1. ✅ **Phase 1**: Theme System Foundation (2 hours)
   - AnimationContext, device detection, hooks
2. ✅ **Phase 2A**: CSS-Only Effects (2 hours)
   - CardTilt3D, Typography3D, GlassPlane (CSS mode)
3. ✅ **Phase 2B**: Canvas Effects (2 hours)
   - FloatingOrbs, ParallaxLayers
4. ✅ **Phase 2C**: WebGL Effects (3 hours)
   - IsometricModel, CinematicSweep, GlassPlane (shader mode)
5. ✅ **Phase 3**: User Controls (1 hour)
   - AnimationToggle, ThemeControlPanel
6. ✅ **Phase 4**: Global Application (2 hours)
   - Integrate into all pages
7. ✅ **Phase 5**: Optimization & Testing (2 hours)
   - Performance profiling, accessibility audit

**Total Estimated Time**: 14 hours

---

## 🎨 Design Tokens Reference

### **Light Theme Palette**
```css
--light-primary: hsl(217, 91%, 50%);      /* Vibrant Blue */
--light-secondary: hsl(214, 32%, 91%);    /* Light Gray-Blue */
--light-accent: hsl(45, 100%, 51%);       /* Gold */
--light-bg: hsl(0, 0%, 100%);             /* Pure White */
--light-surface: hsla(0, 0%, 100%, 0.95); /* Porcelain */
--light-text: hsl(222, 47%, 8%);          /* Deep Blue-Black */
--light-shadow: hsla(217, 91%, 50%, 0.12);
--light-glow: hsla(45, 100%, 51%, 0.3);   /* Gold Glow */
```

### **Dark Theme Palette** (Existing)
```css
--dark-primary: hsl(199, 89%, 48%);       /* Cyan */
--dark-bg: hsl(222, 47%, 4%);             /* Deep Blue-Black */
--dark-surface: hsl(222, 47%, 6%);
--dark-text: hsl(210, 40%, 98%);
--dark-shadow: hsla(199, 89%, 48%, 0.35);
--dark-glow: hsla(199, 89%, 48%, 0.25);
```

---

## 🔒 Accessibility Compliance

- ✅ WCAG 2.1 Level AA
- ✅ `prefers-reduced-motion` support
- ✅ User-controlled animation toggle
- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Focus management
- ✅ Pause controls for auto-playing animations

---

**END OF PLAN**
