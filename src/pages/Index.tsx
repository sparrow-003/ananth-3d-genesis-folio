import React, { useEffect, Suspense, lazy, useState } from "react";
import SmoothScroll from "../components/SmoothScroll";
import ParticleBackground from "../components/ParticleBackground";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

// Simple fallback component for 3D canvas
const Canvas3DFallback = () => (
  <div className="w-full h-full bg-gradient-to-b from-dark to-violet-500/5 flex items-center justify-center">
    <div className="text-violet-400 animate-pulse">Loading 3D environment...</div>
  </div>
);

// Define proper interface for ErrorBoundary props and state
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Enhanced ErrorBoundary component with proper TypeScript types
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Error in component:", error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-full h-full bg-dark flex items-center justify-center">
          <div className="text-red-500 p-4 text-center">
            <p className="text-xl">Something went wrong</p>
            <button 
              className="mt-4 px-4 py-2 bg-violet-600 rounded-md text-white"
              onClick={() => this.setState({ hasError: false })}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy load Canvas3D component with improved error handling
const Canvas3D = lazy(() => 
  import("../components/Canvas3D").catch((error) => {
    console.error("Failed to load Canvas3D component:", error);
    return { default: Canvas3DFallback };
  })
);

const Index = () => {
  const [is3DEnabled, setIs3DEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Preload the fonts and set up the page
  useEffect(() => {
    document.title = "Ananth N - Portfolio";
    
    // Load the avatar flip CSS file
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/styles/avatar-flip.css';
    document.head.appendChild(link);
    
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
    const handleError = (event: ErrorEvent | Event) => {
      // Check for specific 3D-related errors
      const message = 'message' in event ? event.message : '';
      if (
        message && (
          message.includes('THREE') || 
          message.includes('WebGL') ||
          message.includes('lov') ||
          message.includes('Cannot read properties of undefined') ||
          message.includes('Context Lost')
        )
      ) {
        console.error('3D rendering error detected:', message);
        setIs3DEnabled(false);
      }
    };
    
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('error', handleError);
    
    // Simulate loading state with cinematic fade-in
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('error', handleError);
      clearTimeout(timer);
    };
  }, []);

  // Loading screen with cinematic effect
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-dark z-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-b-transparent border-l-violet-500 border-r-green-500 animate-spin"></div>
            <div className="absolute inset-1 rounded-full border-4 border-t-transparent border-b-transparent border-l-green-500 border-r-yellow-500 animate-spin-slow"></div>
          </div>
          <p className="text-gradient text-xl mt-4 animate-pulse">Loading Cinematic Experience...</p>
        </div>
      </div>
    );
  }

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
      
      <main className="pt-16 sm:pt-20">
        <SmoothScroll>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </SmoothScroll>
      </main>
      
      <Footer />
    </>
  );
};

export default Index;
