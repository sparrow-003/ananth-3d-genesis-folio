
import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

interface SmoothScrollProps {
  children: React.ReactNode;
}

const SmoothScroll = ({ children }: SmoothScrollProps) => {
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  // AI-powered smooth spring animation
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 35,
    restDelta: 0.001
  });
  
  // Dynamic parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 0.95, 0.95, 1]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 200);
    
    // Enhanced smooth scrolling with AI-like prediction
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add parallax effect to sections
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          const translateY = Math.max(0, Math.min(30, progress * 40));
          const sectionOpacity = Math.min(1, Math.max(0.7, progress * 1.5));
          
          section.style.transform = `translateY(${translateY}px)`;
          section.style.opacity = sectionOpacity.toString();
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* AI-Enhanced Progress bar with gradient */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 via-pink-500 to-fuchsia-500 z-[100] origin-left shadow-lg shadow-violet-500/50"
        style={{ scaleX }}
      />
      
      {/* Floating navigation dots */}
      <motion.div
        className="fixed top-1/2 right-6 lg:right-10 transform -translate-y-1/2 z-50 hidden md:flex flex-col gap-4"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : 50 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        {['home', 'about', 'skills', 'projects', 'contact'].map((section, i) => (
          <motion.a
            key={section}
            href={`#${section}`}
            className="group relative"
            whileHover={{ scale: 1.3 }}
            onClick={(e) => {
              e.preventDefault();
              document.querySelector(`#${section}`)?.scrollIntoView({ 
                behavior: 'smooth' 
              });
            }}
          >
            <motion.div
              className="w-3 h-3 rounded-full bg-violet-500/30 border border-violet-400/50 group-hover:bg-violet-500 transition-all"
              style={{
                backgroundColor: useTransform(
                  scrollYProgress,
                  [i * 0.2, (i + 1) * 0.2],
                  ['rgba(139, 92, 246, 0.3)', 'rgba(139, 92, 246, 1)']
                ).get(),
                scale: useTransform(
                  scrollYProgress,
                  [i * 0.2, (i + 1) * 0.2],
                  [1, 1.5]
                ).get(),
              }}
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-violet-900/80 px-2 py-1 rounded backdrop-blur-sm">
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </span>
          </motion.a>
        ))}
      </motion.div>
      
      {/* Render children with enhanced animations */}
      <motion.div 
        ref={scrollRef}
        className="flex flex-col w-full overflow-x-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        style={{
          y: backgroundY,
          opacity: opacity,
        }}
      >
        {children}
      </motion.div>
      
      {/* Animated scroll indicator */}
      {mounted && (
        <motion.div 
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: [1, 0.5, 0], y: [0, 10, 20] }}
          transition={{ duration: 3, delay: 2.5 }}
        >
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatType: "loop",
              ease: "easeInOut"
            }}
            className="flex flex-col items-center"
          >
            <span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400 mb-2">
              Scroll Down
            </span>
            <div className="relative">
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                className="text-violet-400"
              >
                <path d="M7 13l5 5 5-5" />
                <path d="M7 7l5 5 5-5" />
              </svg>
              <motion.div
                className="absolute inset-0 rounded-full bg-violet-500/30 blur-xl"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default SmoothScroll;

