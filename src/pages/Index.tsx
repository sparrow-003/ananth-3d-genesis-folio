
import { useEffect, Suspense, lazy } from "react";
import SmoothScroll from "../components/SmoothScroll";
import ParticleBackground from "../components/ParticleBackground";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Contact from "../components/Contact";

// Lazy load Canvas3D component with improved error handling
const Canvas3D = lazy(() => 
  import("../components/Canvas3D").catch(() => {
    console.error("Failed to load Canvas3D component");
    return {
      default: () => <div className="w-full h-full bg-dark" />
    };
  })
);

const Index = () => {
  // Preload the fonts and set up the page
  useEffect(() => {
    document.title = "Ananth N - Portfolio";
    // Event listeners for focus management
    const handleMouseDown = () => {
      document.body.classList.add('using-mouse');
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.remove('using-mouse');
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1]">
        <Suspense fallback={<div className="w-full h-full bg-dark" />}>
          <ErrorBoundary>
            <Canvas3D />
          </ErrorBoundary>
        </Suspense>
      </div>
      
      <ParticleBackground />
      
      <Navbar />
      
      <SmoothScroll>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </SmoothScroll>
    </>
  );
};

// Simple error boundary component
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error("Error in 3D rendering:", error);
    return <div className="w-full h-full bg-dark" />;
  }
};

export default Index;
