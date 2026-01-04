import React, { useEffect, useState, lazy, Suspense, memo } from "react";
import SmoothScroll from "../components/SmoothScroll";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import usePerformanceMetrics from "../hooks/usePerformanceMetrics";

// Lazy load heavy components
const ParticleBackground = lazy(() => import("../components/ParticleBackground"));
const Hero = lazy(() => import("../components/Hero"));
const About = lazy(() => import("../components/About"));
const Skills = lazy(() => import("../components/Skills"));
const Projects = lazy(() => import("../components/Projects"));
const Contact = lazy(() => import("../components/Contact"));

// Simple loading placeholder
const SectionLoader = memo(() => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
  </div>
));

SectionLoader.displayName = 'SectionLoader';

const Index = memo(() => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Log performance metrics to console
  usePerformanceMetrics();

  useEffect(() => {
    
    // Faster loading - 800ms instead of 1500ms
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-black to-teal-950/10" />
        
        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Simple spinner */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-500 animate-spin" />
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-emerald-400/50 text-sm tracking-widest uppercase">Loading</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gradient">ANANTH DEV</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
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
