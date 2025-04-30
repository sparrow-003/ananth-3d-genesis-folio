
import { useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

interface SmoothScrollProps {
  children: React.ReactNode;
}

const SmoothScroll = ({ children }: SmoothScrollProps) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  // Enhanced parallax effect on scroll
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0.6, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [0.98, 1]);
  
  useEffect(() => {
    // Smooth scrolling behavior
    const handleScroll = () => {
      document.documentElement.style.scrollBehavior = 'smooth';
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-purple z-50 origin-left"
        style={{ scaleX }}
      />
      <motion.div 
        className="flex flex-col"
        style={{ opacity, scale }}
        transition={{ type: "spring", stiffness: 50 }}
      >
        {children}
      </motion.div>
    </>
  );
};

export default SmoothScroll;
