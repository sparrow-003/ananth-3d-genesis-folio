
import { useEffect, Suspense, lazy, useState } from "react";
import SmoothScroll from "../components/SmoothScroll";
import ParticleBackground from "../components/ParticleBackground";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Contact from "../components/Contact";

// Simple fallback component for 3D canvas
const Canvas3DFallback = () => (
  <div className="w-full h-full bg-gradient-to-b from-dark to-purple/5" />
);

// Lazy load Canvas3D component with improved error handling
const Canvas3D = lazy(() => 
  import("../components/Canvas3D").catch(() => {
    console.error("Failed to load Canvas3D component");
    return { default: Canvas3DFallback };
  })
);

const Index = () => {
  const [is3DEnabled, setIs3DEnabled] = useState(true);

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
    
    // Handle errors in 3D rendering
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes('THREE') || event.message.includes('WebGL')) {
        console.error('3D rendering error detected:', event.message);
        setIs3DEnabled(false);
      }
    };
    
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('error', handleError);
    
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <>
      {is3DEnabled && (
        <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1]">
          <Suspense fallback={<Canvas3DFallback />}>
            <ErrorBoundary fallback={<Canvas3DFallback />}>
              <Canvas3D />
            </ErrorBoundary>
          </Suspense>
        </div>
      )}
      
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

// Enhanced error boundary component
const ErrorBoundary = ({ children, fallback = <div className="w-full h-full bg-dark" /> }: 
  { children: React.ReactNode; fallback?: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error("Error in 3D rendering:", error);
      setHasError(true);
    };
    
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);
  
  if (hasError) {
    return <>{fallback}</>;
  }
  
  try {
    return <>{children}</>;
  } catch (error) {
    console.error("Error in 3D rendering component:", error);
    return <>{fallback}</>;
  }
};

export default Index;
