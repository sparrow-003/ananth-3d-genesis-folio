import { useEffect } from "react";
import SmoothScroll from "../components/SmoothScroll";
import Canvas3D from "../components/Canvas3D";
import ParticleBackground from "../components/ParticleBackground";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Contact from "../components/Contact";

const Index = () => {
  // Preload the fonts and set up the page
  useEffect(() => {
    document.title = "Ananth N - Portfolio";
    // Remove the default focus outline for mouse users, but keep it for keyboard users
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
      {/* 3D Background & Particles */}
      <Canvas3D />
      <ParticleBackground />
      
      {/* Navigation & Smooth Scrolling Wrapper */}
      <Navbar />
      
      <SmoothScroll>
        {/* Main Sections */}
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
