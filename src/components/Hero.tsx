
import { motion, useTransform, useScroll } from 'framer-motion';
import AnimatedText from './AnimatedText';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useEffect, useState, useRef } from 'react';

const Hero = () => {
  const roles = [
    "Python Developer",
    "JavaScript/TypeScript Developer",
    "AI Prompt Engineer",
    "AI Tools Expert"
  ];

  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  
  // Enhanced parallax values for better 3D effect
  const avatarY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const avatarRotate = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  useEffect(() => {
    // Improved scroll handler with performance optimization
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      // Only update state if we actually need to render something different
      if (Math.abs(window.scrollY - scrollY) > 5) {
        setScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY]);

  return (
    <section ref={sectionRef} id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced parallax background effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-radial from-purple/5 to-transparent"
        style={{ 
          y: scrollY * 0.2,
          opacity: useTransform(scrollYProgress, [0, 0.5], [0.3, 0])
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.2 }}
      />
      
      {/* Dynamic 3D grid background */}
      <motion.div
        className="absolute inset-0 grid grid-cols-8 grid-rows-8 pointer-events-none"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.5], [0.05, 0]) }}
      >
        {Array.from({ length: 64 }).map((_, i) => (
          <motion.div
            key={i}
            className="border border-purple/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ delay: i * 0.01, duration: 1 }}
          />
        ))}
      </motion.div>
      
      <div className="section-container flex flex-col lg:flex-row items-center justify-center gap-12 z-10">
        {/* Avatar with enhanced 3D hover effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="perspective"
          style={{ y: avatarY, rotateY: avatarRotate }}
          whileHover={{ scale: 1.05, rotateY: 5 }}
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-purple/30 shadow-xl shadow-purple/20 transform hover:shadow-2xl hover:shadow-purple/30 transition-all duration-300">
            <Avatar className="w-full h-full rounded-full">
              <AvatarImage src="/lovable-uploads/8efe32d5-ce31-4351-a27d-8fbc089a153d.png" alt="Ananth N" className="object-cover" />
              <AvatarFallback className="bg-purple text-4xl">AN</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-gradient-to-tr from-purple/20 to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* Text content with enhanced staggered animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ y: contentY, opacity: contentOpacity }}
          className="z-10 text-center lg:text-left"
        >
          <motion.h2 
            className="text-xl md:text-2xl mb-4 text-purple-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Hello, I'm
          </motion.h2>
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <span className="text-gradient">Ananth N</span>
          </motion.h1>
          <motion.div 
            className="text-2xl md:text-3xl font-semibold mb-8 min-h-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            I'm a <AnimatedText texts={roles} className="text-purple" interval={2500} />
          </motion.div>
          <motion.p 
            className="text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 mb-12 text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Crafting innovative solutions with code and AI expertise. A self-taught developer building the future one project at a time.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {/* Enhanced buttons with 3D effect */}
            <motion.a
              href="#projects"
              className="px-8 py-3 bg-purple rounded-full font-medium text-white shadow-lg shadow-purple/30 hover:bg-purple-vibrant transition-all relative overflow-hidden group"
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="relative z-10">View My Work</span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-vibrant to-purple opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.a>
            <motion.a
              href="#contact"
              className="px-8 py-3 border border-purple rounded-full font-medium text-light hover:bg-purple/10 transition-all relative overflow-hidden group"
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="relative z-10">Contact Me</span>
              <span className="absolute inset-0 bg-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Enhanced floating indicator to scroll down with 3D effect */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ 
          opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]),
          y: [0, 10, 0] 
        }}
        transition={{ 
          delay: 1.5,
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop"
        }}
        style={{
          perspective: "500px",
          transformStyle: "preserve-3d"
        }}
      >
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-400 mb-2">Scroll Down</span>
          <motion.svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="text-purple"
            animate={{ 
              y: [0, 8, 0],
              rotateX: [0, 20, 0]
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut"
            }}
          >
            <path d="M7 13l5 5 5-5" />
          </motion.svg>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
