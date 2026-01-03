
import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue } from 'framer-motion';

interface SmoothScrollProps {
  children: React.ReactNode;
}

const SmoothScroll = ({ children }: SmoothScrollProps) => {
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scrollY = useMotionValue(0);
  
  // Ultra-smooth spring animation for progress bar
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.0001
  });
  
  // Smoother parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  
  // Smooth scroll implementation with lerp
  const smoothScrollTo = useCallback((target: number, duration: number = 800) => {
    const start = window.scrollY;
    const change = target - start;
    const startTime = performance.now();
    
    const easeOutExpo = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    
    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      
      window.scrollTo(0, start + change * eased);
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
  }, []);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 150);
    
    // Enhanced smooth scrolling CSS
    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.style.scrollBehavior = 'smooth';
    
    // Smooth parallax effect with requestAnimationFrame
    let ticking = false;
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      lastScrollY = window.scrollY;
      
      if (!ticking) {
        requestAnimationFrame(() => {
          const sections = document.querySelectorAll('section');
          sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 1.2 && rect.bottom > -100;
            
            if (isVisible) {
              const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
              const clampedProgress = Math.max(0, Math.min(1, progress));
              const translateY = clampedProgress * 20;
              const sectionOpacity = 0.85 + (clampedProgress * 0.15);
              
              section.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease';
              section.style.transform = `translateY(${translateY}px)`;
              section.style.opacity = sectionOpacity.toString();
            }
          });
          
          scrollY.set(lastScrollY);
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    // Use passive scroll listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    // Intercept anchor link clicks for smooth scrolling
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      
      if (anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href')?.slice(1);
        const targetElement = document.getElementById(targetId || '');
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80;
          smoothScrollTo(offsetTop, 1000);
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleAnchorClick);
    };
  }, [scrollY, smoothScrollTo]);

  return (
    <>
      {/* AI-Enhanced Progress bar with gradient */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 via-cyan-500 to-green-500 z-[100] origin-left shadow-lg shadow-emerald-500/50"
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
              className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-400/50 group-hover:bg-emerald-500 transition-all"
              style={{
                backgroundColor: useTransform(
                  scrollYProgress,
                  [i * 0.2, (i + 1) * 0.2],
                  ['rgba(16, 185, 129, 0.3)', 'rgba(16, 185, 129, 1)']
                ).get(),
                scale: useTransform(
                  scrollYProgress,
                  [i * 0.2, (i + 1) * 0.2],
                  [1, 1.5]
                ).get(),
              }}
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-emerald-900/80 px-2 py-1 rounded backdrop-blur-sm">
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </span>
          </motion.a>
        ))}
      </motion.div>
      
      {/* Render children with enhanced animations */}
      <motion.div 
        ref={scrollRef}
        className="flex flex-col w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ duration: 0.8 }}
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
            <span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
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
                className="text-emerald-400"
              >
                <path d="M7 13l5 5 5-5" />
                <path d="M7 7l5 5 5-5" />
              </svg>
              <motion.div
                className="absolute inset-0 rounded-full bg-emerald-500/30 blur-xl"
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

