
import { motion, useTransform, useScroll } from 'framer-motion';
import AnimatedText from './AnimatedText';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useEffect, useState, useRef } from 'react';
import { Mail, ArrowRight, Download, Briefcase, MapPin, Code } from 'lucide-react';

const Hero = () => {
  const roles = [
    "Python Developer",
    "JavaScript/TypeScript Developer",
    "UI/UX Designer",
    "AI Prompt Engineer",
    "Full Stack Developer"
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
  
  // Random animation effect on avatar click, ensuring a different effect each time
  const animationEffects = ['avatar-floating', 'avatar-spinning', 'avatar-bouncing', 'avatar-shattering', 'avatar-defying-gravity'];
  
  const handleAvatarClick = () => {
    if (!avatarAnimation) {
      // Get a random effect that's different from the last one
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * animationEffects.length);
      } while (randomIndex === lastAnimationIndex && animationEffects.length > 1);
      
      const randomEffect = animationEffects[randomIndex];
      setLastAnimationIndex(randomIndex);
      setAvatarAnimation(randomEffect);
      
      // Log the effect for debugging
      console.log(`Avatar animation: ${randomEffect}`);
    }
  };
  
  const handleHireMe = () => {
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

    const mailtoLink = `mailto:thanan757@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  // Catchy lines for HR professionals
  const hrPickupLines = [
    "Turning coffee into code since 2018",
    "Where creativity meets technical excellence",
    "Less talking, more coding - but I do both well",
    "Bringing ideas to life, one pixel at a time",
    "Not just a developer, a problem solver"
  ];

  const [currentPickupLine, setCurrentPickupLine] = useState(hrPickupLines[0]);

  // Rotate through pickup lines
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * hrPickupLines.length);
      setCurrentPickupLine(hrPickupLines[randomIndex]);
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
    <section ref={sectionRef} id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced parallax background effect */}
      <motion.div 
        className="absolute inset-0 -z-10"
        style={{ 
          y: scrollY * 0.2
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.2 }}
      />
      
      {/* Dynamic 3D grid background */}
      <motion.div
        className="absolute inset-0 grid grid-cols-8 grid-rows-8 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
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
        {/* Avatar with enhanced 3D hover effects and click animations */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
          animate={{ opacity: 1, scale: isAvatarHidden ? 0.5 : 1, rotateY: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="perspective"
          style={{ y: avatarY, rotateY: avatarRotate }}
        >
          <motion.div 
            className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-purple/30 shadow-xl shadow-purple/20 transform glow-effect cinematic-border ${avatarAnimation || ''} ${isAvatarHidden ? 'avatar-reappear' : ''}`}
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
                  <AvatarFallback className="bg-purple text-4xl">AN</AvatarFallback>
                </div>
                <div className="flip-card-back bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-xl font-bold">Ananth N</h3>
                    <p className="text-sm">Full Stack Developer</p>
                    <p className="text-xs mt-2">Interactive Resume</p>
                  </div>
                </div>
              </Avatar>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-purple/20 via-green-500/10 to-yellow-400/10 pointer-events-none" />
          </motion.div>
          <div className="mt-3 text-center text-xs text-violet-400 animate-pulse">Click for surprise effects!</div>
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
            className="text-5xl md:text-7xl font-bold mb-4 cinematic-text"
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
            className="text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 mb-6 text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Crafting innovative solutions with code and AI expertise. A self-taught developer building the future one project at a time.
          </motion.p>

          {/* Cinematic HR pickup line */}
          <motion.div 
            className="glass-card p-3 mb-12 border border-violet-500/20 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-green-500/5"></div>
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
              className="px-8 py-3 bg-gradient-to-r from-violet-600 via-violet-500 to-purple-700 rounded-full font-medium text-white shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/50 transition-all relative overflow-hidden group"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 25px rgba(124, 58, 237, 0.6)",
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
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-600 via-green-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            <motion.a
              href="#projects"
              className="px-8 py-3 border border-green-500 rounded-full font-medium text-light hover:bg-green-500/10 transition-all relative overflow-hidden group"
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
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <motion.div 
              className="cinematic-border bg-dark/40 backdrop-blur-sm p-4 rounded-xl flex items-center gap-3"
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <div className="w-10 h-10 bg-violet-500/20 rounded-full flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="text-sm text-gradient font-semibold">Experience</p>
                <p className="text-xs text-gray-400">Full Stack Developer</p>
              </div>
            </motion.div>

            <motion.div 
              className="cinematic-border bg-dark/40 backdrop-blur-sm p-4 rounded-xl flex items-center gap-3"
              whileHover={{ scale: 1.05, rotate: -2 }}
            >
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-400" />
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
              <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Code className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gradient-yellow font-semibold">Tech Stack</p>
                <p className="text-xs text-gray-400">Python, JS, TS, React</p>
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
