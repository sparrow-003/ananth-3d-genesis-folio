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
  const [is3DEnabled, setIs3DEnabled] = useState(false);
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

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-black to-teal-950/20" />
        
        {/* Main loading content */}
        <div className="relative z-10 flex flex-col items-center gap-8">
          {/* Glowing orb */}
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 blur-xl opacity-50 animate-pulse" />
            <div className="absolute inset-2 rounded-full border-2 border-emerald-500/50 animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-4 rounded-full border-2 border-teal-400/50 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
            <div className="absolute inset-6 rounded-full bg-emerald-500/20 animate-pulse" />
          </div>
          
          {/* Loading text */}
          <div className="text-center space-y-2">
            <p className="text-emerald-400/60 text-sm tracking-widest uppercase">You're looking into</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-gradient animate-pulse">
              ANANTH DEV
            </h1>
          </div>
          
          {/* Loading bar */}
          <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full animate-loading-bar" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <ParticleBackground />
      
      <Navbar />
      
      <main className="relative w-full">
        <SmoothScroll>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </SmoothScroll>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
