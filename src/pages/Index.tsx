
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
  <div className="w-full h-full bg-gradient-to-b from-dark to-purple/5 flex items-center justify-center">
    <div className="text-purple-light animate-pulse">Loading 3D environment...</div>
  </div>
);

// Enhanced ErrorBoundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error in component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-full h-full bg-dark flex items-center justify-center">
          <div className="text-red-500 p-4 text-center">
            <p className="text-xl">Something went wrong</p>
            <button 
              className="mt-4 px-4 py-2 bg-purple rounded-md text-white"
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
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        document.body.classList.remove('using-mouse');
      }
    };
    
    // Handle errors in 3D rendering
    const handleError = (event) => {
      if (
        event.message && (
          event.message.includes('THREE') || 
          event.message.includes('WebGL') ||
          event.message.includes('lov')
        )
      ) {
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

export default Index;
