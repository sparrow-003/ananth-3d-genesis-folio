
import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

interface SmoothScrollProps {
  children: React.ReactNode;
}

const SmoothScroll = ({ children }: SmoothScrollProps) => {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  useEffect(() => {
    // Use a shorter delay for initialization
    const timer = setTimeout(() => {
      setMounted(true);
    }, 300);
    
    // Smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-purple z-50 origin-left"
        style={{ scaleX }}
      />
      
      {/* Render children with fade-in animation */}
      <motion.div 
        className="flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {children}
      </motion.div>
      
      {/* Scroll indicator */}
      {mounted && (
        <motion.div 
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 2, delay: 3 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
            className="flex flex-col items-center"
          >
            <span className="text-sm text-gray-400 mb-1">Scroll</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple">
              <path d="M7 13l5 5 5-5" />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default SmoothScroll;
