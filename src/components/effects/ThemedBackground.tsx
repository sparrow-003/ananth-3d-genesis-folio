import { lazy, Suspense, memo } from 'react';
import { useTheme } from '@/components/theme-provider';
import { Canvas } from '@react-three/fiber';

// Lazy load backgrounds for performance
const ParticleBackground = lazy(() => import('../ParticleBackground'));
const LightThemeBackground = lazy(() => import('./LightThemeBackground'));
const FallingStars = lazy(() => import('../FallingStars'));

const ThemedBackground = memo(() => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  return (
    <>
      <Suspense fallback={null}>
        {isDark ? <ParticleBackground /> : <LightThemeBackground />}
      </Suspense>
      
      {/* Falling stars effect for dark mode */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none z-[1]">
          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 15], fov: 60 }}
              style={{ background: 'transparent' }}
              gl={{ alpha: true, antialias: false }}
              dpr={[1, 1.5]}
            >
              <ambientLight intensity={0.3} />
              <FallingStars />
            </Canvas>
          </Suspense>
        </div>
      )}
    </>
  );
});

ThemedBackground.displayName = 'ThemedBackground';

export default ThemedBackground;