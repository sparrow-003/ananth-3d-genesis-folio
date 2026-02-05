 import { lazy, Suspense, memo } from 'react';
 import { useTheme } from '@/components/theme-provider';
 
 // Lazy load backgrounds for performance
 const ParticleBackground = lazy(() => import('../ParticleBackground'));
 const LightThemeBackground = lazy(() => import('./LightThemeBackground'));
 
 const ThemedBackground = memo(() => {
   const { resolvedTheme } = useTheme();
   const isDark = resolvedTheme === 'dark';
   
   return (
     <Suspense fallback={null}>
       {isDark ? <ParticleBackground /> : <LightThemeBackground />}
     </Suspense>
   );
 });
 
 ThemedBackground.displayName = 'ThemedBackground';
 
 export default ThemedBackground;