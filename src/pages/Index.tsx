import { useEffect, useState, lazy, Suspense, memo, useCallback } from "react";
import SmoothScroll from "../components/SmoothScroll";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Lazy load heavy components with prefetch
const ParticleBackground = lazy(() => import("../components/ParticleBackground"));
const Hero = lazy(() => import("../components/Hero"));
const About = lazy(() => import("../components/About"));
const Skills = lazy(() => import("../components/Skills"));
const Projects = lazy(() => import("../components/Projects"));
const Contact = lazy(() => import("../components/Contact"));

// Minimal loading placeholder
const SectionLoader = memo(() => (
  <div className="min-h-[40vh] flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-emerald-500/50 border-t-emerald-500 rounded-full animate-spin" />
  </div>
));

SectionLoader.displayName = 'SectionLoader';

// Quick loading screen - minimal delay
const LoadingScreen = memo(() => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
    <div className="relative z-10 flex flex-col items-center gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-500 animate-spin" />
      </div>
      <p className="text-emerald-400 text-sm font-medium tracking-wider">ANANTH DEV</p>
    </div>
  </div>
));

LoadingScreen.displayName = 'LoadingScreen';

const Index = memo(() => {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // Fast initial load
  useEffect(() => {
    // Check if document is already loaded
    if (document.readyState === 'complete') {
      setIsLoading(false);
      requestAnimationFrame(() => setIsReady(true));
      return;
    }

    // Quick timeout for fast loading
    const quickTimer = setTimeout(() => {
      setIsLoading(false);
      requestAnimationFrame(() => setIsReady(true));
    }, 400);

    // Also listen for window load
    const handleLoad = () => {
      clearTimeout(quickTimer);
      setIsLoading(false);
      requestAnimationFrame(() => setIsReady(true));
    };

    window.addEventListener('load', handleLoad);
    
    return () => {
      clearTimeout(quickTimer);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  // Prefetch components after initial render
  useEffect(() => {
    if (isReady) {
      // Preload other sections in the background
      const prefetchTimeout = setTimeout(() => {
        import("../components/About");
        import("../components/Skills");
        import("../components/Projects");
        import("../components/Contact");
      }, 100);
      
      return () => clearTimeout(prefetchTimeout);
    }
  }, [isReady]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full min-h-screen relative overflow-x-hidden">
      {/* Background - render immediately but with low priority */}
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>
      
      <Navbar />
      
      <main className="relative w-full">
        <SmoothScroll>
          <Suspense fallback={<SectionLoader />}>
            <Hero />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <About />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <Skills />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <Projects />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <Contact />
          </Suspense>
        </SmoothScroll>
      </main>
      
      <Footer />
    </div>
  );
});

Index.displayName = 'Index';

export default Index;
