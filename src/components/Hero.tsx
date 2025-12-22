import { motion, useTransform, useScroll } from 'framer-motion';
import AnimatedText from './AnimatedText';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { memo, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Mail, ArrowRight, Download, Briefcase, MapPin, Code } from 'lucide-react';

// Memoized roles array to prevent re-creation
const ROLES = [
  "Vibe Coder",
  "Python Developer", 
  "JavaScript/TypeScript Developer",
  "Teaching Expert",
  "UI/UX Designer",
  "AI Prompt Engineer",
  "Web Developer"
] as const;

// Memoized animation effects
const ANIMATION_EFFECTS = ['avatar-floating', 'avatar-spinning', 'avatar-bouncing', 'avatar-shattering', 'avatar-defying-gravity'] as const;

// Memoized pickup lines
const HR_PICKUP_LINES = [
  "A dreamer who codes worlds beyond the ordinary",
  "Crafting futures where AI and imagination collide",
  "Guiding 150+ minds to awaken their hidden genius",
  "A voice of leadership, turning sparks into fire",
  "Join me on this journey — where vision becomes destiny"
] as const;

const Hero = memo(() => {

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
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);
  
  // State for avatar animation
  const [avatarAnimation, setAvatarAnimation] = useState<string | null>(null);
  const [isAvatarHidden, setIsAvatarHidden] = useState(false);
  const [lastAnimationIndex, setLastAnimationIndex] = useState<number>(-1);
  
  // Reset avatar after animation
  useEffect(() => {
    if (avatarAnimation) {
      const timer = setTimeout(() => {
        setIsAvatarHidden(true);
        
        // Add a small delay before making the avatar reappear
        setTimeout(() => {
          setAvatarAnimation(null);
          setIsAvatarHidden(false);
        }, 500);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [avatarAnimation]);
  
  // Optimized animation handler
  const handleAvatarClick = useCallback(() => {
    if (!avatarAnimation) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * ANIMATION_EFFECTS.length);
      } while (randomIndex === lastAnimationIndex && ANIMATION_EFFECTS.length > 1);
      
      setLastAnimationIndex(randomIndex);
      setAvatarAnimation(ANIMATION_EFFECTS[randomIndex]);
    }
  }, [avatarAnimation, lastAnimationIndex]);
  
  const handleHireMe = useCallback(() => {
    const subject = "Project Inquiry - I'd Like to Hire You";
    const body = `Hello Ananth,

I came across your impressive portfolio website and I'm interested in discussing a potential project with you.

Project Overview:
[Brief description of your project/requirements]

Timeline:
[Your expected timeline]

Budget Range:
[Your budget range if applicable]

Looking forward to hearing from you soon!

Best regards,
[Your Name]`;

    window.location.href = `mailto:thanan757@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, []);

  const [currentPickupLine, setCurrentPickupLine] = useState<string>(HR_PICKUP_LINES[0]);

  // Rotate through pickup lines
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * HR_PICKUP_LINES.length);
      setCurrentPickupLine(HR_PICKUP_LINES[randomIndex]);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

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
    <section ref={sectionRef} id="home" className="relative min-h-screen flex items-center justify-center pt-20 sm:pt-24 w-full">
      {/* Enhanced gradient background with emerald theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-black to-teal-950/20" />
      
      <div className="section-container flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 z-10">
        {/* Avatar with enhanced 3D hover effects and click animations */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
          animate={{ opacity: 1, scale: isAvatarHidden ? 0.5 : 1, rotateY: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="perspective"
          style={{ y: avatarY, rotateY: avatarRotate }}
        >
          <motion.div 
            className={`relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-8 border-emerald-500/70 shadow-2xl shadow-emerald-500/50 transform glow-effect cinematic-border animate-float-3d ${avatarAnimation || ''} ${isAvatarHidden ? 'avatar-reappear' : ''}`}
            whileHover={{ 
              rotate: [0, -5, 5, -5, 0],
              scale: 1.05,
              transition: { duration: 0.5 }
            }}
            onClick={handleAvatarClick}
          >
            <div className="avatar-container group cursor-pointer">
              <Avatar className="w-full h-full rounded-full image-3d flip-card-inner">
                <div className="flip-card-front">
                  <AvatarImage src="/lovable-uploads/cb2d3283-5322-4f2d-80de-6bf5dd7bff68.png" alt="Ananth N" className="object-cover" />
                  <AvatarFallback className="bg-emerald-600 text-4xl">AN</AvatarFallback>
                </div>
                <div className="flip-card-back bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 animate-pulse"></div>
                  <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-float-3d"></div>
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-float-3d" style={{ animationDelay: '1s' }}></div>
                  </div>
                  <div className="text-center relative z-10 p-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="w-24 h-24 mx-auto mb-4 relative">
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-full"
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 180, 360]
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                        <div className="absolute inset-2 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center">
                          <Code className="w-10 h-10 text-white" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Ananth N</h3>
                      <p className="text-sm text-gray-300 mb-1">Vibe Coder</p>
                      <p className="text-xs text-gray-400">Full Stack Developer</p>
                      <motion.div 
                        className="mt-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ✨ Interactive Portfolio
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </Avatar>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-cyan-400/10 pointer-events-none" />
          </motion.div>
          <div className="mt-3 text-center text-xs text-emerald-400 animate-pulse">Click for surprise effects!</div>
          
          {/* Social Media Links - Under Avatar */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <p className="text-sm text-emerald-400 mb-4 text-center font-semibold">Connect With Me</p>
            <div className="flex gap-4 justify-center">
              <motion.a
                href="https://www.linkedin.com/in/ananth-n-583036233"
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-full flex items-center justify-center border border-emerald-500/30 hover:border-emerald-500/60 transition-all group"
                whileHover={{ scale: 1.15, rotate: 5, boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 group-hover:text-emerald-300 transition-colors">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </motion.a>

              <motion.a
                href="https://github.com/sparrow-003"
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-full flex items-center justify-center border border-emerald-500/30 hover:border-emerald-500/60 transition-all group"
                whileHover={{ scale: 1.15, rotate: -5, boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 group-hover:text-emerald-300 transition-colors">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </motion.a>

              <motion.a
                href="https://www.instagram.com/_alexxz_0"
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-full flex items-center justify-center border border-emerald-500/30 hover:border-emerald-500/60 transition-all group"
                whileHover={{ scale: 1.15, rotate: 5, boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 group-hover:text-emerald-300 transition-colors">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </motion.a>

              <motion.a
                href="https://api.whatsapp.com/send?phone=916384227309"
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-full flex items-center justify-center border border-emerald-500/30 hover:border-emerald-500/60 transition-all group"
                whileHover={{ scale: 1.15, rotate: -5, boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 group-hover:text-emerald-300 transition-colors">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </motion.div>

        {/* Text content with enhanced staggered animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ 
            y: contentY,
            opacity: contentOpacity 
          }}
          className="z-10 text-center lg:text-left"
        >
          <motion.h2 
            className="text-xl md:text-2xl mb-4 text-gradient-green"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Hello, I'm
          </motion.h2>
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 cinematic-text"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <span className="text-gradient">ANANTH.N</span>
          </motion.h1>
          <motion.div 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 sm:mb-8 min-h-12 sm:min-h-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            I'm a <AnimatedText texts={[...ROLES]} className="text-emerald-500 animate-perspective-shift" interval={2500} />
          </motion.div>
          <motion.p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto lg:mx-0 mb-6 text-gray-300 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            A dreamer who codes worlds beyond the ordinary, crafting futures where AI and imagination collide. Guiding 150+ minds to awaken their hidden genius, a voice of leadership turning sparks into fire. Join me on this journey — where vision becomes destiny.
          </motion.p>

          {/* Cinematic HR pickup line */}
          <motion.div 
            className="glass-card p-3 mb-12 border border-emerald-500/20 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-teal-500/5"></div>
            <p className="text-gradient italic font-medium">"{currentPickupLine}"</p>
          </motion.div>
          
          <motion.div
            className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {/* Enhanced buttons with 3D effect */}
            <motion.button
              className="px-8 py-3 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-700 rounded-full font-medium text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/50 transition-all relative overflow-hidden group"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 25px rgba(16, 185, 129, 0.6)",
                textShadow: "0 0 8px rgba(255, 255, 255, 0.5)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleHireMe}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Mail size={18} />
                Hire Me Now
                <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            <motion.a
              href="#projects"
              className="px-8 py-3 border border-emerald-500 rounded-full font-medium text-light hover:bg-emerald-500/10 transition-all relative overflow-hidden group"
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                View My Work
                <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.a>
          </motion.div>
          
          {/* Information cards */}
          <motion.div
            className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <motion.div 
              className="cinematic-border bg-dark/40 backdrop-blur-sm p-4 rounded-xl flex items-center gap-3"
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gradient font-semibold">Experience</p>
                <p className="text-xs text-gray-400">Teaching 150+ Students</p>
              </div>
            </motion.div>

            <motion.div 
              className="cinematic-border bg-dark/40 backdrop-blur-sm p-4 rounded-xl flex items-center gap-3"
              whileHover={{ scale: 1.05, rotate: -2 }}
            >
              <div className="w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <p className="text-sm text-gradient-green font-semibold">Location</p>
                <p className="text-xs text-gray-400">Madurai, Tamil Nadu</p>
              </div>
            </motion.div>

            <motion.div 
              className="cinematic-border bg-dark/40 backdrop-blur-sm p-4 rounded-xl flex items-center gap-3"
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <Code className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-gradient-yellow font-semibold">Vibe Skills</p>
                <p className="text-xs text-gray-400">AI/BI, Python, React, Teaching</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Enhanced floating indicator to scroll down with 3D effect */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ 
          opacity: 1,
          y: 0
        }}
        transition={{ 
          delay: 1.5,
          duration: 0.5
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
            className="text-emerald-500"
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
});

Hero.displayName = 'Hero';

export default Hero;
